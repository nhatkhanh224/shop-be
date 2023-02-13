const User = require("../models/User");
const UserRole = require("../models/UserRoles");
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
  async edit(req, res) {
    const user = await User.query().select("users.*","roles.name as role_name")
    .innerJoin('user_roles','users.id','user_roles.user_id')
    .innerJoin('roles','roles.id','user_roles.role_id')
    .where('users.id',req.params.id)
    res.render("admin/user/edit", {
      layout: "layouts/admin",
      user: user[0],
    });
  }
  async updateUser(req,res) {
    const user_id = req.params.id;
    try {
      const user = await User.query()
    .innerJoin('user_roles','users.id','user_roles.user_id')
    .update({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        role_id: req.body.role_id
    })
    .where('users.id',req.params.id)
    .then(() => {
      res.redirect("/users");
    });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new UserController();