const express = require("express");
const config = require("./config/default.json");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRouters.js");
const PORT = config.port || 5000;
const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", authRoutes);

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(
        `server start on port ${PORT} ... link http://localhost:${PORT}`
      );
    });
  } catch (e) {
    console.log("Server Error: " + e);
    process.exit();
  }
};

start();
