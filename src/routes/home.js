const express = require("express");
const AdminController = require("../app/controllers/AdminController");
const CategoryController = require("../app/controllers/CategoryController");
const ProductController = require("../app/controllers/ProductController");
const WarehouseController = require("../app/controllers/WarehouseController");
const SubImagesController = require("../app/controllers/SubImagesController");
const upload = require("../app/middleware/uploadMiddleware");
const SlideController = require("../app/controllers/SlideController");
const OrderController = require("../app/controllers/OrderController");
const router = express.Router();
const authMiddleware = require("../app/middleware/AuthMiddleware");

router.get("/", authMiddleware.requireAuth, AdminController.index);
router.get("/login", AdminController.login);
router.post("/login", AdminController.postLogin);

//Category
router.get("/category", authMiddleware.requireAuth, CategoryController.show);
router.get("/category-add", authMiddleware.requireAuth, CategoryController.add);
router.post("/category-add", CategoryController.postCategory);
router.get(
  "/category-edit-:id",
  authMiddleware.requireAuth,
  CategoryController.edit
);
router.post("/category-update/:id", CategoryController.updateCategory);
router.post("/category-delete/:id", CategoryController.deleteCategory);

//Product
router.get("/product", authMiddleware.requireAuth, ProductController.show);
router.get("/product-add", authMiddleware.requireAuth, ProductController.add);
router.post(
  "/product-add",
  upload.single("thumbnail"),
  ProductController.postProduct
);
router.get(
  "/product-edit-:id",
  authMiddleware.requireAuth,
  ProductController.edit
);
router.post("/product-update/:id", ProductController.updateProduct);
router.post("/product-delete/:id", ProductController.deleteProduct);

//Sub images
router.get(
  "/sub-images-add-:id",
  authMiddleware.requireAuth,
  SubImagesController.add
);
router.post("/multiple-upload/:id", SubImagesController.multipleUpload);

//Warehouse
router.get("/warehouse", WarehouseController.show);
router.get("/warehouse-add", WarehouseController.add);
router.post("/warehouse-add", WarehouseController.postWarehouse);
router.get("/warehouse-edit-:id", WarehouseController.edit);
router.post("/warehouse-update/:id", WarehouseController.updateWarehouse);
router.post("/warehouse-delete/:id", WarehouseController.deleteWarehouse);
router.get("/search-warehouse", WarehouseController.searchWarehouse);

//Slide
router.get("/slide", authMiddleware.requireAuth, SlideController.show);
router.get("/slide-add", authMiddleware.requireAuth, SlideController.add);
router.post(
  "/slide-add",
  upload.single("thumbnail"),
  SlideController.postSlide
);
router.get("/slide-edit-:id", authMiddleware.requireAuth, SlideController.edit);
router.post(
  "/slide-update/:id",
  upload.single("thumbnail"),
  SlideController.updateSlide
);
router.post("/slide-delete/:id", SlideController.deleteSlide);

// Statistic
router.get("/order", authMiddleware.requireAuth, OrderController.showOrder);
router.get(
  "/order-:id",
  authMiddleware.requireAuth,
  OrderController.orderDetail
);
router.post("/changeStatusOrder", OrderController.changeStatusOrder);
router.get("/charts", authMiddleware.requireAuth, OrderController.showCharts);

router.post("/rating-test", AdminController.ratingTest);

module.exports = router;
