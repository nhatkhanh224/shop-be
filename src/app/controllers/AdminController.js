class AdminController {
  index(req, res) {
    res.render("admin/homepage", { layout: "layouts/admin" });
  }
}
module.exports = new AdminController();