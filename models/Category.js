const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
CategorySchema.virtual("SubCategory", {
  ref: "SubCategory",
  foreignField: "CategoryId",
  localField: "_id",
});
const Category = mongoose.model("Category", CategorySchema);
module.exports = { Category };
