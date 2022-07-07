const initOptions = {

};

const pgp = require('pg-promise')(initOptions);
let cn;
if(process.env.NODE_ENV === 'production') {
  cn = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }
} else {
  cn = {
    connectionString: process.env.DATABASE_URL,
  }
}
const db = pgp(cn);

module.exports = db;
