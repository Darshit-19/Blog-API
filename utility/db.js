const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Handle connection events 
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected");
});

module.exports = dbConnection;
