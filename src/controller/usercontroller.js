const jwt = require("jsonwebtoken");
const usermodel = require("../model/usermodel");


//login user
let userlogin = async function (req, res) {
    try {
        let email = req.boy.email;
        let password = req.body.password;

        // validation

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email Should be a Valid Email Address` });
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            return res.status(400).send({ status: false, message: `Password should contain atleast one number or one alphabet and should be 8 character long` });
        }

        //validation end

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
            iat: new Date().getTime()
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