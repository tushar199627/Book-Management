const express = require("express");

const router = express.Router();
const bookcontroller = require("../controller/bookcontroller");
const usercontroller = require("../controller/usercontroller");
const reviewcontroller = require("../controller/reviewcontroller");
const { checkAuth } = require("../middleware/auth");

//===================================================[USER ROUTE HANDLER]===========================================================
router.post("/register", usercontroller.createUser);
router.post("/login", usercontroller.userLogin);

//===================================================[BOOK ROUTE HANDLER]===========================================================
router.post("/books", checkAuth, bookcontroller.createBook);
router.get("/books", checkAuth, bookcontroller.bookList);
router.get("/books/:bookId", checkAuth, bookcontroller.getBookById);
router.put("/books/:bookId", checkAuth, bookcontroller.updateBook);
router.delete("/books/:bookId", checkAuth, bookcontroller.deleteBook);

//===================================================[REVIEW ROUTE HANDLER]===========================================================
router.post("/books/:bookId/review", reviewcontroller.reviewBook);
router.put("/books/:bookId/review/:reviewId", reviewcontroller.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewcontroller.deleteReview);



module.exports = router;
