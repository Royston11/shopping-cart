const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("library_db", "postgres", "royston1116", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized! ✅");
}).catch((error) => {
  console.error("Database sync error:", error);
});

module.exports = sequelize;
