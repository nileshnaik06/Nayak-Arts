const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Thermacol Art",
        "Foam Art",
        "Paintings",
        "Model Creaetion",
        "DIY Art",
        "Experimental",
        "Sketching",
      ],
      default: "Paintings",
    },
    medium: {
      type: String,
      enum: [
        "Carved Thermocol",
        "Acrylic on Canvas",
        "Mixed Media Collage",
        "Carved Thermocol Relief",
        "Mixed Materials Model",
        "Oil on Canvas",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    fileId: {
      type: String,
    },
  },
  { timestamps: true },
);

const imageModel = mongoose.model("image", imageSchema);

module.exports = imageModel;
