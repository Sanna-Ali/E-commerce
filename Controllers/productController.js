const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const path = require("path");
const { Product, validateAddProduct } = require("../models/Product");
const fs = require("fs");
//const { Category } = require("../models/Category"); //Category
const { Category } = require("../models/Category");
/**-----------------------------------------------
 * @desc    Add New Product
 * @route   /api/product/addproduct
 * @method  POST
 * @access   private (only admin)
 ------------------------------------------------*/
module.exports.addProductCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }
  const { error } = validateAddProduct(req.body);
  if (error) {
    fs.unlink(
      path.join(__dirname, `../images/${req.file.filename}`),
      (error) => {
        console.log(error);
      }
    );
    return res.status(400).json({ message: error.details[0].message });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // new product
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    productImage: imagePath,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    thestatus: req.body.thestatus,
  });
  await product.save();
  res.status(201).json(product);
});
/**-----------------------------------------------
 * @desc    Add Rating
 * @route   /api/product/addrating/id
 * @method  POST
 * @access   private (only user)
 ------------------------------------------------*/
module.exports.rating = asyncHandler(async (req, res) => {
  const theuserId = req.user.id;
  console.log(theuserId);
  const newrating = req.body.rating;
  const product = await Product.findById(req.params.id);

  const userRating = product.ratings.filter(
    (rating) => rating.userId.toString() === theuserId.toString()
  );
  if (userRating) {
    userRating.rating = newrating;
  } else {
    product.ratings.push({ userId: theuserId, rating: newrating });
  }

  // Calculate the average rating for the product
  const users = product.ratings.length;
  const sumRatings = product.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  if (users > 0) {
    product.theRating = +sumRatings / +users;
  } else {
    product.theRating = newrating;
  }

  await product.save();
  // Save the updated product
  res.status(200).json("ok");
});
/**-----------------------------------------------
 * @desc    Get product by id
 * @route   /api/product/id
 * @method  GET
 * @access   public
 ------------------------------------------------*/
module.exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json("Product not found");
  }
});
/**-----------------------------------------------
 * @desc    update Product
 * @route   /api/product/id
 * @method  PUT
 * @access   private (only admin)
 ------------------------------------------------*/
module.exports.updateproduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  const updatedproduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedproduct);
});
/**-----------------------------------------------
 * @desc    get Products
 * @route   /api/product/
 * @method  get
 * @access   public
 ------------------------------------------------*/
module.exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, price } = req.query;
  let products;
  if (category) {
    products = await Product.find({
      category,
      deletedAt: null,
      thestatus: active,
    }).sort({
      createdAt: -1,
    });
  } else if (price) {
    products = await Product.find({
      price,
      deletedAt: null,
      thestatus: active,
    }).sort({
      createdAt: -1,
    });
  } else {
    products = await Product.find({ deletedAt: null, thestatus: active }).sort({
      createdAt: -1,
    });
  }
  res.status(200).json(products);
});
/**-----------------------------------------------
 * @desc    delete Product
 * @route   /api/product/:id/
 * @method  delete
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.deleteproductbyId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.deletedAt = new Date();
    await product.save();
    return res.status(200).json("deleted");
  } else {
    return res.status(404).json("product not found ");
  }
});
/**-----------------------------------------------
 * @desc    delete Product
 * @route   /api/product/destroy/:id/
 * @method  delete
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.deleteproductbyIdf = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("deleted");
  } else {
    return res.status(404).json("product not found ");
  }
});
/**-----------------------------------------------
 * @desc    get Products
 * @route   /api/product/
 * @method  get
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllProductsAdmin = asyncHandler(async (req, res) => {
  let products;
  if (req.query.keyword == "inactive") {
    products = await Product.find({
      thestatus: "inactive",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(products);
  } else if (req.query.keyword == "deleted") {
    products = await Product.find({ deletedAt: { $ne: null } });
    return res.status(200).json(products);
  } else {
    products = await Product.find({
      deletedAt: null,
      thestatus: "active",
    }).sort({
      createdAt: -1,
    });
    console.log("khju");
    return res.status(200).json(products);
  }
});
