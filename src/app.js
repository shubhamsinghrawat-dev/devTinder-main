const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation") 
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")

// Middleware
app.use(express.json()); 
app.use(cookieParser()); 

// DB 

connectDB().then( () => {
    console.log("Connected");
    app.listen(port, () => {
      console.log(` app listening on port ${port}`);
    });
})
.catch( (err) => {
    console.error("Database Can not connected!")
});


// signup API

app.post("/signup", async (req, res) => {
    // Validation of data
    validateSignUpData(req);
    const {firstName, lastName, emailId, gender, age, password} = req.body;
    // Encrypt the pass
    const passwordHash = await bcrypt.hash(password, 10)

    //   New instance of user model
    const user = new User({
        firstName,
        lastName, 
        emailId,
        gender, 
        age,
        password:passwordHash
    });

    try{
        await user.save();
        res.send("Added...!");
    }
    catch (err){
        res.status(400).send("ERROR:" + err.message);
    }
})

// Login API

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credintial");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // JWT Token Creation
            const token = await user.getJWT();
            // Add token to the cookie and send response back to the user
            res.cookie("token", token, {expires:new Date(Date.now() + 8 *3600000)});
            res.send("Login Succsessful!");
        } else{
            throw new Error("Invalid Credintial")
        }
    }
    catch (err){
        res.status(400).send("ERROR:" + err.message);
    }
})

// Profile 

app.get("/profile", userAuth,  async (req, res) => {
    try{
        const user = req.user;   
        res.send(user)
    }
    catch (err){
        res.status(400).send("ERROR:" + err.message);
    }
})


// Send Connection

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending Connection Request");
    res.send(user.firstName + " " +"sent a connection Request !");
} )