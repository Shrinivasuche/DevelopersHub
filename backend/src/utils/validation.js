const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    } 
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    } 
    else if(!validator.isStrongPassword(password)){
        throw  new Error("Enter a strong password")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditField = ["firstName", "lastName", "age", "gender", "email", "about", "skills", "photoUrl"];

    const isAllowed = Object.keys(req.body).every((field) => allowedEditField.includes(field))
    return isAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}