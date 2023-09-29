const {addToCart, getCart, getAllCarts, updateItemAmount, deleteCartItem, deleteCart} = require("../Controllers/cartController")

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

//CREATE

router.post("/addtocart", verifyTokenAndAuthorization, addToCart);
router.put("/delete-item", verifyTokenAndAuthorization, deleteCartItem);
router.put("/update-amount", verifyTokenAndAuthorization, updateItemAmount);

// //DELETE
router.delete("/:id",verifyTokenAndAuthorization, deleteCart);


// //GET ALL

router.get("/all", verifyTokenAndAdmin, getAllCarts);

//GET USER CART
router.get("/:id", verifyTokenAndAuthorization, getCart);


module.exports = router;
