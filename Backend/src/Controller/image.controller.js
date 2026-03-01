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
      featured: featured === "true",
      image: response.url,
      fileId: response.fileId, // IMPORTANT for deletion
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

    const { category, medium, featured, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (medium) filter.medium = medium;
    if (featured !== undefined) filter.featured = featured === "true";
    if (search) filter.title = { $regex: search, $options: "i" };

    const images = await ImageModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ImageModel.countDocuments(filter);

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

exports.getSingleImage = async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const updated = await ImageModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({
      message: "Image updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from ImageKit
    if (image.fileId) {
      await imagekit.deleteFile(image.fileId);
    }

    // Delete from MongoDB
    await ImageModel.findByIdAndDelete(req.params.id);

    res.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
