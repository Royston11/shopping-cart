const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const sequelize = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const productRoutes = require("./src/routes/productRoutes");
const chatbotRoutes = require("./src/routes/chatbot");

// Import Models
const User = require("./src/models/User");
const Product = require("./src/models/Product");
const Cart = require("./src/models/Cart");

// Sync relationships
User.hasMany(Cart, { foreignKey: "userId" });
Product.hasMany(Cart, { foreignKey: "productId" });

// Initialize app
const app = express();

// CORS Configuration
app.use((req, res, next) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Handle preflight requests
    }

    next();
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Sync database
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Database sync error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
