const { Model } = require('objection');

class Cart extends Model {
  static get tableName() {
    return 'carts';
  }
}

module.exports = Cart;