const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./index");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "courses",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 500, crop: "limit", quality: "auto" },
    ],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
module.exports = upload;
