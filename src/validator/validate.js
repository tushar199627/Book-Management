let isValid= function(value){
    if(typeof value === "undefined" || value === "null") return false;
    if(typeof value === "string" && value.trim().length === 0) return false;
    if(typeof value === "object") return false;
    return true;
};

let isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length != 0;
};



module.export= {isValid, isValidRequestBody}