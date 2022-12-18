const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'properties';
  }
}

module.exports = User;