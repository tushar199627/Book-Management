const mongoose = require("mongoose");

let isValid = function (value) {
  if (typeof value === "undefined" || value === "null") return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

let isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length === 0;
};

let validEmail = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/;

let validPassword = function (value) {
  if (value.length >= 8 && value.length <= 15) return true;
};
let validExcerpt=/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validRating = function (value) {
  if (value >= 1 && value <= 5) return true;
};
let validCity = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPincode = /^[1-9][0-9]{5}$/;
let validName = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPhone = /^[6-9]\d{9}$/;

let validString = /^[ a-z ]+$/i;
//validation for isbn


let releasedDate=/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
let validISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
//validation for user id

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports = {
  isValid,
  validRating,
  isValidRequestBody,
  isValidObjectId,
  validEmail,
  validPassword,
  validCity,
  validISBN,
  validString,
  validPincode,
  validName,
  validPhone,
  releasedDate,
  validExcerpt
};
