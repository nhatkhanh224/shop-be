const Category = require("../models/Category");

class CategoryController {
  async show(req, res) {
    const categories = await Category.query().select("*").whereNull('deleted_at');
    res.render("admin/category/show", {
      layout: "layouts/admin",
      categories: categories,
    });
  }
  add(req, res) {
    res.render("admin/category/add", { layout: "layouts/admin" });
  }
  async postCategory(req, res) {
    try {
      await Category.query()
        .insert({
          name: req.body.name,
          parent_id: req.body.parent_id,
          description: req.body.description,
        })
        .then(() => {
          res.redirect("/category");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async edit(req, res) {
    const category = await Category.query().findById(req.params.id);
    res.render("admin/category/edit", {
      layout: "layouts/admin",
      category: category,
    });
  }
  async updateCategory(req, res) {
    const category_id = req.params.id;
    try {
      await Category.query()
        .findById(category_id)
        .patch({
          name: req.body.name,
          parent_id: req.body.parent_id,
          description: req.body.description,
        })
        .then(() => {
          res.redirect("/category");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteCategory(req, res) {
    const category_id = req.params.id;
    try {
      await Category.query()
        .findById(category_id)
        .patch({
          deleted_at:new Date()
        })
        .then(() => {
          res.redirect("/category");
        });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new CategoryController();
