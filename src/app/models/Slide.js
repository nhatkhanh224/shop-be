const { Model } = require('objection');

class Slide extends Model {
  static get tableName() {
    return 'slides';
  }
}

module.exports = Slide;