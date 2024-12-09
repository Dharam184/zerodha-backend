const mongoose = require("mongoose");

const { PositionsSchema } = require("../schemas/PositionsSchema");

const Position = mongoose.model("Position", PositionsSchema);

module.exports = Position;
