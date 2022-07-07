const mongoose = require('mongoose')
let isValid= function(value){
    if(typeof value === "undefined" || value === "null") return false;
    if(typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

let isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length === 0;
};

let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let validPassword = function(value){
    if((value.length>=8 && value.length <=15))
    return true
}
let validCity=/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPincode=/^[0-9]/;
let validName = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPhone = /^[6-9]\d{9}$/;

//validation for isbn
//let validISBN=/(-1(?:(0)|3))?:?\x20+(?(1)(?(2)(?:(?=.{13}$)\d{1,5}([ -])\d{1,7}\3\d{1,6}\3(?:\d|x)$)|(?:(?=.{17}$)97(?:8|9)([ -])\d{1,5}\4\d{1,7}\4\d{1,6}\4\d$))|(?(.{13}$)(?:\d{1,5}([ -])\d{1,7}\5\d{1,6}\5(?:\d|x)$)|(?:(?=.{17}$)97(?:8|9)([ -])\d{1,5}\6\d{1,7}\6\d{1,6}\6\d$)))/;
let validISBN=/(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)/;
//validation for user id 

const isValidObjectId = function(objectId) {             
    return mongoose.Types.ObjectId.isValid(objectId)
  }
  



module.exports= {isValid, isValidRequestBody, validEmail, validPassword,validCity, validPincode, validName, validPhone}
<<<<<<< HEAD

=======
>>>>>>> 5c4fae7f5177939e5156039f88e16c6c67f8674a
