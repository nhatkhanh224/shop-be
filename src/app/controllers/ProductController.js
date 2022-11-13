// const Resize = require("../../root/Resize");
const Product = require("../models/Product");
const Category = require("../models/Category");
// const path = require('path');
class ProductController {
  async show(req, res) {
    const categories = await Product.query()
      .select("*")
      .whereNull("deleted_at");
    res.render("admin/product/show", {
      layout: "layouts/admin",
      categories: categories,
    });
  }
  async add(req, res) {
    const categories = await Category.query().select("*").whereNull('deleted_at');
    res.render("admin/product/add", { layout: "layouts/admin",categories: categories});
  }
  async postProduct(req, res) {
    // const imagePath = path.resolve('src/public/images');
    // // call class Resize
    // const fileUpload = new Resize(imagePath);
    // if (!req.file) {
    //   res.status(401).json({ error: "Please provide an image" });
    // }
    try {
      await Product.query()
        .insert({
          name: req.body.name,
          category_id: req.body.category_id,
          description: req.body.description,
          price: req.body.price,
          // thumbnail: await fileUpload.save(req.file.buffer) 
          thumbnail: req.body.thumbnail
        })
        .then(() => {
          res.redirect("/product");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async edit(req, res) {
    const categories = await Category.query().select("*").whereNull('deleted_at');
    const product = await Product.query().findById(req.params.id);
    res.render("admin/product/edit", {
      layout: "layouts/admin",
      categories: categories,
      product:product
    });
  }
  async updateProduct(req, res) {
    const product_id = req.params.id;
    try {
      await Product.query()
        .findById(product_id)
        .patch({
          name: req.body.name,
          category_id: Number(req.body.category_id),
          description: req.body.description,
          price: Number(req.body.price),
          thumbnail: req.body.thumbnail
        })
        .then(() => {
          res.redirect("/product");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct(req, res) {
    const product_id = req.params.id;
    try {
      await Product.query()
        .findById(product_id)
        .patch({
          deleted_at: new Date(),
        })
        .then(() => {
          res.redirect("/product");
        });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new ProductController();