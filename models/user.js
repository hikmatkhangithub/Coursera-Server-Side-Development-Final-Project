var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

const user = new Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  facebookId: String,
  admin: {
    type: Boolean,
    default: false,
  },
});

user.plugin(passportLocalMongoose);

const User = mongoose.model("user", user);

module.exports = User;
