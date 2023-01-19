const { Model } = require('objection');

class Coupon extends Model {
  static get tableName() {
    return 'discounts';
  }
}

module.exports = Coupon;