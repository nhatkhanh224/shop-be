const Payment = require("../models/Payment");
const PaymentDetail = require("../models/PaymentDetail");

class OrderController {
  async showOrder(req, res) {
    const orders = await Payment.query()
      .select("*")
      .whereNull("deleted_at")
      .orderBy("id", "desc");
    res.render("admin/statistic/order", {
      layout: "layouts/admin",
      orders: orders,
    });
  }
  async orderDetail(req, res) {
    const payment_id = req.params.id;
    const payment = await PaymentDetail.query()
      .select("*")
      .where("payment_id", payment_id)
      .whereNull("deleted_at");
    res.render("admin/statistic/detail", {
      layout: "layouts/admin",
      payment: payment,
    });
  }
  async changeStatusOrder(req, res) {
    const { payment_id, status } = req.body;
    console.log("-------->",payment_id);
    try {
      const statusUpdated = await Payment.query()
        .patch({ status: status })
        .where("id", payment_id);
        return res.status(200).send("Update Success");
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
module.exports = new OrderController();
