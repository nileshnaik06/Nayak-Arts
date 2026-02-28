// routes/image.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/image.upload");
const { uploadImage, getImages } = require("../Controller/image.controller");

router.post("/upload", upload.single("image"), uploadImage);

router.get("/", getImages);

module.exports = router;
