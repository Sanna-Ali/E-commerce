const mongoose = require("mongoose");
const SubCategorySchema = new mongoose.Schema({
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = { SubCategory };
