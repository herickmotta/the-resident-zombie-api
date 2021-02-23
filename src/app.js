const express = require('express');
const cors = require('cors');
require('./utils/loadRelationShips');

const app = express();
app.use(cors());
app.use(express.json());

app.use((error, req, res) => {
  console.log(error);
  return res.sendStatus(500);
});

module.exports = app;
