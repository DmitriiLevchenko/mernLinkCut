//modules
const express = require("express");
const config = require("./config/default.json");
const mongoose = require("mongoose");
//Routes
const authRoutes = require("./routes/authRouters.js");
const linkRoutes = require("./routes/linksRoutes.js");
const redirectRoutes = require("./routes/redirectRoutes.js");
//middlewares

//settings
const PORT = config.port || 5000;
const app = express();
//app modules
app.use(express.json({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/link", linkRoutes);
app.use("/t", redirectRoutes);

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
