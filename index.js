const express = require("express");
require("dotenv").config();
const connectToDb = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/error");
const auth = require("./routes/authRoute");
const user = require("./routes/usersRoute");
const product = require("./routes/productRoute");
const category = require("./routes/categoryRoute");
const { Product, validateAddProduct } = require("./models/Product");
// Connection To Db
connectToDb();
// Init App
const app = express();

// Middlewares
app.use(express.json());
// Routes
app.use("/api/auth", auth);
// app.use("/api/users", user);

app.use("/api/product", product);
app.use("/api/category", category);
// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
