const bookmodel = require("../model/bookmodel");
const reviewmodel = require("../model/reviewmodel");
const {
  isValidObjectId,
  isValidRequestBody,
  validRating,
  isValid,
  validName,
  reviewedDate,
} = require("../validator/validate");

//================================================REVIEW BOOK===========================================================================//

const reviewBook = async function (req, res) {
  try {
    let bookId = req.params.bookId; //writing the bookId in the params we want to fetch detail about

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "Book Id is required" });
    }

    if (!isValidObjectId(bookId)) {
      // validating bookId is a valid object Id or not
      return res
        .status(400)
        .send({ status: false, message: "Please Provide a valid book Id" });
    }
    let findBook = await bookmodel.findById({ _id: bookId });

    if (!findBook) {
      return res
        .status(404)
        .send({ status: false, message: "Book Id not found" });
    }

    //finding the book from the bookmodel
    let bookDetail = await bookmodel.findById({
      _id: bookId,
    });

    //checking wheather the book is deleted or not if it is deleted it should returnthe below response
    if (bookDetail.isDeleted === true) {
      return res.status(404).send({
        status: false,
        message: "Book not Found or Already been Deleted",
      });
    }

    let requestBody = req.body; //getting data from request body

    let { review, rating, reviewedBy, reviewedAt } = requestBody; //Destructuring data coming from request body

    if (isValidRequestBody(requestBody)) {
      //validating is there any data inside request body
      return res
        .status(400)
        .send({ status: false, message: "Please provide the Details" });
    }

    //validation starts
    if (!isValid(review)) {
      return res
        .status(400)
        .send({ status: false, message: "Review is required" });
    }

    if (!isValid(rating)) {
      return res
        .status(400)
        .send({ status: false, message: "Rating is required" });
    }
    if (!validRating(rating)) {
      return res
        .status(400)
        .send({ status: false, message: "Rating must be between 1 to 5" });
    }
    if (!isValid(reviewedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "ReviewAt is required" });
    }
    if (!reviewedDate.test(reviewedAt)) {
      return res.status(400).send({
        status: false,
        message: "Reviewed Date should be in YYYY-MM-DD format",
      });
    }

    //the data that we want to show in the response body , i stored in a variable in a  Object form
    let reviewData = {
      bookId: bookId,
      reviewedBy: requestBody.reviewedBy,
      reviewedAt: Date.now(),
      rating: requestBody.rating,
      review: requestBody.review,
    };

    //then i have created the review
    let bookReview = await reviewmodel.create(reviewData);

    let updatedBook = await bookmodel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: 1 } },
      { new: true }
    );

    //the data that we want to show in the response body , i stored in a variable in a  Object form
    let reviewDetails = {
      _id: `ObjectId(${bookDetail._id})`,
      title: bookDetail.title,
      excerpt: bookDetail.excerpt,
      userId: `ObjectId(${bookDetail.userId})`,
      category: bookDetail.category,
      subcategory: bookDetail.subcategory,
      isDeleted: bookDetail.isDeleted,
      review: updatedBook.reviews,
      releasedAt: bookDetail.releasedAt,
      createdAt: bookDetail.createdAt,
      updatedAt: bookDetail.updatedAt,
      reviewsData: {
        _id: bookReview._id,
        bookId: `ObjectId(${bookReview.bookId})`,
        reviewedBy: bookReview.reviewedBy,
        reviewedAt: bookReview.reviewedAt,
        rating: bookReview.rating,
        review: bookReview.review,
      },
    };

    return res.status(201).send({
      status: true,
      message: "Review Created Successfully",
      data: reviewDetails,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//================================================UPDATE REVIEW===========================================================================//
const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId; //writing the bookId in the params we want to fetch detail about
    let reviewId = req.params.reviewId; //writing the reviewId in the params we want to fetch detail about
    let data = req.body; //getting data from request body

    if (isValidRequestBody(data)) {
      //validating is there any data inside request body
      return res.status(400).send({
        status: false,
        message: "Please provide the Details in the Request Body",
      });
    }
    if (!isValidObjectId(bookId)) {
      // validating bookId is a valid object Id or not
      return res
        .status(400)
        .send({ status: false, message: "Please Provide a valid book Id" });
    }
    let findBooks = await bookmodel.findById({ _id: bookId });

    if (!findBooks) {
      return res
        .status(404)
        .send({ status: false, message: "Book Id not found" });
    }

    //finding the book from the bookmodel
    const findBook = await bookmodel.findById({
      _id: bookId,
    });
    if (findBook.isDeleted === true) {
      return res.status(404).send({
        status: false,
        message: "Book not Found or Already been Deleted",
      });
    }
    if (!isValidObjectId(reviewId)) {
      // validating reviewId is a valid object Id or not
      return res
        .status(400)
        .send({ status: false, message: "Please Provide a Valid Review Id" });
    }
    let findReviews = await reviewmodel.findById({
      _id: reviewId,
    });
    if (!findReviews) {
      return res
        .status(404)
        .send({ status: false, message: "Review Id not found" });
    }

    //find the review we want to update
    let findReview = await reviewmodel.findById({
      _id: reviewId,
    });
    if (findReview.isDeleted === true) {
      return res.status(404).send({
        status: false,
        message: "Review not Found or Already been Deleted",
      });
    }

    if (bookId != findReview.bookId) {
      //check wheather bookId in the params is same as the book Id of the review in DB
      return res.status(404).send({
        status: false,
        message: "Review Id is not belong to that Book Id",
      });
    }

    let { review, rating, reviewedBy } = data; //Destructuring data coming from request body

    // validation starts
    if (review) {
      if (!isValid(review)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid Review" });
      }
    }
    if (rating) {
      if (!isValid(rating)) {
        return res
          .status(400)
          .send({ status: false, message: "Please Provide a valid Rating" });
      }
    }
    if (rating) {
      if (!validRating(rating)) {
        return res
          .status(400)
          .send({ status: false, message: "Rating must be between 1 to 5" });
      }
    }
    if (reviewedBy) {
      if (!validName.test(reviewedBy)) {
        return res
          .status(400)
          .send({ status: false, message: "reviewer name cannot be a number" });
      }

      if (!isValid(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message: "Please provide a valid reviewer name",
        });
      }
    } // validation ends

    //find the review we want to update and update the review
    let updateReview = await reviewmodel
      .findOneAndUpdate(
        { _id: reviewId, bookId: bookId },
        {
          $set: {
            review: data.review,
            rating: data.rating,
            reviewedBy: data.reviewedBy,
          },
        },
        { new: true }
      )
      .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    let newData = {
      _id: `ObjectId(${findBook._id})`,
      title: findBook.title,
      excerpt: findBook.excerpt,
      userId: `ObjectId(${findBook.userId})`,
      category: findBook.category,
      subcategory: findBook.subcategory,
      isDeleted: findBook.isDeleted,
      review: findBook.reviews,
      releasedAt: findBook.releasedAt,
      createdAt: findBook.createdAt,
      updatedAt: findBook.updatedAt,
      reviewsData: updateReview,
    };

    return res.status(200).send({
      status: true,
      message: "Review updated successfully",
      data: newData,
    });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

//================================================DELETE REVIEW===========================================================================//
const deleteReview = async function (req, res) {
  try {
    let bookId = req.params.bookId; //writing the bookId in the params we want to fetch detail about

    //check wheather book Id is present in the params or not
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "book Id is required" });
    }
    if (!isValidObjectId(bookId)) {
      // validating reviewId is a valid object Id or not
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid Book Id" });
    }
    let findBooks = await bookmodel.findById({ _id: bookId });

    if (!findBooks) {
      return res
        .status(404)
        .send({ status: false, message: "Book Id not found" });
    }

    let reviewId = req.params.reviewId; //writing the review Id in the params we want to fetch detail about

    //check wheather review Id is present in the params or not
    if (!reviewId)
      return res
        .status(400)
        .send({ status: false, message: "review Id is required" });
    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid review Id" });
    }

    let findReviews = await reviewmodel.findById({
      _id: reviewId,
    });
    if (!findReviews) {
      return res
        .status(404)
        .send({ status: false, message: "Review Id not found" });
    }
    //find the id of the review which have isDeleted as False
    let findreview = await reviewmodel.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    let findReviewId = await reviewmodel.findById({ _id: reviewId });

    if (bookId != findReviewId.bookId) {
      //check wheather bookId in the params is same as the book Id of the review in DB
      return res.status(404).send({
        status: false,
        message: "Review Id is not belong to that Book Id",
      });
    }

    //checking wheather there is something in the findreview or not

    if (!findreview) {
      return res
        .status(400)
        .send({ status: false, message: "Already been Deleted" });
    } else {
      await reviewmodel.findByIdAndUpdate(
        //updating the review with is Deleted as True
        { _id: reviewId },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );
    }

    //decreasing the review count in the bookmodel
    await bookmodel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: -1 } }
    );

    return res.status(200).send({ status: true, message: "Review is Deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { reviewBook, deleteReview, updateReview };
