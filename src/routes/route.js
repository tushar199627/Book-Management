const express=require("express");
const router =express.Router();
const bookcontroller=require("../controller/bookcontroller");
const usercontroller=require("../controller/usercontroller");
const reviewcontroller =require("../controller/reviewcontroller");

//===================================================[USER ROUTE HANDLER]===========================================================
router.post("/register", usercontroller.createUser)
router.post("/login", usercontroller.userLogin)


//===================================================[BOOK ROUTE HANDLER]===========================================================
router.post("/books", bookcontroller.createBook)
router.get("/books", bookcontroller.bookList)
router.get("/books/:bookId", bookcontroller.getBookById)
router.put("/books/:bookId", bookcontroller.updateBook)
router.delete("/books/:bookId", bookcontroller.deleteBook)

//===================================================[REVIEW ROUTE HANDLER]===========================================================

router.put("/books/:bookId/review/:reviewId", reviewcontroller.updateReview )

module.exports=router;