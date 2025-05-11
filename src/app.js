const express = require("express");
const { adminAuth } = require("../middlewares/auth");

const app = express();
const port = 3000;


app.use("/admin", adminAuth);
app.use("/user", adminAuth);

app.post("/user/login", (req, res) => {
  res.send("User loggedin !");
});

app.get("/user/data", (req, res) => {
  res.send("User data sent..");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent..");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("data deleted..");
});


app.use("/", (err, req, res, next) => {
  if(err){
    res.status(500).send("Something went wrong")
  }
});

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
