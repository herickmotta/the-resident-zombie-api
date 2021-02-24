const router = require('express').Router();
const survivorsControllers = require('../controllers/survivorsControllers');
const InvalidDataError = require('../errors/InvalidDataError');
const { postSurvivor, editSurvivorLocationSchema } = require('../schemas/survivorSchemas');

router.post('/', async (req, res) => {
  const { error } = postSurvivor.validate(req.body);
  if (error) throw new InvalidDataError();
  const survivor = await survivorsControllers.createSurvivor(req.body);

  res.status(201).send(survivor);
});

router.get('/:id', async (req, res) => {
  const id = +req.params.id;
  const survivor = await survivorsControllers.getSurvivorByPk(id);
  res.send(survivor);
});

router.put('/:id/lastlocations', async (req, res) => {
  const { error } = editSurvivorLocationSchema.validate(req.body);
  if (error) throw new InvalidDataError();
  const id = +req.params.id;
  const survivor = await survivorsControllers.editSurvivorLocation(id, req.body.lastLocation);
  res.send(survivor);
});

router.post('/:survivorId/flags/survivors/:infectedId', async (req, res) => {
  const survivorId = +req.params.survivorId;
  const infectedId = +req.params.infectedId;
  await survivorsControllers.flagSurvivorAsInfected(survivorId, infectedId);
  res.sendStatus(200);
});

router.post('/:survivor1Id/trades/survivors/:survivor2Id', async (req, res) => {
  const survivor1Id = +req.params.survivor1Id;
  const survivor2Id = +req.params.survivor2Id;
  await survivorsControllers.tradeBetweenSurvivors(survivor1Id, survivor2Id, req.body);
  res.sendStatus(200);
});

router.get('/:id/resources', async (req, res) => {
  const id = +req.params.id;
  const inv = await survivorsControllers.getSurvivorInventory(id);
  res.send(inv);
});

module.exports = router;
