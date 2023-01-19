const express = require('express');
const router = express.Router();
const apiController = require("../app/controllers/APIController");
router.get("/category/:id", apiController.getAllCategory);
router.get("/product", apiController.getAllProduct);
router.get("/productByCategory/:id", apiController.getProductByCategory);
router.get("/productDetail/:id", apiController.getProductDetail);
router.post("/addToCart", apiController.addToCart);
router.get("/cart/:id", apiController.getUserCart);
router.post("/cart/plusQuantity", apiController.plusQuantityCart);
router.post("/cart/minusQuantity", apiController.minusQuantityCart);
router.post("/cart/deleteCart", apiController.deleteCart);
router.post("/checkout", apiController.checkout);
router.get("/getHistory/:id", apiController.getHistory);
router.post("/addProductView", apiController.addProductView);
router.get("/getRecommend/:id", apiController.getRecommend);
router.get("/getTopBuy", apiController.getTopBuy);
router.post("/rating", apiController.rating);
router.get("/homeSlide", apiController.getHomeSlides);
router.post("/checkCoupon", apiController.checkCoupon);


//Auth
router.post("/login", apiController.postLogin);
router.post("/signup", apiController.postSignup);
router.get("/getAccount/:id", apiController.getAccount);
router.post("/updateAccount", apiController.updateAccount);

module.exports = router;