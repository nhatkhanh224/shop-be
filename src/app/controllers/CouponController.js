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
    const coupon = await Coupon.query().findById(req.params.id);
    res.render("admin/coupon/edit", {
      layout: "layouts/admin",
      coupon: coupon,
    });
  }
  async updateCoupon(req, res) {
    const coupon_id = req.params.id;
    try {
      await Coupon.query()
        .findById(coupon_id)
        .patch({
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
  async deleteCoupon(req, res) {
    const coupon_id = req.params.id;
    try {
      await Coupon.query()
        .findById(coupon_id)
        .patch({
          deleted_at:new Date()
        })
        .then(() => {
          res.redirect("/coupon");
        });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new CouponController();