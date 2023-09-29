const asyncHandler = require("express-async-handler");
const { Cart } = require("../models/Cart");
const { Product } = require("../models/Product");

const addToCart = asyncHandler(async (req, res) => {
  const existedProduct = await Product.findById(req.body.productId);
  if (existedProduct.deletedAt != null) {
    return res.status(404).json("product not found");
  }
  const price = existedProduct.price;
  const { quantity, productId } = req.body;

  const newItem = {
    productId: productId,
    quantity: quantity,
    price: price,
    totalPrice: quantity * price,
  };

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = new Cart({
      userId: req.user.id,
      products: newItem,
    });
    await cart.save();
    return res.status(201).json(cart);
  }
  const product = cart.products.find(
    (e) => e.productId.toString() == req.body.productId
  );
  if (!product) {
    cart.products.push(newItem);
    await cart.save();
    return res.status(200).json(cart);
  }
  cart.products.map((r) => {
    if (r.productId == req.body.productId) {
      {
        r.quantity += quantity;
        r.totalPrice += quantity * price;
      }
    }
  });
  await cart.save();
  res.status(200).json(cart);
});

const getCart = asyncHandler(async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.id });
    if (!cart) {
      return res.status(404).json("no cart yet");
    }

    let subTotal = cart.products.map((e) => {
      return e.price * e.quantity;
    });

    let total = subTotal.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    res.status(200).json({ cart, total: total });
  } catch (err) {
    res.status(500).json(err);
  }
});

const getAllCarts = asyncHandler(async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

const updateItemAmount = asyncHandler(async (req, res) => {
  const existedProduct = await Product.findById(req.body.productId);
  if (!existedProduct) {
    return res.status(404).json("product not found");
  }
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    res.status(404).json({ message: "cart not found" });
  }
  const product = cart.products.find((ele) => {
    console.log(ele.productId.toString(), 11111, req.body.productId);
    return ele.productId.toString() === req.body.productId;
  });

  let updatedCart;
  if (req.body.quantity == 0) {
    updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $pull: { products: product },
      },
      {
        new: true,
      }
    );
  } else {
    updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $pull: { products: product },
      },
      {
        new: true,
      }
    );

    updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $push: {
          products: {
            productId: req.body.productId,
            quantity: req.body.quantity,
            price: product.price,
            totalPrice: product.price * req.body.quantity,
          },
        },
      },
      {
        new: true,
      }
    );
  }
  await updatedCart.save();
  if (updatedCart.products.length == 0) await cart.deleteOne();
  res.status(200).json(updatedCart);
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ message: "cart not found" });
  }
  const product = cart.products.find((ele) => {
    return ele.productId.toString() === req.body.productId;
  });
  let updatedCart = await Cart.findByIdAndUpdate(
    cart._id,
    {
      $pull: { products: product },
    },
    {
      new: true,
    }
  );
  await updatedCart.save();
  if (updatedCart.products.length == 0) await cart.deleteOne();
  res.status(200).json(updatedCart);
});

const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ message: "cart not found" });
  }
  await cart.deleteOne();
  res.status(200).json({ message: "cart deleted successfully" });
});

module.exports = {
  addToCart,
  getCart,
  getAllCarts,
  updateItemAmount,
  deleteCartItem,
  deleteCart,
};

// const updatedObjects = cart.products.map((obj, index) => ({
//   obj,
//   value: subTotal[index],
// }));
// console.log(updatedObjects)
