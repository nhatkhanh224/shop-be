const User = require("../models/User");
const bcrypt = require("bcrypt");
const e = require("express");
const Rating = require("../models/Rating");
const Recommend = require("../models/Recommend");
const UserRole = require("../models/UserRoles");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

class AdminController {
  index(req, res) {
    res.render("admin/homepage", { layout: "layouts/admin" });
  }
  login(req, res) {
    res.render("auth/login", { layout: "layouts/auth" });
  }
  async postLogin(req, res) {
    const user = await User.query()
      .select("users.*")
      .innerJoin("user_roles", "users.id", "user_roles.user_id")
      .where("email", req.body.email)
      .where("user_roles.role_id", 1);
    if (user.length > 0) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (validPassword) {
        res.cookie("userID", user[0].id, {
          maxAge: 60 * 60 * 1000,
        });
        res.redirect("/");
      }
    } else {
      res.redirect("/login");
    }
  }
  async ratingTest(req, res) {
    //  ADD RATING PRODUCT
    // let arrayProduct = [];
    // let array= [];
    // for (let i = 0; i <= 20; i++) {
    //   let random_product = Math.random() * (82 - 12) + 12;
    //   arrayProduct.push(Math.floor(random_product));
    // }
    // array = [...new Set(arrayProduct)]
    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < array.length; j++) {
    //     const element = array[j];
    //     await Rating.query().insert({
    //       user_id:492+i,
    //       product_id:element,
    //       rating:Math.floor(Math.random() * (5 - 1) + 1)
    //     })
    //   }
    // }
    //    ADD USER
    // for (let i = 0; i < 240; i++) {
    //   const user = await User.query().insert({
    //     name: 'Test Rinn',
    //     email: `rin+${i}@gmail.com`,
    //     password: await bcrypt.hash('123456', 10),
    //     address: '25 Kim Đồng - Gio Linh - Quảng Trị',
    //     phone: '0914170417',
    //   });
    //   const user_roles = await UserRole.query()
    //   .insert({
    //     user_id: user.id,
    //     role_id: 2,
    //   })
    // }
    // res.redirect("/");
  }
  recommend(req, res) {
    res.render("admin/recommend/index", {
      layout: "layouts/admin",
    });
  }
  async readFileCsv(req, res) {
    const csvPath = path.resolve("src/public/recommend_rating.csv");
    let results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (let i = 0; i < results.length; i++) {
          const element = results[i];
          await Recommend.query().insert({
            user_id: element.userid,
            product_id: element.productid,
          });
        }
        res.redirect("/");
      })
  }
}
module.exports = new AdminController();
