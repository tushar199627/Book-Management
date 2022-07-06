let isValid= function(value){
    if(typeof value === "undefined" || value === "null") return false;
    if(typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

let isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length === 0;
};

let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
;
let validName = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
let validPhone = /^[6-9]\d{9}$/;




module.exports= {isValid, isValidRequestBody, validEmail, validPassword, validName, validPhone}