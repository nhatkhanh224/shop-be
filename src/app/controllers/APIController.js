const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");
const ProductImage = require("../models/ProductImage");
const Property = require("../models/Property");
const Payment = require("../models/Payment");
const PaymentDetail = require("../models/PaymentDetail");
const ProductView = require("../models/ProductView");
const Recommend = require("../models/Recommend");
const { raw } = require("objection");

class APIController {
  async getAllCategory(req, res) {
    const category_id = req.params.id;
    await Category.query()
      .select("*")
      .whereNull("deleted_at")
      .where("parent_id", category_id)
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
    const subCategory = await Category.query()
      .select("id")
      .where("parent_id", category_id);
    if (subCategory.length > 0) {
      await Product.query()
        .select("*")
        .whereNull("deleted_at")
        .whereIn(
          "category_id",
          subCategory.map((item) => item.id)
        )
        .then((product) => {
          res.status(200).json(product);
        });
    } else {
      await Product.query()
        .select("*")
        .whereNull("deleted_at")
        .where("category_id", category_id)
        .then((product) => {
          res.status(200).json(product);
        });
    }
  }
  async getProductDetail(req, res) {
    const product_id = req.params.id;
    await Product.query()
      .findById(product_id)
      .whereNull("deleted_at")
      .then(async (product) => {
        const product_image = await ProductImage.query()
          .where("product_id", product.id)
          .whereNull("deleted_at");
        const properties = await Property.query()
          .where("product_id", product.id)
          .whereNull("deleted_at");
        product.subImages = product_image;
        product.properties = properties;
        res.status(200).json(product);
      });
  }
  async postLogin(req, res) {
    const user = await User.query()
      .select("users.*")
      .innerJoin("user_roles", "users.id", "user_roles.user_id")
      .where("email", req.body.email)
      .where("user_roles.role_id", 2);
    console.log("------->", user);
    if (user.length > 0) {
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
      .select("id", "email", "name", "address", "phone")
      .findById(user_id)
      .whereNull("deleted_at")
      .then((user) => {
        res.status(200).json(user);
      });
  }
  async addToCart(req, res) {
    const dataCart = await req.body.dataCart;
    const product_code = await Property.query()
      .select("code")
      .where("product_id", dataCart.id)
      .where("size", dataCart.size)
      .where("color", dataCart.color)
      .whereNull("deleted_at");
    const userCart = await Cart.query()
      .select("product_id", "user_id", "quantity", "product_code")
      .where("product_id", dataCart.id)
      .where("user_id", dataCart.user_id)
      .where("product_code", product_code[0].code)
      .whereNull("deleted_at");
    try {
      if (userCart[0]) {
        await Cart.query()
          .patch({
            quantity: Number(userCart[0].quantity) + Number(dataCart.quantity),
          })
          .where("product_id", dataCart.id)
          .where("user_id", dataCart.user_id)
          .where("product_code", product_code[0].code)
          .then(() => {
            res.status(200).send("Add Success");
          });
      } else {
        await Cart.query()
          .insert({
            product_id: dataCart.id,
            product_code: product_code[0].code,
            quantity: dataCart.quantity,
            price: dataCart.price,
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
      .decrement("quantity", 1)
      .where("product_id", req.body.product_id)
      .where("user_id", req.body.user_id)
      .where("product_code", req.body.product_code)
      .then(() => {
        res.status(200).send("Update Success");
      });
  }
  async plusQuantityCart(req, res) {
    await Cart.query()
      .increment("quantity", 1)
      .where("product_id", req.body.product_id)
      .where("user_id", req.body.user_id)
      .where("product_code", req.body.product_code)
      .then(() => {
        res.status(200).send("Update Success");
      });
  }
  async deleteCart(req, res) {
    await Cart.query()
      .patch({
        deleted_at: new Date(),
      })
      .where("product_id", req.body.product_id)
      .where("user_id", req.body.user_id)
      .where("product_code", req.body.product_code)
      .then(() => {
        res.status(200).send("Update Success");
      });
  }
  async checkout(req, res) {
    const userData = req.body.userData;
    const total = req.body.total;
    const cart = await Cart.query()
      .where("user_id", userData.id)
      .whereNull("deleted_at");
    const payment = await Payment.query().insert({
      user_id: userData.id,
      address: userData.address,
      phone: userData.phone,
      status: "New Order",
      total,
    });
    for (let i = 0; i < cart.length; i++) {
      const payment_detail = await PaymentDetail.query().insert({
        product_code: cart[i].product_code,
        quantity: cart[i].quantity,
        price: cart[i].price,
        payment_id: payment.id,
      });
      const product_view = await ProductView.query()
        .patch({ view: raw("view + 2") })
        .where("product_id", cart[i].product_id);
    }
    return await Cart.query()
      .patch({
        deleted_at: new Date(),
      })
      .where("user_id", userData.id)
      .whereNull("deleted_at")
      .then(res.status(200).send("Payment Success"));
  }
  async getHistory(req, res) {
    const user_id = req.params.id;
    const payment = await Payment.query()
      .select("*")
      .where("user_id", user_id)
      .orderBy("id", "desc")
      .then(async (payment) => {
        const payment_detail = await PaymentDetail.query()
          .select(
            "payment_details.payment_id",
            "payment_details.product_code",
            "payment_details.quantity",
            "payment_details.price",
            "products.thumbnail",
            "products.name",
            "products.id as product_id",
            "properties.size",
            "properties.color"
          )
          .innerJoin(
            "properties",
            "payment_details.product_code",
            "properties.code"
          )
          .innerJoin("products", "properties.product_id", "products.id")
          .groupBy("payment_details.payment_id");
        const hashPaymentDetail = {};
        payment_detail.forEach((detail) => {
          if (hashPaymentDetail[detail.payment_id]) {
            hashPaymentDetail[detail.payment_id].push(detail);
          } else {
            hashPaymentDetail[detail.payment_id] = [detail];
          }
        });

        payment.forEach((item) => {
          item.payment_details = hashPaymentDetail[item.id]
            ? hashPaymentDetail[item.id][0]
            : [];
        });
        return res.status(200).json(payment);
      });
  }
  async addProductView(req, res) {
    const { product_id, user_id } = await req.body;
    const productViewUser = await ProductView.query()
      .select("*")
      .where("user_id", user_id)
      .where("product_id", product_id);
    if (productViewUser.length > 0) {
      await ProductView.query()
        .increment("view", 1)
        .where("product_id", product_id)
        .where("user_id", user_id);
    } else {
      await ProductView.query().insert({
        product_id,
        user_id,
        view: 1,
      });
    }
  }
  async updateAccount(req, res) {
    const { userData } = await req.body;
    await User.query()
      .patch({
        name: userData.name,
        address: userData.address,
        phone: userData.phone,
      })
      .where("id", userData.id)
      .then(() => {
        res.status(200).send("Add Success");
      });
  }
  async getRecommend(req, res) {
    const user_id = req.params.id;
    const recommends = await Recommend.query()
      .select("product_id")
      .where("user_id", user_id);
    const productIds = JSON.parse(recommends[0].product_id);
    await Product.query().select("*").whereIn("id", productIds).then((products)=>{
      res.status(200).send(products);
    });
  }
}
module.exports = new APIController();
