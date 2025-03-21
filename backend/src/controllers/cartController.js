const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: "Unauthorized. Please log in." });
        if (!productId || !quantity || quantity <= 0) return res.status(400).json({ error: "Invalid product ID or quantity." });

        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ error: "Product not found." });

        let existingItem = await Cart.findOne({ where: { userId, productId } });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json(existingItem);
        }

        const newCartItem = await Cart.create({ userId, productId, quantity });
        res.status(201).json(newCartItem);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all cart items for logged-in user
exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: Product, attributes: ["id", "name", "price", "imageUrl"] }]
        });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Decrease item quantity in the cart
exports.decreaseQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const cartItem = await Cart.findOne({ where: { userId, productId } });

        if (!cartItem) return res.status(404).json({ error: "Item not found in cart." });

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        } else {
            await cartItem.destroy();
        }

        const updatedCart = await Cart.findAll({
            where: { userId },
            include: [{ model: Product, attributes: ["id", "name", "price", "imageUrl"] }]
        });

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error decreasing quantity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params; // Ensure this matches what frontend sends

        const cartItem = await Cart.findOne({ where: { productId, userId } });

        if (!cartItem) return res.status(404).json({ error: "Item not found in cart." });

        await cartItem.destroy();
        res.status(200).json({ message: "Item removed from cart." });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

