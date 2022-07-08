const bookmodel = require("../model/bookmodel");
const reviewmodel = require("../model/reviewmodel");
const {
  isValidObjectId,
  isValidRequestBody,
  validRating,
  isValid,
} = require("../validator/validate");

//review

const reviewBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, msg: "Book Id is required" });
    }

    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Provide a valid book Id" });
    }

    let bookDetail = await bookmodel.findById({
      _id: bookId});

      if (bookDetail.isDeleted === true) {
        return res.status(404).send({
          status: false,
          message: "Book not Found or Already been Deleted",
        });
      }

    let requestBody = req.body;

    let { review, rating, reviewedBy } = requestBody;

    if (isValidRequestBody(requestBody)) {
      //validating is there any data inside request body
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the Details" });
    }

    if (!isValid(review)) {
      return res.status(400).send({ status: false, msg: "Review is required" });
    }

    if (!isValid(rating)) {
      return res.status(400).send({ status: false, msg: "Rating is required" });
    }
    if (!validRating(rating)) {
      return res
        .status(400)
        .send({ status: false, msg: "Rating must be between 1 to 5" });
    }
    if (!isValid(reviewedBy)) {
      return res
        .status(400)
        .send({ status: false, msg: "Reviewer Name is required" });
    }
    let reviewData = {
      bookId: bookId,
      reviewedBy: requestBody.reviewedBy,
      reviewedAt: Date.now(),
      rating: requestBody.rating,
      review: requestBody.review,
    };

    let savedData = await reviewmodel.create(reviewData);

    await bookmodel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: 1 } }
    );

    let reviewDetails = {
      _id: `ObjectId(${savedData._id})`,
      bookId: `ObjectId(${savedData.bookId})`,
      reviewedBy: savedData.reviewedBy,
      reviewedAt: savedData.reviewedAt,
      rating: savedData.rating,
      review: savedData.review,
    };

    return res.status(201).send({
      status: true,
      msg: "Review Created Successfully",
      data: reviewDetails,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};



//update review
const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let data = req.body;

    if (isValidRequestBody(data)) {
      //validating is there any data inside request body
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the Details in the Request Body" });
    }
    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Provide a valid book Id" });
    }

    const findBook = await bookmodel.findById({
      _id: bookId
    });
    if (findBook.isDeleted === true) {
        return res.status(404).send({
          status: false,
          message: "Book not Found or Already been Deleted",
        });
      }
    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Provide a Valid Review Id" });
    }
    let findReview = await reviewmodel.findById({
      _id: reviewId
    });
    if (findReview.isDeleted === true) {
        return res.status(404).send({
          status: false,
          message: "Review not Found or Already been Deleted",
        });
      }

    let { review, rating, reviewedBy } = data;

    if (!isValid(review)) {
      return res.status(400).send({ status: false, msg: "Review field is required" });
    }

    if (!isValid(rating)) {
      return res.status(400).send({ status: false, msg: "Rating field is required" });
    }
    if (!validRating(rating)) {
      return res
        .status(400)
        .send({ status: false, msg: "Rating must be between 1 to 5" });
    }
    if (!isValid(reviewedBy)) {
      return res
        .status(400)
        .send({ status: false, msg: "ReviewedBy field is required" });
    }

    let updateReview = await reviewmodel.findOneAndUpdate(
      { _id: reviewId, bookId: bookId },
      {
        $set: {
          review: data.review,
          rating: data.rating,
          reviewedBy: data.reviewedBy,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "Review updated successfully",
        data: updateReview,
      });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};




//delete review
const deleteReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, msg: "book Id is required" });
    }
    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide a valid Book Id" });
    }

    let reviewId = req.params.reviewId;
    if (!reviewId)
      return res
        .status(400)
        .send({ status: false, msg: "review Id is required" });
    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide a valid review Id" });
    }

    let findreview = await reviewmodel.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!findreview) {
      return res.status(400).send({ status: false, msg: "not found" });
    } else {
      await reviewmodel.findByIdAndUpdate(
        { _id: reviewId },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );
    }

    await bookmodel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: -1 } }
    );

    return res.status(200).send({ status: true, msg: "Review is Deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { reviewBook, deleteReview, updateReview };
