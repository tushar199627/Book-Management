const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const app=express();
const route=require("./routes/route.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 mongoose.connect("mongodb+srv://tusharbarai1:Tb88774411@cluster0.3hlrc.mongodb.net/BookManagement", {
    useNewUrlParser: true
})
 .then(()=>console.log("MongoDB Connected"))
 .catch((error)=>console.log(error))

 app.use('/',route);

 app.listen(process.env.PORT || 3000, function() {
    console.log("Express app is running on port "+(process.env.PORT||3000))

 });