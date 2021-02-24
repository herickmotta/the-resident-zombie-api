const express = require('express');
require('./utils/loadRelationShips');
require('express-async-errors');
const cors = require('cors');

const InvalidDataError = require('./errors/InvalidDataError');

const survivorRouter = require('./routers/survivorsRouter');
const reportsRouter = require('./routers/reportsRouter');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/survivors', survivorRouter);
app.use('/reports', reportsRouter);
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error instanceof InvalidDataError) {
    return res.sendStatus(422);
  }
  return res.status(500).send(error.message);
});

module.exports = app;
