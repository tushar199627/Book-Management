const express=require("express");

const router =express.Router();
const bookcontroller=require("../controller/bookcontroller");
const usercontroller=require("../controller/usercontroller");

<<<<<<< HEAD
// user
router.post("/register", usercontroller.createUser);
router.post("/login", usercontroller.userLogin);

//book
router.post("/books", bookcontroller.createBook);
=======
//===================================================[USER ROUTE HANDLER]===========================================================
router.post("/register", usercontroller.createUser)
router.post("/login", usercontroller.userLogin)
>>>>>>> a94ede3656f1b4419bb98713eaa5245328774dd0




module.exports=router;