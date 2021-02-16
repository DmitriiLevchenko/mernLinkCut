const { Router } = require("express");
const shortId = require("shortid");

const Link = require("../models/Link");

const config = require("../config/default.json");

const authMiddleware = require("../middleware/authMiddleware");

const linksRouter = Router();

linksRouter.post("/generate", authMiddleware, async (req, res) => {
  try {
    const baseUrl = config.baseUrl;

    const { from } = req.body;
    const code = shortId.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      res.json({link:existing,ok:true});
    }

    const to = baseUrl + "/t/" + code;
    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();

    res.status(201).json({ link,  ok:true});
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});
linksRouter.get("/", authMiddleware, async (req, res) => {
  try {
    links = await Link.find({ owner: req.user.userId });
    res.status(200).json({ links });
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});
linksRouter.get("/:id", async (req, res) => {
  try {
    links = await Link.findById(req.params.id);
    res.status(200).json({ links });
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});
module.exports = linksRouter;
