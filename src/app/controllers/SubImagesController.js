const multipleUploadMiddleware = require("../middleware/uploadMultipleMiddleware");
const ProductImage = require("../models/ProductImage");
let debug = console.log.bind(console);
class SubImagesController {
  add(req, res) {
    const product_id = req.params.id;
    res.render("admin/subImages/add", { layout: "layouts/admin",product_id: product_id });
  }
  async multipleUpload(req,res) {
    const product_id = req.params.id;
    try {
      await multipleUploadMiddleware(req, res);
      debug(req.files);
      for (let i = 0; i < req.files.length; i++) {
        let valueToSave = {
          image: req.files[i].originalname,
          product_id
        }
        const newProductIamge = await ProductImage.query()
      .insert(valueToSave);
      }
      if (req.files.length <= 0) {
        return res.send(`You must select at least 1 file or more.`);
      } else {
        res.redirect("/product");
      }
    } catch (error) {
      debug(error);
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send(`Exceeds the number of files allowed to upload.`);
      }
  
      return res.send(`Error when trying upload many files: ${error}}`);
    }
  }
}
module.exports = new SubImagesController();