const { uploadBuffer } = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/error");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Koi image file nahi mili");
  }
  const result = await uploadBuffer(req.file.buffer, "nrec-frontpage");
  res.status(201).json({ url: result.secure_url, publicId: result.public_id });
});

module.exports = { uploadImage };
