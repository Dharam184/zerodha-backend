const mongoose = require("mongoose");

const { OrdersSchema } = require("../schemas/OrdersSchema");

const Order = mongoose.model("Order", OrdersSchema);

module.exports = Order;