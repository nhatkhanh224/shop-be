const { Model } = require('objection');
const knex = require('knex');
const knexfile = require('./knexfile');

function setupDb() {
  const db = knex(knexfile.development);
  Model.knex(db);
}
module.exports = setupDb;