const router = require("express").Router();
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Sirf image file chalegi"));
    cb(null, true);
  }
});

router.post("/", protect, upload.single("image"), uploadImage);

module.exports = router;
