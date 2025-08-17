const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();
require("dotenv").config();

app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.get("/", (req, res) => {
    res.send("Server is running")
})
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
    console.log("Database connected successfully!!");
    app.listen(process.env.PORT, () => {
    console.log("server is running on port 3000");
    })
}).catch((err) => {
    console.log("Database cannot be connected");
});

