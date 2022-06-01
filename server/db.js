const connection = require('./connection.js');

const initOptions = {

};

const pgp = require('pg-promise')(initOptions);

const db = pgp(connection);

module.exports = db;
