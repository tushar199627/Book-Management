//===================================DELETE /books/:bookId=========================================

const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let book = await bookmodel.findById(bookId)
        if (book.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No such bookId exists" })
        }
        let deletedBook = await bookmodel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        res.status(201).send({ status: true, msg: deletedBook })
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}


module.exports.deleteBook = deleteBook


