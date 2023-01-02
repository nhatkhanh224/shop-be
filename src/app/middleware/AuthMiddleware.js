const User = require("../models/User");
module.exports.requireAuth = function (req, res, next) {
  if (!req.cookies.userID) {
    res.redirect("/login");
    return;
  } else {
    next();
  }
};
