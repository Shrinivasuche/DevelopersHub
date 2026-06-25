const mongoose = require('mongoose');


const connectDB = async() => {
    // console.log("DB_URL",process.env.DB_CONNECTION_URL);
    await mongoose.connect(process.env.DB_CONNECTION_URL)
    // console.log("MongoDB connected successfully");
}

module.exports = connectDB;

