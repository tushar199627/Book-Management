const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    bookId: {
      type: objectId,
      required: true,
      ref: "bookDb",
      trim: true,
    },

    reviewedBy: {
      type: String,
      required: true,
      default: "Guest",
      trim: true,
    },

    reviewedAt: {
      type: Date,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      trim: true,
    },

    review: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", userSchema);
