const jwt = require("jsonwebtoken");
const usermodel = require("../model/usermodel");


//login user
let userlogin = async function (req, res) {
    try {
        let email = req.boy.email;
        let password = req.body.password;

        // validation

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            return res.status(400).send({ status: false, message: `password should contain atleastone number or one alphabet and should be 8 character long` });
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
        }, "stack", { expiresIn: "10h" },
            "functionup-radon-group52"
        )

        res.setHeader("x-api-key", token);

        return res.status(200).send({ status: true, token: token, msg: "user logged in successfully" });


    }



    catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
}
