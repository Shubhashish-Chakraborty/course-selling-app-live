require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");

const { userRouter } = require('./routes/user');
const { adminRouter } = require('./routes/admin');

const app = express();

app.use(express.json());

app.use('/api/v1/user' , userRouter);
app.use('/api/v1/admin' , adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL); // FIRST ESTABLISH A CONNECTION TO THE DATABASE!
    app.listen(process.env.PORT);
    console.log("You're successfully connected to the database!, GOOD TO GO!!");
}

main();