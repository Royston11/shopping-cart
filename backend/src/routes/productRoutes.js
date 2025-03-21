const express = require("express");
const authenticateUser = require("../middleware/authMiddleware"); // Ensure the user is authenticated
const productController = require("../controllers/productController");
const router = express.Router();
const Product = require("../models/Product");

// Route to get all products
router.get("/", async (req, res) => {
  try {
      const products = await Product.findAll(); // Fetch all products
      res.json(products);
  } catch (error) {
      console.error("Error fetching products:", error); // Log actual error
      res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get products for a specific user
router.get("/user-products", authenticateUser, productController.getUserProducts);

// Route to add a new product
router.post("/", authenticateUser, productController.addProduct);

// Route to delete a product by ID
router.delete("/:id", authenticateUser, productController.deleteProduct);

module.exports = router;
