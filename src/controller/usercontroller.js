const jwt = require("jsonwebtoken");
const usermodel = require("../model/usermodel");
const { isValid, isValidRequestBody, validEmail, validPassword,validName, validPhone } = require("../validator/validate")


//create user
let createUser = async function (req, res) {
    try {
        let requestBody = req.body
        let { title, name, phone, email, password, address } = requestBody

        if (isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "Please provide the Details" });
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please provide a Title or a Valid title" });
        }
        if(title !="Mr" && title !="Miss" && title !="Mrs"){
            return res.status(400).send({ status: false, msg: "Title should be Mr, Miss, Mrs" });
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: "Please provide a Name or a Valid Name" });
        }

        if (!validName.test(name)) {
            return res.status(400).send({ status: false, msg: "Name cannot be a number" });
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, msg: "Please provide a Phone Number or a Valid Phone Number" });
        }

        if (!validPhone.test(phone)) {
            return res.status(400).send({ status: false, msg: `${phone} is not valid` });
        }
        let isAllreadyExistPhone = await usermodel.findOne({ phone: phone})
        if (isAllreadyExistPhone) {
            return res.status(400).send({ status: false, msg: `${phone} already exist` });
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Please provide a Phone Number or a Valid Phone Number" });
        }

        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, msg: `${email} is not valid` });
        }

        let isAllreadyExistEmail = await usermodel.findOne({ email: email})
        if (isAllreadyExistEmail) {
            return res.status(400).send({ status: false, msg: `${email} already exist` });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "Please provide a Password or a Valid Password" });
        }

        if (!validPassword.test(password)) {
            return res.status(400).send({ status: false, msg: "Password is not Valid" });
        }

        if (typeof address != 'object') {
            return res.status(400).send({ status: false, msg: "Please provide a address And address should be an object" });
        }
        if(!isValid(address.street)){
            return res.status(400).send({ status: false, msg: "Street should be Present" });
        }
        if(!isValid(address.city)){
            return res.status(400).send({ status: false, msg: "City should be Present" });
        }
        if(!isValid(address.pincode)){
            return res.status(400).send({ status: false, msg: "Pincode should be Present" });
        }

        let createUser= await usermodel.create(requestBody)
            return res.status(201).send({status:true, msg: "User Created" ,data: createUser })
    }catch(error){
       return res.status(500).send({status:false, msg: error.message});
    }

}




//login user
let userLogin = async function (req, res) {
    try {
        let requestBody = req.body;
        let { email, password } = requestBody;

        if (isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: `Please Provide your Email and Password` });
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` });
        }

        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, message: `Email Should be a Valid Email Address` });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` });
        }

        if (!(validPassword).test(password)) {
            return res.status(400).send({ status: false, message: `Password should be Minimum 8 character and Maximum 15 character long and should be Alpha-Numeric` });
        }


        let user = await usermodel.findOne({ email: email, password: password });
        if (!user)
            return res.status(400).send({
                status: false,
                msg: "Invalid Email or Password",
            });
        let token = jwt.sign({
            userId: user._id.toString(),
            batch: "radon",
            organisation: "FunctionUp",
            iat: new Date().getTime()/1000
        },
            "functionup-radon-project3-group52",
            {
                expiresIn: "2h"
            });

        res.setHeader("x-api-key", token);

        return res.status(200).send({ status: true, token: token, msg: "User Logged in Successfully" });


    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
}

module.exports = { userLogin, createUser }