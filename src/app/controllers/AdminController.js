const User = require("../models/User");
const bcrypt = require("bcrypt");
const e = require("express");
const Rating = require("../models/Rating");
const Recommend = require("../models/Recommend");
const UserRole = require("../models/UserRoles");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const csvPath = path.join("E:", "MyCode", "DoAnCuoiKi", "AI", "data.csv");
const json2csv = require('json2csv').parse;

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

    for (let i = 0; i < 100; i++) {
      let arrayProduct = [];
      let array = [];
      let arrayManProduct = [
        8, 12, 13, 14, 15, 16, 17, 18, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 63, 64,
      ];
      let arrayWomenProduct = [
        19, 20, 21, 22, 23, 62, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
        79, 80, 81, 82, 65, 66, 67, 68, 97, 98, 99, 100,
      ];
      for (let i = 0; i <= 50; i++) {
        let randomIndex = Math.floor(Math.random() * arrayManProduct.length);
        let randomNum = arrayManProduct[randomIndex];
        arrayProduct.push(randomNum);
      }
      array = [...new Set(arrayProduct)];
      for (let j = 0; j < array.length; j++) {
        const element = array[j];
        await Rating.query().insert({
          user_id: 665 + i,
          product_id: element,
          rating: Math.floor(Math.random() * (5 - 1) + 1),
        });
      }
    }
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
    res.redirect("/");
  }
  recommend(req, res) {
    res.render("admin/recommend/index", {
      layout: "layouts/admin",
    });
  }
  recommendExport(req, res) {
    res.render("admin/recommend/export", {
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
            user_id: Number(element.user_ids) + 1,
            product_id: element.product_ids,
          });
        }
        res.redirect("/");
      });
  }
  async renderRatingCSV(req, res) {
    try {
      const data = await Rating.query().select("user_id", "product_id", "rating");
      const csv = json2csv(data);
      const csvPath = "E:/MyCode/DoAnCuoiKi/AI/ratings.csv"; // đường dẫn đến tệp CSV
      fs.writeFile(csvPath, csv, (error) => {
        if (error) throw error;
        res.header("Content-Type", "text/csv");
        res.attachment(csvPath);
        res.send(csv);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
}
module.exports = new AdminController();
