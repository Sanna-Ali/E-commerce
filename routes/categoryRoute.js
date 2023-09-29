const router = require("express").Router();
const {
  addcategory,
  addsubcategory,
} = require("../Controllers/categoryController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyTokenAndAdmin, addcategory);
router.post("/s", verifyTokenAndAdmin, addsubcategory);

module.exports = router;
