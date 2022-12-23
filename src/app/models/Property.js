const { Model } = require('objection');

class Property extends Model {
  static get tableName() {
    return 'properties';
  }
}

module.exports = Property;