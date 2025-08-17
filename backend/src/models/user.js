const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email address " + value)
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)) {
                    throw new Error("Enter a Strong Password " + value);
                }
            }
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value){
                if(!["male", "female", "others"].includes(value)){
                    throw new Error("Gender data is not valid")
                }
            },
        },
        photoUrl: {
            type: String,
            default: "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid photo URL " + value)
                }
            }
        },
        skills: {
            type: [String]
        },
        about: {
            type: String,
            default: "This is a default about of the user"
        }
    }, 
    {
        timestamps: true,
    }
);

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const hashPassword = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashPassword);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
