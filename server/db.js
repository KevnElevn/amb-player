const initOptions = {

};

const pgp = require('pg-promise')(initOptions);
const cn = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}
const db = pgp(cn);

module.exports = db;
