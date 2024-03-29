const router = require("express").Router();
const File = require("../model/file");
const path = require("path");

router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    res.render("download", { error: "Link Has Been Expired" });
  }
  const filePath = `${__dirname}/../${file.path}`;
  res.download(filePath);
});

module.exports = router;