const jwt = require("jsonwebtoken");
const usermodel = require("../model/usermodel");
const {isValid, isValidRequestBody, validEmail, validPassword, validName, validPhone}= require("../validator/validate")







//login user
let userLogin = async function (req, res) {
    try {
        let email = req.boy.email;
        let password = req.body.password;
        
        if(!isValidRequestBody){
            return res.status(400).send({ status: false, message: `Please Provide your Email and Password` });
        }

        if(!isValid(email)){
            return res.status(400).send({ status: false, message: `Email is required` });
        }

        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, message: `Email Should be a Valid Email Address` });
        }

        if(!isValid(password)){
            return res.status(400).send({ status: false, message: `Password is required` });
        }

        if (!(validPassword).test(password)) {
            return res.status(400).send({ status: false, message: `Password should contain atleast one number or one alphabet and should be 8 character long` });
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
            iat: new Date()
        },
            "functionup-radon-group52",
            {
                expiresIn: "10h"
            });

        res.setHeader("x-api-key", token);

        return res.status(200).send({ status: true, token: token, msg: "User Logged in Successfully" });


    }catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
}

module.exports.userLogin=userLogin