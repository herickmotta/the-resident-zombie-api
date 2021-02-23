const dotenv = require('dotenv');
const DB_URL = require('../src/config/constants');

dotenv.config();

module.exports = {
  development: {
    url: DB_URL,
  },
  test: {
    url: DB_URL,
  },
};
