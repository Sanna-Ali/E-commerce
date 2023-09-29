const mongoose = require("mongoose");
const Joi = require("joi");
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
  },

  productImage: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, required: true, default: 0 },
    },
  ],
  theRating: {
    type: Number,
    // required: true,
    default: 0,
  },
  deletedAt: { type: Date, default: null },
  thestatus: { type: String, required: true, enum: ["active", "inactive"] },
});
// UserSchema.virtual("ratings", {
//   ref: "Rating",
//   foreignField: "user",
//   localField: "_id",
// });
// Product Model
const Product = mongoose.model("Product", ProductSchema);
// Validate Add New Product
function validateAddProduct(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    description: Joi.string().trim().min(10).required(),
    productImage: Joi.string(),
    category: Joi.string(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    thestatus: Joi.string().required(),
  });
  return schema.validate(obj);
}
module.exports = {
  Product,
  validateAddProduct,
};
