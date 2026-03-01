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
const auth = require("../middleware/auth.middleware");

router.post("/", auth, upload.single("image"), uploadImage);
router.get("/", auth, getImages);
router.get("/:id", auth, getSingleImage);
router.put("/:id", auth, updateImage);
router.delete("/:id", auth, deleteImage);

module.exports = router;
