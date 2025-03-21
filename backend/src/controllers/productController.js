const Product = require("../models/Product");

const getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure user ID is retrieved from authentication middleware
    const userProducts = await Product.findAll({ where: { userId } });

    res.status(200).json(userProducts);
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Product name and price are required" });
    }

    const newProduct = await Product.create({ name, price, imageUrl });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export all functions correctly
module.exports = { getUserProducts, addProduct,  deleteProduct };
