const { Router } = require("express");
const shortId = require("shortid");

const Link = require("../models/Link");

const config = require("../config/default.json");

const authMiddleware = require("../middleware/authMiddleware");

const linksRouter = Router();

linksRouter.post("/generate", async (res, req) => {
  try {
    const baseUrl = config.baseUrl;

    const { from } = req.body;
    const code = shortId.generate();

    const existing = await Link.findOne({ from });

    if(existing){
      res.json({})
    }
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});
linksRouter.get("/", authMiddleware, async (res, req) => {
  try {
    links = await Link.find({ owner: req.user.userId });
    res.status(200).json({ links });
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});
linksRouter.get("/:id", async (res, req) => {
  try {
    links = await Link.findById(req.params.id);
    res.status(200).json({ links });
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});
module.exports = linksRouter;
