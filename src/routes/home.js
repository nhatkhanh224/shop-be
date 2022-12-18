const express = require('express');
const AdminController = require('../app/controllers/AdminController');
const CategoryController = require('../app/controllers/CategoryController');
const ProductController = require('../app/controllers/ProductController');
const WarehouseController = require('../app/controllers/WarehouseController');
const upload = require('../app/middleware/uploadMiddleware');
const router=express.Router();


router.get('/',AdminController.index);
router.get('/login',AdminController.login);
router.post('/login',AdminController.postLogin);

//Category
router.get('/category',CategoryController.show);
router.get('/category-add',CategoryController.add);
router.post('/category-add',CategoryController.postCategory);
router.get('/category-edit-:id',CategoryController.edit);
router.post('/category-update/:id',CategoryController.updateCategory);
router.post('/category-delete/:id',CategoryController.deleteCategory);

//Product
router.get('/product',ProductController.show);
router.get('/product-add',ProductController.add);
router.post('/product-add',upload.single('thumbnail'),ProductController.postProduct);
router.get('/product-edit-:id',ProductController.edit);
router.post('/product-update/:id',ProductController.updateProduct);
router.post('/product-delete/:id',ProductController.deleteProduct);

//Warehouse
router.get('/warehouse',WarehouseController.show);
router.get('/warehouse-add',WarehouseController.add);
router.post('/warehouse-add',WarehouseController.postWarehouse);
router.get('/warehouse-edit-:id',WarehouseController.edit);
router.post('/warehouse-update/:id',WarehouseController.updateWarehouse);
router.post('/warehouse-delete/:id',WarehouseController.deleteWarehouse);
router.get('/search-warehouse',WarehouseController.searchWarehouse);

module.exports = router;