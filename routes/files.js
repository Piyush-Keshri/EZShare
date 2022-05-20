const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../model/file");
const { v4: uuid4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)};`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 100000 * 100 },
}).single(File);

router.post("/", (req, res) => {
  // Store File
  upload(req, res, async (err) => {
    // Validate Request
    if (!req.file) {
      return res.json({
        err: "All Fields Are Required",
      });
    }

    if (err) {
      return res.status(500).send({ err: err.message });
    }
    // Store into DataBase
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `process.env.APP_BASE_URL/files/${response.uuid}`,
    });
  });

  // Response --> Link
});

router.post("/send", async (req, res) => {
  // Validate Request
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All Fields Are Required" });
  }
  // Get File From Database
  const file = await File.findOne({ uuid: uuid });
  if (sender) {
    return res.status(422).send({ error: "Email Already Sent" });
  }
  file.sender = emailFrom;
  file.reciever = emailTo;

  const response = await file.save();

  // Send Email
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "EzShare File Sharing",
    text: `${emailFrom} sent you a file`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 Hrs",
    }),
  });
  return res.send({ sucess: true });
});

module.exports = router;
