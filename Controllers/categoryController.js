const asyncHandler = require("express-async-handler");
const { Category } = require("../models/Category");
const { SubCategory } = require("../models/SubCategory");
/**-----------------------------------------------
 * @desc    add category
 * @route   /api/category
 * @method  POST
 * @access   private (only admin)
 ------------------------------------------------*/
module.exports.addcategory = asyncHandler(async (req, res) => {
  let name = req.body.name;
  let category = await Category.findOne({ name: name });
  if (category) {
    return res.status(400).json("category  already existed");
  } else {
    category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    await category.save();
    res.status(201).json(category);
  }
});
module.exports.addsubcategory = asyncHandler(async (req, res) => {
  let name = req.body.name;
  let subCategory = await SubCategory.findOne({ name: name });
  if (subCategory) {
    return res.status(400).json("category  already existed");
  } else {
    subCategory = new SubCategory({
      CategoryId: req.body.CategoryId,
      name: req.body.name,
      description: req.body.description,
    });
    await subCategory.save();
    res.status(201).json(subCategory);
  }
});
//6511c0686c2f7120d375283d
