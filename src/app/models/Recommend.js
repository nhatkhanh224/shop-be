const { Model } = require('objection');

class Recommend extends Model {
  static get tableName() {
    return 'recommends';
  }
}

module.exports = Recommend;