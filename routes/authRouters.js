const { Router } = require("express");
const bycrpt = require("bcryptjs");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
const { check, validationResult } = require("express-validator");
const authRouter = Router();
// /api/auth
authRouter.post(
  "/register",
  [
    check("email", "incorrect email").isEmail(),
    check(
      "password",
      "incorrect password, min length of password is 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({
          errors: validationErrors.array(),
          message: "incorrect data",
        });
      }
      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with same Email already exists" });
      }

      const hashedPassword = await bycrpt.hash(password, 12);

      const user = new User({ email, password: hashedPassword });

      await user.save();
      res.status(201).json({ message: "User created", ok: true });
    } catch (e) {
      res
        .status(500)
        .json({ message: `something went wrong:( ${e.message} )` });
    }
  }
);
authRouter.post(
  "/login",
  [
    check("email", "Input correct email").isEmail(),
    check("password", "Input password").isLength({ min: 6 }).exists(),
  ],
  async (req, res) => {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({
          errors: validationErrors.array(),
          message: "incorrect data on login",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }
      const isMatch = await bycrpt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "incorrect password or Email" });
      }
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: "1h",
      });

      res
        .status(200)
        .json({
          token,
          userId: user._id,
          ok: true,
          message: "Log in sucessful",
        });
    } catch (e) {
      res
        .status(500)
        .json({ message: `something went wrong:( ${e.message} )` });
    }
  }
);
module.exports = authRouter;
