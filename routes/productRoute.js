const router = require("express").Router();
// const { Product, validateAddProduct } = require("../models/Product");
const photoUpload = require("../middlewares/photoUpload");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const validateObjectId = require("../middlewares/validateObjectId");
const {
  addProductCtrl,
  rating,
  getProductById,
  updateproduct,
  getAllProducts,
  addcategory,
  deleteproductbyId,
  getAllProductsAdmin,
  deleteproductbyIdf,
} = require("../Controllers/productController");
///api/product/addproduct
router.post(
  "/addproduct",
  verifyTokenAndAdmin,
  photoUpload.single("image"),
  addProductCtrl
);
router.get("/admin", verifyTokenAndAdmin, getAllProductsAdmin);
// /api/product/addrating
router.post(
  "/addrating/:id",
  validateObjectId,
  verifyTokenAndAuthorization,
  rating
);

deleteproductbyIdf;
router.get("/:id", validateObjectId, getProductById);
router.put("/:id", validateObjectId, verifyTokenAndAdmin, updateproduct);

router.get("/", validateObjectId, getAllProducts);
router.delete("/:id", validateObjectId, verifyTokenAndAdmin, deleteproductbyId);
router.delete(
  "/:id",
  validateObjectId,
  verifyTokenAndAdmin,
  deleteproductbyIdf
);

module.exports = router;
