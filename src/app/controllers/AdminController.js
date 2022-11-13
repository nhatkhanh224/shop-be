const User = require("../models/User");
const bcrypt = require("bcrypt");
class AdminController {
  index(req, res) {
    res.render("admin/homepage", { layout: "layouts/admin" });
  }
  login(req, res) {
    res.render("auth/login", { layout: "layouts/auth" });
  }
  async postLogin(req, res) {
    const user = await User.query()
    .select('users.*')
    .innerJoin('user_roles', 'users.id', 'user_roles.user_id')
    .where('email',req.body.email)
    .where('user_roles.role_id',1)
    if (user) {
      const validPassword = await bcrypt.compare(req.body.password, user[0].password);
      if (validPassword) {
        res.redirect("/");
      }
    }
    
  }
}
module.exports = new AdminController();