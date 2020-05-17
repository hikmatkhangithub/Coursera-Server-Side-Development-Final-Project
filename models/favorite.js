const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//const Dishes = require("./dishes");

const favoriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    dishes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
      },
    ],
  },
  { timestamps: true }
);

const Favorite = mongoose.model("favorite", favoriteSchema);
module.exports = Favorite;
