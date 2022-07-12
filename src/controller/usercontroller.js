const jwt = require("jsonwebtoken");
const usermodel = require("../model/usermodel");
const {isValid, isValidRequestBody, validPassword, validCity, validPincode, validName, validPhone, validEmail,
} = require("../validator/validate");

//================================================CREATE USER===========================================================================//

let createUser = async function (req, res) {
  try {
    let requestBody = req.body; //getting data from request body
    let { title, name, phone, email, password, address } = requestBody; //Destructuring data coming from request body

    if (isValidRequestBody(requestBody)) {
      //validating is there any data inside request body
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the Details" });
    }

    //here performing validation for data
    if (!isValid(title)) {
<<<<<<< HEAD
      return res
        .status(400)
        .send({status: false, msg: "Please provide a Title or a Valid title", });
=======
      return res.status(400).send({
        status: false,
        msg: "Please provide a Title or a Valid title",
      });
>>>>>>> cfd98f73f30dc0381fc7e2acdf37e9b918f4db2a
    }
    if (title != "Mr" && title != "Miss" && title != "Mrs") {
      return res
        .status(400)
        .send({ status: false, msg: "Title should be Mr, Miss, Mrs" });
    }

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide a Name or a Valid Name" });
    }

    if (!validName.test(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "Name cannot be a number" });
    }

    if (!isValid(phone)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide a Phone Number or a Valid Phone Number",
      });
    }

    if (!validPhone.test(phone)) {
      return res.status(400).send({
        status: false,
        msg: `this phone number-${phone} is not valid, try an Indian Number`,
      });
    }

    //checking is there same phone number present inside database or not
    let isAllreadyExistPhone = await usermodel.findOne({ phone: phone });
    if (isAllreadyExistPhone) {
      return res.status(400).send({
        status: false,
        msg: ` this phone number- ${phone} already exist`,
      });
    }

    if (!isValid(email)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide a Email d or a Valid Email Id",
      });
    }

    if (!validEmail.test(email)) {
      return res
        .status(400)
        .send({ status: false, msg: `${email} is not valid email Id` });
    }

    //checking is there same Email Id present inside database or not
    let isAllreadyExistEmail = await usermodel.findOne({ email: email });
    if (isAllreadyExistEmail) {
      return res
        .status(400)
        .send({ status: false, msg: `this email id -${email} already exist` });
    }

    if (!isValid(password)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide a Password or a Valid Password",
      });
    }

    if (!validPassword(password)) {
      return res.status(400).send({
        status: false,
        msg: "Password Should be Minimum 8 Character and Maximum 15 Character Long",
      });
    }

    if (typeof address != "object") {
      return res.status(400).send({
        status: false,
        msg: "Please provide a address And address should be an object",
      });
    }

    if (!isValid(address.street)) {
      return res
        .status(400)
        .send({ status: false, msg: "Street should be Present" });
    }

    if (!isValid(address.city)) {
      return res.status(400).send({
        status: false,
        msg: "City should be Present or City should be Valid",
      });
    }

    if (!validCity.test(address.city)) {
      return res
        .status(400)
        .send({ status: false, msg: "City cannot be Number" });
    }

    if (!isValid(address.pincode)) {
      return res
        .status(400)
        .send({ status: false, msg: "Pincode should be Present" });
    }

    if (!validPincode.test(address.pincode)) {
      return res.status(400).send({
        status: false,
        msg: "Please enter a valid Pincode, it should not be alpabetic and should be 6 digit long",
      });
    } //validation ended here

    //after clearing all the validation document will be created
    let createUser = await usermodel.create(requestBody);
    return res
      .status(201)
      .send({ status: true, msg: "User Created", data: createUser }); //sending data in response
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//================================================LOGIN USER===========================================================================//

let userLogin = async function (req, res) {
  try {
    let requestBody = req.body; //getting data from request body
    let { email, password } = requestBody; //Destructuring data coming from request body

    if (isValidRequestBody(requestBody)) {
      //validating is there any data inside request body
      return res.status(400).send({
        status: false,
        message: `Please Provide your Email and Password`,
      });
    }

    //here performing validation for data
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }

    if (!validEmail.test(email)) {
      return res.status(400).send({
        status: false,
        message: `Email Should be a Valid Email Address`,
      });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: `Password is required` });
    }

    if (!validPassword(password)) {
      return res.status(400).send({
        status: false,
        msg: "Password Should be Minimum 8 Character and Maximum 15 Character Long",
      });
    } //validation ended here

    //after clearing all the validation user will be fetched from the DB
    let user = await usermodel.findOne({ email: email, password: password });
    if (!user)
      return res.status(400).send({
        status: false,
        msg: "Invalid Email or Password",
      });

    // here i m creating the token
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "radon",
        organisation: "FunctionUp",
        iat: Date.now() / 1000, //here we will get the issued time of token
      },
      "functionup-radon-project3-group52",
      {
        expiresIn: Math.floor(Date.now() / 1000) + 10 * 60 * 60, //here the token is valid for only 2 hour after 2 hour token will get expire
      }
    );

    res.setHeader("x-api-key", token);

    //after token created successfully then token will be provided in the response body
    return res
      .status(200)
      .send({ status: true, token: token, msg: "User Logged in Successfully" }); //sending data in response
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = { userLogin, createUser };
