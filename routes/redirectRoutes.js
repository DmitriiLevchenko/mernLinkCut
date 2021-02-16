const { Router } = require("express");
const Link = require("../models/Link");
const redirectRoutes = Router();

redirectRoutes.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }
    res.status(404).json({ message: "Link not found" });
  } catch (e) {
    res.status(500).json({ message: `something went wrong:( ${e.message} )` });
  }
});

module.exports = redirectRoutes;
