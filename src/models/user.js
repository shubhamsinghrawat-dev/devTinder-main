const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLenght: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email :" + value)
            }
        }
    },
    about: {
        type: String,
        default: "Dev is in search for someone here"
    },
    password: { 
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password :" + value)
            }
        }
     },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        trim: true,
       validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Not a valid gender (Male , Female and other)")
            }
        }
    },
    photoUrl: { 
        type: String ,
        validate(value) {
        if (!validator.isURL(value)) {
            throw new Error("Invalid URL :" + value)
        }
    }
    },
    skills: {
        type: [String],
    }
},
{
timestamps: true
}
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;