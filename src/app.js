const express = require('express');
const cors = require('cors');
const { postSurvivor, editSurvivorLocation } = require('./schemas/survivorSchemas');
const InvalidDataError = require('./errors/InvalidDataError');
const survivorsControllers = require('./controllers/survivorsControllers');
require('./utils/loadRelationShips');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/survivors', async (req, res) => {
  const { error } = postSurvivor.validate(req.body);
  if (error) throw new InvalidDataError();
  const survivor = await survivorsControllers.createSurvivor(req.body);

  res.status(201).send(survivor);
});

app.get('/survivors/:id', async (req, res) => {
  const id = +req.params.id;
  const survivor = await survivorsControllers.getSurvivorByPk(id);
  res.send(survivor);
});

app.put('/survivors/:id/lastlocations', async (req, res) => {
  const { error } = editSurvivorLocation.validate(req.body);
  if (error) throw new InvalidDataError();
  const id = +req.params.id;
  const survivor = await survivorsControllers.editSurvivorLocation(id, req.body.lastLocation);
  res.send(survivor);
});

app.post('/survivors/:survivorId/flags/survivors/:infectedId', async (req, res) => {
  const survivorId = +req.params.survivorId;
  const infectedId = +req.params.infectedId;
  await survivorsControllers.flagSurvivorAsInfected(survivorId, infectedId);
  res.sendStatus(200);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log(error);
  if (error instanceof InvalidDataError) {
    return res.sendStatus(422);
  }
  return res.sendStatus(500);
});

module.exports = app;
