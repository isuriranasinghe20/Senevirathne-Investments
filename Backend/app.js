//pass = U0sEzp1uvQUKg0A3
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./Routes/UserRoutes');

//loads whats inside on .env file
dotenv.config();
const app = express();

//Middleware
app.use(express.json());          
app.use(express.urlencoded({ extended: true }));
app.use("/users", router);


//link to connect backend with mongoDB
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log((err)));