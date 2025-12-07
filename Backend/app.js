//pass = U0sEzp1uvQUKg0A3
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//loads whats inside on .env file
dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
//Middleware
app.use(express.json());          
app.use(express.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));
// Route modules (require before using)
const router = require("./Routes/UserRoutes");
const activityRoutes = require("./Routes/activityRoutes");
const ClosedActivityRoutes = require("./Routes/ClosedActivityRoutes");

app.use("/users", router);

// Global error handler (for debugging)
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
});

//link to connect backend with mongoDB
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log((err)));

//Register.............
//call Register Model
require("./Model/Register");
const User = mongoose.model("Register");
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try{
        await User.create({ 
            username,
            email, 
            password 
        });
        res.send({status: "ok"});
    }catch (err){
        res.send({status: "error"});
    }
});

//Login..............
app.post("/login", async (req, res) => {
    const { identifier, password } = req.body;

    try{
        // Search by email OR username
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if(!user){
            return res.json({ err: "User Not Found" });
        }

        if(user.password === password){
            return res.json({ status: "ok" });
        } else {
            return res.json({ err: "Incorrect Password" });
        }

    }catch(err){
        console.error(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
});