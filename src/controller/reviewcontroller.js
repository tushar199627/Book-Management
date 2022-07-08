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
      _id: bookId,
      isDeleted: false,
    });

    if (bookDetail.length == 0) {
      return res.status(404).send({ status: false, msg: "Book Not found" });
    }

    let requestBody = req.body;

    let { review, rating, reviewedBy } = requestBody;

    if (isValidRequestBody(requestBody)) { //validating is there any data inside request body
        return res.status(400).send({ status: false, msg: "Please provide the Details" });
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

    return res
      .status(201)
      .send({
        status: true,
        msg: "Review Created Successfully",
        data: reviewDetails,
      });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { reviewBook };
