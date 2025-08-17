const mongoose = require('mongoose');


const connectDB = async() => {
    await mongoose.connect(process.env.DB_CONNECTION_URL)
    // console.log(process.env.DB_CONNECTION_URL);
}

module.exports = connectDB;

