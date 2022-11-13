const Product = require("../models/Product");
const Category = require("../models/Category");

class APIController {
  async getAllCategory(req, res) {
    await Category.query()
      .select("*")
      .whereNull("deleted_at")
      .then((category) => {
        res.status(200).json(category);
      });
  }
  async getAllProduct(req, res) {
    await Product.query()
      .select("*")
      .whereNull("deleted_at")
      .then((product) => {
        res.status(200).json(product);
      });
  }
  async getProductByCategory(req, res) {
    const category_id = req.params.id;
    await Product.query()
      .select("*")
      .whereNull("deleted_at")
      .where('category_id',category_id)
      .then((product) => {
        res.status(200).json(product);
      });
  }
  async getProductDetail(req, res) {
    const product_id = req.params.id;
    await Product.query()
      .findById(product_id)
      .whereNull("deleted_at")
      .then((product) => {
        res.status(200).json(product);
    });
  }
}
module.exports = new APIController();
