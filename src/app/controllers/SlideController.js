const Slide = require("../models/Slide");
const Resize = require('../../root/Resize');
const path = require('path');
class SlideController {
  async show(req, res) {
    const slides = await Slide.query()
      .select("*")
      .whereNull("deleted_at");
    res.render("admin/slide/show", {
      layout: "layouts/admin",
      slides: slides,
    });
  }
  async add(req, res) {
    res.render("admin/slide/add", { layout: "layouts/admin"});
  }
  async postSlide(req, res) {
    const imagePath = path.resolve('src/public/slides');
    // call class Resize
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({ error: "Please provide an image" });
    }
    try {
      const newSlide = await Slide.query()
        .insert({
          thumbnail: await fileUpload.save(req.file.buffer),
          main_title: req.body.main_title,
          sub_title: req.body.sub_title
        });
      res.redirect("/slide");
    } catch (error) {
      console.log(error);
    }
  }
  async edit(req, res) {
    const slide = await Slide.query().findById(req.params.id);
    res.render("admin/slide/edit", {
      layout: "layouts/admin",
      slide: slide,
    });
  }
  async updateSlide(req, res) {
    const imagePath = path.resolve('src/public/slides');
    // call class Resize
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({ error: "Please provide an image" });
    }
    const slide_id = req.params.id;
    try {
      await Slide.query()
        .findById(slide_id)
        .patch({
          thumbnail: await fileUpload.save(req.file.buffer),
          main_title: req.body.main_title,
          sub_title: req.body.sub_title 
        })
        .then(() => {
          res.redirect("/slide");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteSlide(req, res) {
    const slide_id = req.params.id;
    try {
      await Slide.query()
        .findById(slide_id)
        .patch({
          deleted_at: new Date(),
        })
        .then(() => {
          res.redirect("/slide");
        });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new SlideController();