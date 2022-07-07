let isValid= function(value){
    if(typeof value === "undefined" || value === "null") return false;
    if(typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

let isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length === 0;
};

let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let validPassword = function(value){
    if((value.length>=8 && value.length <=15))
    return true
}
let validCity=/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPincode=/^[0-9]/;
let validName = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPhone = /^[6-9]\d{9}$/;




module.exports= {isValid, isValidRequestBody, validEmail, validPassword,validCity, validPincode, validName, validPhone}

