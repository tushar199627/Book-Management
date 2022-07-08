const jwt = require("jsonwebtoken");
const bookmodel = require("../model/bookmodel");


//--------------------------------- AUTHENTICATION MIDDLEWARE ------------------------------------------------------------------------

const authentication = function (req, res, next) {
    try {
      let token = req.headers["x-api-key"];         
      if (!token) token = req.headers["X-api-key"];     
      if (!token) return res.status(400).send({ status: false, msg: "token must be present" });    
      console.log(token);
  
      let decodedToken = jwt.verify(token, "Book-Management");  
  
      if (!decodedToken)
        return res.status(401).send({ status: false, msg: "token is invalid" });
  
      req.loggedInUserId = decodedToken._id       

      next()                       
  
    } catch (error) {
      res.status(500).send({ status: false, Error: error.message })
    }
  
  
  
  };


  //--------------------------------- AUTHORISATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authorisation = async function (req, res, next) {

    try {
  
      let userToBeModified = req.params.bookId
  
      let book = await bookmodel.findById({ _id: userToBeModified })   

      if (book.userId != req.loggedInUserId) {     
        return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested data' })
      }
      next()
    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
  
  
  }
  
  
  module.exports.authentication = authentication
  module.exports.authorisation = authorisation