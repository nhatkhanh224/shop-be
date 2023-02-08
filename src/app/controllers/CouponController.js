const Coupon = require("../models/Coupon");
class CouponController {
  async show(req, res) {
    const coupons = await Coupon.query().select("*").whereNull('deleted_at');
    res.render("admin/coupon/show", {
      layout: "layouts/admin",
      coupons: coupons,
    });
  }
  async add(req, res) {
    res.render("admin/coupon/add", { layout: "layouts/admin"});
  }
  async postCoupon(req, res) {
    try {
      await Coupon.query()
        .insert({
          name: req.body.name,
          type: req.body.type,
          value: req.body.value,
          duration_date: req.body.duration_date,
        })
        .then(() => {
          res.redirect("/coupon");
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
  async updateCoupon(req, res) {
    const category_id = req.params.id;
    try {
      await Category.query()
        .findById(category_id)
        .patch({
          name: req.body.name,
          // parent_id: req.body.parent_id,
          description: req.body.description,
        })
        .then(() => {
          res.redirect("/category");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteCoupon(req, res) {
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
module.exports = new CouponController();