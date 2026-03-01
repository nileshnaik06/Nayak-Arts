// routes/image.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/image.upload");
const {
  uploadImage,
  getImages,
  getSingleImage,
  updateImage,
  deleteImage,
} = require("../Controller/image.controller");

router.post("/", upload.single("image"), uploadImage);
router.get("/", getImages);
router.get("/:id", getSingleImage);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

module.exports = router;
