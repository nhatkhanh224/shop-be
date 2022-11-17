const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");

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
      .where("category_id", category_id)
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
  async postLogin(req, res) {
    const user = await User.query()
      .select("users.*")
      .innerJoin("user_roles", "users.id", "user_roles.user_id")
      .where("email", req.body.email)
      .where("user_roles.role_id", 1);
    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (validPassword) {
        res.status(200).json(user[0].id);
      }
    }
  }
  async getAccount(req, res) {
    const user_id = req.params.id;
    await User.query()
      .select("email", "name", "address", "phone")
      .findById(user_id)
      .whereNull("deleted_at")
      .then((user) => {
        res.status(200).json(user);
      });
  }
  async addToCart(req, res) {
    const dataCart = await req.body.dataCart;
    const userCart = await Cart.query()
      .select("product_id", "user_id", "quantity", "size")
      .where("product_id", dataCart.id)
      .where("user_id", dataCart.user_id)
      .where("size", dataCart.size)
      .whereNull("deleted_at");
    try {
      if (userCart[0]) {
        await Cart.query()
          .patch({
            quantity: Number(userCart[0].quantity) + Number(dataCart.quantity),
          })
          .where("product_id", dataCart.id)
          .where("user_id", dataCart.user_id)
          .where("size", dataCart.size)
          .then(() => {
            res.status(200).send("Add Success");
          });
      } else {
        await Cart.query()
          .insert({
            product_id: dataCart.id,
            size: dataCart.size,
            quantity: dataCart.quantity,
            user_id: dataCart.user_id,
          })
          .then(() => {
            res.status(200).send("Add Success");
          });
      }
    } catch (error) {
      res.status(500).send("Add Failed");
    }
  }
  async getUserCart(req, res) {
    const user_id = req.params.id;
    await Cart.query()
      .select("carts.*", "products.*")
      .innerJoin("products", "carts.product_id", "products.id")
      .where("user_id", user_id)
      .whereNull("carts.deleted_at")
      .then((cart) => {
        res.status(200).json(cart);
      });
  }
  async minusQuantityCart(req, res) {
    await Cart.query()
          .decrement('quantity', 1)
          .where("product_id", req.body.product_id)
          .where("user_id", req.body.user_id)
          .then(() => {
            res.status(200).send("Update Success");
          });
  }
  async plusQuantityCart(req, res) {
    await Cart.query()
          .increment('quantity', 1)
          .where("product_id", req.body.product_id)
          .where("user_id", req.body.user_id)
          .then(() => {
            res.status(200).send("Update Success");
          });
  }
}
module.exports = new APIController();
