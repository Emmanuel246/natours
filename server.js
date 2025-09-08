const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

// Handle uncaught exceptions before loading the app
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(`Error name: ${err.name}`);
  logger.error(`Error message: ${err.message}`);
  logger.error(`Stack trace: ${err.stack}`);
  process.exit(1);
});

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production"
    ? "./config.env.production"
    : "./config.env";

dotenv.config({ path: envFile });

// Import app after environment variables are loaded
const app = require("./app");

// Database connection configuration
const DB =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
    : process.env.DATABASE_LOCAL || "mongodb://localhost:27017/natours";

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(DB, mongoOptions);
    logger.info("✅ Database connection successful!");
    logger.info(`📊 Connected to: ${mongoose.connection.name}`);
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);

    // Retry connection after 5 seconds
    logger.info("🔄 Retrying database connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("error", (err) => {
  logger.error(`❌ MongoDB connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("✅ MongoDB reconnected");
});

// Connect to database
connectDB();

const port = process.env.PORT || 3000;
let server;

// Start server only after database connection is established
const startServer = () => {
  server = app.listen(port, () => {
    logger.info(
      `🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`,
    );
    logger.info(`🌐 Server URL: http://localhost:${port}`);
  });
};

// Start server after a short delay to ensure DB connection
setTimeout(startServer, 1000);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close((err) => {
      if (err) {
        console.error("❌ Error during server shutdown:", err);
        process.exit(1);
      }

      console.log("✅ HTTP server closed");

      // Close database connection
      mongoose.connection.close(false, () => {
        console.log("✅ Database connection closed");
        console.log("👋 Process terminated gracefully");
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log("Error name:", err.name);
  console.log("Error message:", err.message);
  console.log("Stack trace:", err.stack);

  gracefulShutdown("UNHANDLED_REJECTION");
});

// Handle SIGTERM (e.g., from process managers like PM2)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle SIGINT (e.g., Ctrl+C)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
