
const bookmodel = require("../model/bookmodel");
const usermodel = require("../model/usermodel");

const { isValid, isValidRequestBody,isValidObjectId, validISBN, } = require("../validator/validate");

// create book
const createBook = async function (req, res) {

    try {
        let requestBody = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews } = requestBody

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

        
        if(!isValidObjectId(userId)) {       
            return res.status(400).send({status: false, message: `${userId} is not a valid user id`})
            
         }
      

        let checkid = await usermodel.findOne({_id: userId })
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

        let titleCheck = await bookmodel.findOne({ title: title })
        if (titleCheck) {
          return res.status(400).send({ status: false, msg: "title already exist" })
        }
    
        let ISBNCheck = await bookmodel.findOne({ ISBN: ISBN }) 
        if (ISBNCheck) {       
          return res.status(400).send({ status: false, msg: "ISBN already exist" })
        }


        let createBook = await bookmodel.create(requestBody)
        return res.status(201).send({ status: true, msg: "Book sucessfully Created", data: createBook })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
}
module.exports = { createBook }