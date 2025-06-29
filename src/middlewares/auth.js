const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    // Read the token from the req cookies
    try {
        const { token } = req.cookies;
        const decodedObj = await jwt.verify(token, "DevTinder@2025")
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
}

    // validate the token
    // Find the User

module.exports = { userAuth }