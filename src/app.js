const express = require('express');
require('./utils/loadRelationShips');
require('express-async-errors');
const cors = require('cors');

const InvalidDataError = require('./errors/InvalidDataError');

const survivorRouter = require('./routers/survivorsRouter');
const reportsRouter = require('./routers/reportsRouter');
const resourceRouter = require('./routers/resourcesRouter');
const NotFoundError = require('./errors/NotFoundError');
const ConflictError = require('./errors/ConflictError');
const UnauthorizedError = require('./errors/UnauthorizedError');
const TradeNotEqualError = require('./errors/TradeNotEqualError');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/resources', resourceRouter);
app.use('/survivors', survivorRouter);
app.use('/reports', reportsRouter);
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error instanceof InvalidDataError) {
    return res.sendStatus(422).send(error.message);
  }
  if (error instanceof NotFoundError) {
    return res.sendStatus(404).send(error.message);
  }
  if (error instanceof ConflictError) {
    return res.sendStatus(409).send(error.message);
  }
  if (error instanceof UnauthorizedError) {
    return res.sendStatus(401).send(error.message);
  }
  if (error instanceof TradeNotEqualError) {
    return res.sendStatus(422).send(error.message);
  }
  return res.status(500).send(error.message);
});

module.exports = app;
