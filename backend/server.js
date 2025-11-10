const express = require("express");
const { swaggerUi, specs } = require("./src/swagger");

require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./src/routes/auth");
const itemRoutes = require("./src/routes/items");
const bookingRoutes = require("./src/routes/bookings");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Simple health
app.get("/", (req, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV || "dev" })
);

// route registration
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(5000, () => console.log("Server running on port 5000"));

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.error(
        "MONGO_URI missing in .env — copy .env.example to .env and set it."
      );
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server running on port", PORT));
  } catch (err) {
    console.error("Start error", err);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
