const express=require("express");
const router =express.Router();
const bookcontroller=require("../controller/bookcontroller");
const usercontroller=require("../controller/usercontroller");

// user
router.post("/register", usercontroller.createUser)
router.post("/login", usercontroller.userLogin)






module.exports=router