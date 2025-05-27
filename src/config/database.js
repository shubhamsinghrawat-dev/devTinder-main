const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://shubhrawat444:imDcOQtYFHmSyobZ@namastenode.sklxmw7.mongodb.net/devTinder"
    );
};

module.exports = connectDB;
