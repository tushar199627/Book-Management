const { isValidObjectId } = require("mongoose");
const bookmodel = require("../model/bookmodel");
const reviewmodel = require("../model/reviewmodel");

const { isValid , isValidObjectId} = require("../validator/validate");

//update review
const updateReview = async function (req, res) {
    try {

        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        let data = req.body;

        if (isValid(data)) {
            return res.status(400).send({ status: false, msg: "please enter some data for update" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "Book Id is Required" });
        }
        if (!reviewId) {
            return res.status(400).send({ status: false, message: "reviewId is  Required" })
        }

        const book = await bookmodel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(400).send({ status: false, message: "No book exist with this id" })
        }
        // validating bookId is a valid object Id or not
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "please provide a valid reviewid" });
        }
        let review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review) {
            return res.status(400).send({ status: false, message: "No review exist with this id" })
        }


    }



    catch (error) {

    }
}

module.exports.updateReview = updateReview;