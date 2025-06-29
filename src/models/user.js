const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

userSchema.methods.getJWT = async function () {
    const user = this;
    // JWT Token Creation
    const token = await jwt.sign({ _id: user?.id }, "DevTinder@2025", {expiresIn:"3h"});
    return token;
}

userSchema.methods.validatePassword =  async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;