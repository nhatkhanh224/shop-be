const { Model } = require('objection');

class UserRole extends Model {
  static get tableName() {
    return 'user_roles';
  }
}

module.exports = UserRole;