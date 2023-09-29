const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      totalprice: { type: Number, required: true },
      price: { type: Number },
    },
  ],

  thestatus: {
    type: String,
    required: true,
    enum: ["pending", "cancelled", "accepted"],
    default: "pending",
  },
});
const Order = mongoose.model("Product", OrderSchema);
