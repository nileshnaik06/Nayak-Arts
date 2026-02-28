// controllers/image.controller.js
const imagekit = require("../config/imagekit");
const ImageModel = require("../model/image.model");

exports.uploadImage = async (req, res) => {
  try {
    const { title, category, medium, description, year, featured } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/art-gallery",
    });

    // Save URL to MongoDB
    const newImage = await ImageModel.create({
      title,
      category,
      medium,
      description,
      year,
      featured,
      image: response.url, // store imagekit URL
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

exports.getImages = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    const images = await ImageModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ImageModel.countDocuments();

    res.json({
      data: images,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
