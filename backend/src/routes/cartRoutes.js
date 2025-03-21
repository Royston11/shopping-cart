const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Add item to cart
router.post("/", authenticateUser, cartController.addToCart);

// Get all cart items for logged-in user
router.get("/", authenticateUser, cartController.getCartItems);

// Decrease quantity of a product in the cart
router.post("/decrease", authenticateUser, cartController.decreaseQuantity);

// Remove an item from the cart
router.delete("/:productId", authenticateUser, cartController.removeFromCart);


module.exports = router;
