const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");
const app=express();
const route=require("./routes/route.js");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

 mongoose.connect("mongodb+srv://Rak1800:Rakesh123@@cluster0.xntrj.mongodb.net/project3-group-52", {
    useNewUrlParser: true
})
 .then(()=>console.log("mongodb Conneted"))
 .catch((error)=>console.log(error))

 app.use('/',route);

 app.listen(process.env.PORT || 3000, function() {
    console.log("Express app is running on port "+(process.env.PORT||3000))

 });