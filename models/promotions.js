const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-Currency").loadType(mongoose);

const Currency = mongoose.Types.Currency;
const promoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
      required: true,
    },
    price: {
      type: Currency,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Promotions = mongoose.model("Promo", promoSchema);

module.exports = Promotions;
