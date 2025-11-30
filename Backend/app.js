//pass = U0sEzp1uvQUKg0A3
const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Middleware
app.use("/", (req, res, next) => {
    res.send("It is working");
})

mongoose.connect("mongodb+srv://admin:U0sEzp1uvQUKg0A3@senevirathnedb.x2gzt9j.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log((err)));