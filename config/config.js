const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    url: process.env.DATABASE_URL,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
};
