const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {

    try {
        // checking validation of given data
        console.log("Validating signup data ...");

        validateSignUpData(req);

        const { firstName, lastName, email, password } = req.body;

        console.log("Signup Requesr Body", req.body);
        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        const savedUser = await user.save();
        
        const token = await savedUser.getJWT();
            
        // add token to cookie and send the response back to user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,

            // temporary later fix  
            // secure: true,
            // sameSite: "none"

            secure: false,
            sameSite: "lax"
        });
        
        res.json({
            message: "User Added Successfully!!",
            data: savedUser
        });


    } catch (error) {
        console.error("Signup Error:" , error);
        res.status(400).send("Error : " + error.message );
    }
});

authRouter.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email});

        if(!user) {
            throw new Error("Email ID is not valid");
        }
        
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            // creating a jwt token
            const token = await user.getJWT();
            
            // add token to cookie and send the response back to user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            res.send(user);

        } else {
            throw new Error("password is not correct")
        }
        
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send("Logout successfull!!")
})

module.exports = authRouter; 