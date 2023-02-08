const User = require("../models/User");
class UserController {
  async show(req, res) {
    const users = await User.query().select("users.*","roles.name as role_name")
    .innerJoin('user_roles','users.id','user_roles.user_id')
    .innerJoin('roles','roles.id','user_roles.role_id')
    .whereNull('users.deleted_at')
    .orderBy('id','desc')
    res.render("admin/user/show", {
      layout: "layouts/admin",
      users: users,
    });
  }
}
module.exports = new UserController();