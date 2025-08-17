const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        // extracting token from cookie
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("Please Login");
        }

        // decoding the token
        const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedData;

        // checking if user exist in the database
        const user = await User.findById(_id);
        if(!user){
            throw new Error("No user found");
        }

        req.user = user;
        next();
    } catch (error){
        res.status(404).send("ERROR : " + error.message)
    }
}

module.exports = {
    userAuth,
}