const { Model } = require('objection');

class ProductView extends Model {
  static get tableName() {
    return 'product_views';
  }
}

module.exports = ProductView;