const bookmodel = require("../model/bookmodel");
const usermodel = require("../model/usermodel");
const reviewmodel = require("../model/reviewmodel");


const { isValid, isValidRequestBody, isValidObjectId, validISBN } = require("../validator/validate");

// create book
const createBook = async function (req, res) {

    try {
        let requestBody = req.body //getting data from request body
        let { title, excerpt, userId, ISBN, category, subcategory } = requestBody //Destructuring data coming from request body

        if (isValidRequestBody(requestBody)) { //validating is there any data inside request body
            return res.status(400).send({ status: false, msg: "Please provide the Details" });
        }

         //here performing validation for data
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please provide a Title or a Valid title" });
        }


        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please provide a excerpt or a Valid excerpt" });
        }
        if (isValidRequestBody(userId)) {
            return res.status(400).send({ status: false, msg: "please provide userId" })
        }


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })

        }

        //checking wheather the user is present inside database or not
        let checkid = await usermodel.findOne({ _id: userId })

        //here performing validation for data
        if (!checkid) {
            return res.status(400).send({ status: false, msg: "user dosenot exis with this user id" })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: ' ISBN is required' })

        }
        if (!validISBN.test(ISBN)) {
            return res.status(400).send({ status: false, message: ' please provide  valid ISBN and should be 10 or 13 digits' })

        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "Please provide a category or a Valid category" });
        }

        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please provide a subcategory or a Valid subcategory" });
        }


        //checking wheather the subcategory is an array or not
        if (!Array.isArray(subcategory)) {
            return res.status(400).send({ status: false, msg: "SubCatagogy Must be in Array" });
        }
        if (Array.isArray(subcategory)) {
            if (subcategory.length == 0) {
                return res.status(400).send({ status: false, msg: "SubCatagogy cannot be empty" });
            }
        }


        //checking weather the title is already present in the database or not
        let titleCheck = await bookmodel.findOne({ title: title })
        if (titleCheck) {
            return res.status(400).send({ status: false, msg: "title already exist" })
        }
        //checking weather the ISBN is already present in the database or not
        let ISBNCheck = await bookmodel.findOne({ ISBN: ISBN })
        if (ISBNCheck) {
            return res.status(400).send({ status: false, msg: "ISBN already exist" })
        } //validation ended here

        requestBody.releasedAt = new Date().getTime()

         //after clearing all the validation document will be created
        let createBook = await bookmodel.create(requestBody)
        return res.status(201).send({ status: true, msg: "Book sucessfully Created", data: createBook })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
}


//get Book
const bookList = async function (req, res) {
    try {
        let query = req.query //getting data from request body


        //finding the book from a bookmodel
        let books = await bookmodel.find({ $and: [query, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })


        //sorting the title of the book in ascending order
        books.sort(function (a, b) {
            return a.title.localeCompare(b.title)
        })

        //checking wheather book is present in the database
        if (books.length == 0)
            return res.status(404).send({ status: false, message: "Books are not present" })

        //returning the response
        return res.status(200).send({ status: true, message: 'Books list', data: books })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//get book by book Id
const getBookById = async function (req, res) {

    try {

        let bookId = req.params.bookId //writing the bookId in the params we want to fetch detail about

        if (!isValidObjectId(bookId)) { // validating bookId is a valid object Id or not
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }
        //finding the book from the bookmodel
        let findBook = await bookmodel.findById({ _id: bookId, isDeleted: false })


        //checking wheather the book is deleted or not if it is deleted it should returnthe below response
        let deleted = findBook.isDeleted
        if (deleted == true) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }
        //checking if the findbook is empty or what
        if (findBook.length == 0) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }

        //finding the review for that particular book Id
        let findReview = await reviewmodel.find({ bookId: bookId })

        //the data that we want to show in the response body , i stored in a variable in a  Object form
        let bookDetails = {
            "_id": `ObjectId(${findBook._id})`,
            "title": findBook.title,
            "excerpt": findBook.excerpt,
            "userId": `ObjectId(${findBook.userId})`,
            "category": findBook.category,
            "subcategory": findBook.subcategory,
            "isDeleted": findBook.isDeleted,
            "review": findBook.reviews,
            "releasedAt": findBook.releasedAt,
            "createdAt": findBook.createdAt,
            "updatedAt": findBook.updatedAt,
            "reviewData": findReview

        }
        return res.status(200).send({ status: true, msg: "Book list", data: bookDetails })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }

}


//update book
const updateBook = async function (req, res) {

    try {
        let bookId = req.params.bookId; //writing the bookId in the params we want to fetch detail about

        //here performing validation for data
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "Book Id is Required" });
        }

         // validating bookId is a valid object Id or not
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }


        //finding the book we want to update from the bookmodel
        let findBook = await bookmodel.findById({ _id: bookId })
        if (findBook.length == 0) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }

        //checking wheather the book is deleted or what, if deleted it should return the below response
        let deleted = findBook.isDeleted
        if (deleted == true) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }

        let requestBody = req.body //getting data in request body
        let { title, excerpt, releasedAt, ISBN } = requestBody //Destructuring data coming from request body 

        //validation starts
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" });
        }
        //checking wheather the title of the book is present in the database ot what
        let isAllreadyExistTitle = await bookmodel.findOne({ title: title })
        if (isAllreadyExistTitle) {
            return res.status(400).send({ status: false, msg: `${title} is allready exist` });
        }
        //validation
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Excerpt is required" });
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Release Date is required" });
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN is required" });
        }

        //checking wheather the ISBN is present in the database or what
        let isAllreadyExistISBN = await bookmodel.findOne({ ISBN: ISBN })
        if (isAllreadyExistISBN) {
            return res.status(400).send({ status: false, msg: `${ISBN} is already exist` });
        } //  validation ends

        //find the book from the bookmodel and updating it
        let bookUpdated = await bookmodel.findOneAndUpdate({ _id: bookId },
            {$set:{
                title: requestBody.title,
                excerpt: requestBody.excerpt,
                releasedAt: requestBody.releasedAt,
                ISBN: requestBody.ISBN
             } },
            { new: true })

        return res.status(200).send({ status: true, msg: "Book Data Updated Successfully", data: bookUpdated })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }

}

//delete book
   const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId //writing the bookId in the params we want to fetch detail about

        let book = await bookmodel.findById(bookId)
        if (book.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No such bookId exists" })
        }
        let deleteBook = await bookmodel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        res.status(201).send({ status: true, msg: deletedBook })


        //here performing validation for data
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "Book Id is Required" });
        }

         // validating bookId is a valid object Id or not
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }

        //finding the book we want to update from the bookmode
        let findBook = await bookmodel.findById({ _id: bookId })
        if (findBook.isDeleted === true) {
            return res.status(404).send({ status: false, message: "Book not Found or Already been Deleted" })
        }

        //finsing the book that we want to delete and update the isDeleted as True in the database
        let deletedBook = await bookmodel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, msg: "Book Deleted Successfully", data: deletedBook })



    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}








module.exports = { createBook, bookList, getBookById, updateBook, deleteBook }


