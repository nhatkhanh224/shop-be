const Warehouse = require("../models/Warehouse");
const { raw, ref } = require('objection');
class WarehouseController {
  async show(req, res) {
    const warehouses = await Warehouse.query()
      .select("*")
      .whereNull("deleted_at");
    res.render("admin/warehouse/show", {
      layout: "layouts/admin",
      warehouses: warehouses,
    });
  }
  add(req, res) {
    res.render("admin/warehouse/add", { layout: "layouts/admin" });
  }
  async postWarehouse(req, res) {
    try {
      await Warehouse.query()
        .insert({
          name: req.body.name,
          code: req.body.code,
          quantity: req.body.quantity,
          price: req.body.price,
          color: req.body.color,
          size: req.body.size,
          thumbnail: req.body.thumbnail,
        })
        .then(() => {
          res.redirect("/warehouse");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async edit(req, res) {
    const warehouse = await Warehouse.query().findById(req.params.id);
    res.render("admin/warehouse/edit", {
      layout: "layouts/admin",
      warehouse: warehouse,
    });
  }
  async updateWarehouse(req, res) {
    const warehouse_id = req.params.id;
    try {
      await Warehouse.query()
        .findById(warehouse_id)
        .patch({
          name: req.body.name,
          code: req.body.code,
          quantity: req.body.quantity,
          price: req.body.price,
          color: req.body.color,
          size: req.body.size,
          thumbnail: req.body.thumbnail,
        })
        .then(() => {
          res.redirect("/warehouse");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteWarehouse(req, res) {
    const warehouse_id = req.params.id;
    try {
      await Warehouse.query()
        .findById(warehouse_id)
        .patch({
          deleted_at: new Date(),
        })
        .then(() => {
          res.redirect("/warehouse");
        });
    } catch (error) {
      console.log(error);
    }
  }
  async searchWarehouse(req, res) {
    const warehouse_name = req.query.name;
    if (warehouse_name.length > 0) {
      console.log("KHANH");
      await Warehouse.query()
      .select("*")
      .where('name', 'like', `%${warehouse_name}%`)
      .whereNull("deleted_at")
      .then((warehouse) => {
        res.status(200).json(warehouse);
      });
    }
  }
}
module.exports = new WarehouseController();
