var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const user = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", user);

module.exports = User;
