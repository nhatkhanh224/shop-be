const Payment = require("../models/Payment");
const PaymentDetail = require("../models/PaymentDetail");
const Product = require("../models/Product");
const { raw } = require('objection');

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
      .whereNull("deleted_at")
      .then(async (item)=>{
        for (let i = 0; i < item.length; i++) {
          const element = item[i];
          const product = await Product.query().findById(element.product_id);
          item[i].thumbnail = product.thumbnail;
        }
        return item
      })
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
  async showCharts (req,res) {
    const dataByTime = await PaymentDetail.query()
    .select(raw('price,MONTH(payment_details.created_at) as Month,YEAR(payment_details.created_at) as Year'))
    .where(raw('YEAR(payment_details.created_at) = 2022'))
    .groupBy(raw('YEAR(payment_details.created_at),MONTH(payment_details.created_at)'))
    let array = [0,0,0,0,0,0,0,0,0,0,0,0];
    for (let i = 1; i <= array.length; i++) {
      for (let j = 0; j < dataByTime.length; j++) {
        const element = dataByTime[j];
        if (element.Month == i) {
          array[i-1] = element.price;
        }
      }
    }
    var yValues = array;
    res.render("admin/statistic/chart", {
      layout: "layouts/admin",
      yValues:yValues
    });
  }
}
module.exports = new OrderController();
