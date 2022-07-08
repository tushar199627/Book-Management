const bookmodel = require("../model/bookmodel");
const usermodel = require("../model/usermodel");
const reviewmodel = require("../model/reviewmodel");


const { isValid, isValidRequestBody, isValidObjectId, validISBN } = require("../validator/validate");

// create book
const createBook = async function (req, res) {

    try {
        let requestBody = req.body
        let { title, excerpt, userId, ISBN, category, subcategory } = requestBody

        if (isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "Please provide the Details" });
        }
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


        let checkid = await usermodel.findOne({ _id: userId })
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
        if (!Array.isArray(subcategory)) {
            return res.status(400).send({ status: false, msg: "SubCatagogy Must be in Array" });
        }
        if (Array.isArray(subcategory)) {
            if (subcategory.length == 0) {
                return res.status(400).send({ status: false, msg: "SubCatagogy cannot be empty" });
            }
        }

        let titleCheck = await bookmodel.findOne({ title: title })
        if (titleCheck) {
            return res.status(400).send({ status: false, msg: "title already exist" })
        }

        let ISBNCheck = await bookmodel.findOne({ ISBN: ISBN })
        if (ISBNCheck) {
            return res.status(400).send({ status: false, msg: "ISBN already exist" })
        }

        requestBody.releasedAt = new Date().getTime()

        let createBook = await bookmodel.create(requestBody)
        return res.status(201).send({ status: true, msg: "Book sucessfully Created", data: createBook })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
}

const bookList = async function (req, res) {
    try {
        let query = req.query

        let books = await bookmodel.find({ $and: [query, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

        books.sort(function (a, b) {
            return a.title.localeCompare(b.title)
        })

        if (books.length == 0)
            return res.status(404).send({ status: false, message: "Books are not present" })


        return res.status(200).send({ status: true, message: 'Books list', data: books })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}




const getBookById = async function (req, res) {

    try {

        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }

        let findBook = await bookmodel.findById({ _id: bookId, isDeleted: false })

        let deleted = findBook.isDeleted
        if (deleted == true) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }

        if (findBook.length == 0) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }
        let findReview = await reviewmodel.find({ bookId: bookId })


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



const updateBook = async function (req, res) {

    try {
        let bookId = req.params.bookId;

        if (!bookId) {
            return res.status(400).send({ status: false, msg: "Book Id is Required" });
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }

        let findBook = await bookmodel.findById({ _id: bookId })
        if (findBook.length == 0) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }
        let deleted = findBook.isDeleted
        if (deleted == true) {
            return res.status(404).send({ status: false, msg: "Book not Found" });
        }

        let requestBody = req.body
        let { title, excerpt, releasedAt, ISBN } = requestBody

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" });
        }

        let isAllreadyExistTitle = await bookmodel.findOne({ title: title })
        if (isAllreadyExistTitle) {
            return res.status(400).send({ status: false, msg: `${title} is allready exist` });
        }

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Excerpt is required" });
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Release Date is required" });
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN is required" });
        }

        let isAllreadyExistISBN = await bookmodel.findOne({ ISBN: ISBN })
        if (isAllreadyExistISBN) {
            return res.status(400).send({ status: false, msg: `${ISBN} is already exist` });
        }

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



const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let book = await bookmodel.findById(bookId)
        if (book.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No such bookId exists" })
        }
        let deleteBook = await bookmodel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        res.status(201).send({ status: true, msg: deletedBook })


        if (!bookId) {
            return res.status(400).send({ status: false, msg: "Book Id is Required" });
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Book Id" });
        }

        let findBook = await bookmodel.findById({ _id: bookId })
        if (findBook.isDeleted === true) {
            return res.status(404).send({ status: false, message: "Book not Found or Already been Deleted" })
        }

        let deletedBook = await bookmodel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, msg: "Book Deleted Successfully", data: deletedBook })



    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}








module.exports = { createBook, bookList, getBookById, updateBook, deleteBook }
