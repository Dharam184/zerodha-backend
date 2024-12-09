const mongoose = require('mongoose');

const { userSchema } = require('../schemas/UsersSchema');

const User = mongoose.model("User", userSchema);

module.exports = User;