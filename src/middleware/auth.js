const jwt = require("jsonwebtoken");


//--------------------------------- AUTHENTICATION MIDDLEWARE ------------------------------------------------------------------------

const checkAuth = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-api-key"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "Token must be Present" });
    console.log(token);

    let decodedToken = jwt.verify(token, "functionup-radon-project3-group52");

    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "Please Provide a Valid Token" });

    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};



module.exports={checkAuth}