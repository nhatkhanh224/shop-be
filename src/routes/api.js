const express = require('express');
const router = express.Router();
const apiController = require("../app/controllers/APIController");
router.get("/category", apiController.getAllCategory);
router.get("/product", apiController.getAllProduct);
router.get("/productByCategory/:id", apiController.getProductByCategory);
router.get("/productDetail/:id", apiController.getProductDetail);
module.exports = router;