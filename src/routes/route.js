const express = require("express");

const router = express.Router();
const bookcontroller = require("../controller/bookcontroller");
const usercontroller = require("../controller/usercontroller");
const reviewcontroller = require("../controller/reviewcontroller");
const {uploadFile} = require("../aws/aws");
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



router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
},uploadFile)
module.exports = router;
