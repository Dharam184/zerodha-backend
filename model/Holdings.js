const mongoose = require("mongoose");

const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const Holding = mongoose.model("Holding", HoldingsSchema);

module.exports = Holding;