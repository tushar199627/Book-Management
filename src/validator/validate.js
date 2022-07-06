let isValid= function(value){
    if(typeof value === "undefined" || value === "null") return false;
    if(typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

let isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length != 0;
};

let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let validPassword = /(?i)^(?=[a-z])(?=.*[0-9])([a-z0-9!@#$%\^&*()_?+\-=]){8,15}$/;
let validName = /^[ a-z ]+$/i;;
let validPhone = /^[6-9]\d{9}$/;




module.exports= {isValid, isValidRequestBody, validEmail, validPassword, validName, validPhone}