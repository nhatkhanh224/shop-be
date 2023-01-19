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
const UserRole = require("../models/UserRoles");
const Rating = require("../models/Rating");
const Slide = require("../models/Slide");
const Coupon = require("../models/Coupon");

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
    let { limit, sort_by, color, price, search } = req.query;
    let query = Product.query()
      .select("products.*")
      .limit(limit)
      .whereNull("products.deleted_at")
      .orderBy('products.id','desc');
    if (search != "undefined" && search) {
      query = query.where("products.name", "like", `%${search}%`);
    }
    if (sort_by) {
      switch (sort_by) {
        case "Newness":
          query = query.orderBy("id", "desc");
          break;
        case "Top Buy":
          query = query
            .leftJoin(
              "payment_details",
              "products.id",
              "payment_details.product_id"
            )
            .orderBy("payment_details.quantity", "desc");
          break;
        case "Low to High":
          query = query.orderBy("price", "asc");
          break;
        case "High to Low":
          query = query.orderBy("price", "desc");
          break;
        default:
          break;
      }
    }
    if (price) {
      switch (price) {
        case "0-200":
          console.log("KHANASHUAHSUASHUSAHUHAUH");
          query = query.whereBetween("products.price", [0, 200000]);
          break;
        case "200-400":
          query = query.whereBetween("products.price", [200000, 400000]);
          break;
        case "400-600":
          query = query.whereBetween("products.price", [400000, 600000]);
          break;
        case "Under 600":
          query = query.where("products.price", ">=", 600000);
          break;
        default:
          break;
      }
    }
    if (color != "undefined" && color) {
      query = query
        .innerJoin("properties", "products.id", "properties.product_id")
        .groupBy("products.id");
      switch (color) {
        case "black":
          query = query.where("color", "black");
          break;
        case "white":
          query = query.where("color", "white");
          break;
        case "blue":
          query = query.where("color", "blue");
          break;
        case "green":
          query = query.where("color", "green");
          break;
        case "yellow":
          query = query.where("color", "yellow");
          break;
        case "brown":
          query = query.where("color", "brown");
          break;
        case "red":
          query = query.where("color", "red");
          break;
        default:
          break;
      }
    }
    await query.then((product) => {
      res.status(200).json(product);
    });
  }
  async getProductByCategory(req, res) {
    let { limit, sort_by, color, price, search } = req.query;
    console.log("search", search);
    const category_id = req.params.id;
    const subCategory = await Category.query()
      .select("id")
      .where("parent_id", category_id);
    if (subCategory.length > 0) {
      let query = Product.query()
        .select("products.*")
        .whereNull("products.deleted_at")
        .limit(limit)
        .orderBy('products.id','desc')
        .whereIn(
          "category_id",
          subCategory.map((item) => item.id)
        );
      if (search != "undefined" && search) {
        query = query.where("products.name", "like", `%${search}%`);
      }
      if (sort_by) {
        switch (sort_by) {
          case "Newness":
            query = query.orderBy("id", "desc");
            break;
          case "Top Buy":
            query = query
              .leftJoin(
                "payment_details",
                "products.id",
                "payment_details.product_id"
              )
              .orderBy("payment_details.quantity", "desc");
            break;
          case "Low to High":
            query = query.orderBy("price", "asc");
            break;
          case "High to Low":
            query = query.orderBy("price", "desc");
            break;
          default:
            break;
        }
      }
      if (price) {
        switch (price) {
          case "0-200":
            query = query.whereBetween("products.price", [0, 200000]);
            break;
          case "200-400":
            query = query.whereBetween("products.price", [200000, 400000]);
            break;
          case "400-600":
            query = query.whereBetween("products.price", [400000, 600000]);
            break;
          case "Under 600":
            query = query.where("products.price", ">=", 600000);
            break;
          default:
            break;
        }
      }
      if (color != "undefined" && color) {
        query = query
          .innerJoin("properties", "products.id", "properties.product_id")
          .groupBy("products.id");
        switch (color) {
          case "black":
            query = query.where("color", "black");
            break;
          case "white":
            query = query.where("color", "white");
            break;
          case "blue":
            query = query.where("color", "blue");
            break;
          case "green":
            query = query.where("color", "green");
            break;
          case "yellow":
            query = query.where("color", "yellow");
            break;
          case "brown":
            query = query.where("color", "brown");
            break;
          case "red":
            query = query.where("color", "red");
            break;
          default:
            break;
        }
      }
      await query.then((product) => {
        res.status(200).json(product);
      });
    } else {
      await Product.query()
        .select("*")
        .whereNull("deleted_at")
        .where("category_id", category_id)
        .limit(limit)
        .orderBy('products.id','desc')
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
    if (user.length != 0) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (validPassword) {
        res.status(200).json(user[0].id);
      }
    }
  }
  async postSignup(req, res) {
    const user = await User.query()
      .select("*")
      .where("email", req.body.email)
      .whereNull("deleted_at");
    if (user.length == 0) {
      const user = await User.query().insert({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        address: req.body.address,
        phone: req.body.phone,
      });
      const user_roles = await UserRole.query()
        .insert({
          user_id: user.id,
          role_id: 2,
        })
        .then(() => {
          res.status(200).json(user.id);
        });
    } else {
      return res.status(400).send({
        message: "Email valid !",
      });
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
    const {userData,total,discount_id,method,transaction_id} = req.body;
    const cart = await Cart.query()
      .where("user_id", userData.id)
      .whereNull("deleted_at");
    const payment = await Payment.query().insert({
      user_id: userData.id,
      address: userData.address,
      phone: userData.phone,
      status: "New Order",
      total,
      discount_id,
      method,
      transaction_id
    });
    for (let i = 0; i < cart.length; i++) {
      const payment_detail = await PaymentDetail.query().insert({
        product_id: cart[i].product_id,
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
      .select(
        "payments.*",
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
      .innerJoin("payment_details", "payment_details.payment_id", "payments.id")
      .innerJoin(
        "properties",
        "payment_details.product_code",
        "properties.code"
      )
      .innerJoin("products", "properties.product_id", "products.id")
      .where("payments.user_id", user_id)
      .orderBy("payment_details.id", "desc")
      .then(async (payment) => {
        const rating = await Rating.query()
          .select("rating_products.*")
          .where("rating_products.user_id", user_id)
        const hashRating = {};
        rating.forEach((rating) => {
          if (hashRating[rating.product_id]) {
            hashRating[rating.product_id].push(rating);
          } else {
            hashRating[rating.product_id] = [rating];
          }
        });
        console.log(hashRating);
        payment.forEach((item) => {
          item.rating = hashRating[item.product_id] ? hashRating[item.product_id] : [];
        });
        return payment;
      });
    // const payment = await Payment.query()
    //   .select("*")
    //   .where("user_id", user_id)
    //   .orderBy("id", "desc")
    //   .then(async (payment) => {
    //     const payment_detail = await PaymentDetail.query()
    //       .select(
    //         "payment_details.payment_id",
    //         "payment_details.product_code",
    //         "payment_details.quantity",
    //         "payment_details.price",
    //         "products.thumbnail",
    //         "products.name",
    //         "products.id as product_id",
    //         "properties.size",
    //         "properties.color"
    //       )
    //       .innerJoin(
    //         "properties",
    //         "payment_details.product_code",
    //         "properties.code"
    //       )
    //       .innerJoin("products", "properties.product_id", "products.id");
    //     // .groupBy("payment_details.payment_id");
    //     console.log("---->",payment_detail);
    //     const hashPaymentDetail = {};
    //     payment_detail.forEach((detail) => {
    //       if (hashPaymentDetail[detail.payment_id]) {
    //         hashPaymentDetail[detail.payment_id].push(detail);
    //       } else {
    //         hashPaymentDetail[detail.payment_id] = [detail];
    //       }
    //     });

    //     payment.forEach((item) => {
    //       item.payment_details = hashPaymentDetail[item.id]
    //         ? hashPaymentDetail[item.id]
    //         : [];
    //     });
    //     return res.status(200).json(payment);
    //   });
    return res.status(200).json(payment);
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
    if (recommends.length != 0) {
      const productIds = JSON.parse(recommends[0].product_id);
      await Product.query()
        .select("*")
        .whereIn("id", productIds)
        .then((products) => {
          res.status(200).send(products);
        });
    } else {
      await Product.query()
        .select("products.*")
        .leftJoin(
          "payment_details",
          "products.id",
          "payment_details.product_id"
        )
        .limit(12)
        .whereNull("products.deleted_at")
        .orderBy("payment_details.quantity", "desc")
        .then((products) => {
          res.status(200).send(products);
        });
    }
  }
  async getTopBuy(req, res) {}
  async rating(req, res) {
    const { user_id, product_id, rating } = await req.body;
    await Rating.query()
      .insert({
        user_id,
        product_id,
        rating,
      })
      .then(() => {
        res.status(200).send("Rating Success");
      });
  }
  
  async getHomeSlides(req, res) {
    await Slide.query()
      .select("*")
      .whereNull("deleted_at")
      .then((slide) => {
        res.status(200).json(slide);
      });
  }
  async checkCoupon (req,res) {
    const coupon = await Coupon.query().select("*")
    .where("name",req.body.coupon)
    .whereNull("deleted_at")
    console.log(coupon);
    let currentDate = new Date();
    let validDate = new Date(coupon[0].duration_date)
    if (coupon && currentDate <= validDate) {
      res.status(200).json(coupon);
    } else {
      res.status(500).send("Coupon Invalid");
    }
    
  }
}
module.exports = new APIController();
