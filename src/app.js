const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation") 
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json()); 
app.use(cookieParser()); 

// DB 

connectDB()
.then( () => {
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){

            // JWT Token Creation
            const token = await jwt.sign({ _id: user?.id }, "DevTinder@2025");
            console.log(token);
            // Add token to the cookie and send response back to the user
            res.cookie("token", token);
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

app.get("/profile", async (req, res) => {
    try{
        const cookies = req.cookies;
        const { token } = cookies
        // Validate Token
        if(!token){
            throw new Error("Invalid Token")
        }
        const decodedMsg = await jwt.verify(token, "DevTinder@2025");
        const { _id } = decodedMsg;
        console.log("Logged in user is :" + _id);
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User Does Not Exit!")
        }        
        res.send(user)
    }
    catch (err){
        res.status(400).send("ERROR:" + err.message);
    }
})

// Feed API - get all the users form the database

app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({})
        if (users.length === 0) {
            res.send("No user found")
        } else {
            console.log(users);
            res.send(users)
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }

})

//user API to find the single user by by email

app.get("/user", async (req, res) => {
  //getting user from body
  const userEmail = req.body.emailId;
  try {
      const users = await User.findOne({ emailId: userEmail })
      if (users.length === 0) {
          res.status(400).send("User not found")
      } else {

          // console.log(users)
          res.send(users)
      }
  }
  catch (err) {
      res.status(400).send("Something went wrong")
  }
})

//delete user API - deleting a user by its id

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const users = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully")

    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// patch user API - updating the data of user

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
          "photoURL",
          "about",
          "gender",
          "skills",
          "firstName",
          "lastName",
          "age"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed")
        }
        if (data?.skills?.length > 10) {
            throw new Error("Only 10 Skills allowed")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "before", runValidators: "true" });
        console.log(user)
        res.send("User updated successfully")

    } catch (err) {
        res.status(400).send("Update Failes:" + err.message);
    }
})