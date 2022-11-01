const {knexSnakeCaseMappers} = require('objection')
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "root", // replace with your mysql username
      password: "k3984610275", // replace with your mysql password
      database: "webbanhang",
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    seeds: {
      directory: './seeds'
    },
    ...knexSnakeCaseMappers
  },
};
