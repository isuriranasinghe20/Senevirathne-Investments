//pass = U0sEzp1uvQUKg0A3
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

//loads whats inside on .env file
dotenv.config();
const app = express();

//Middleware
app.use("/", (req, res, next) => {
    res.send("It is working");
})

//link to connect backend with mongoDB
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log((err)));