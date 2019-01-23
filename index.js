const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("./models/form");

const app = express();
const router = express.Router();

//CORS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//DB configuration
const db = require("./config/key").mongoURL;
const option = { useNewUrlParser: true };

//Connect to MOngoDB
mongoose
  .connect(
    db,
    option
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(err => {
    console.log(err);
  });

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use("/api", (req, res, next) => res.json("hello"));
app.get("/api", (req, res) => res.json("hello n"));

//Routes
app.post("/api/form", (req, res) => {
  const user = {};
  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.mobile) user.mobile = req.body.mobile;
  if (req.body.gender) user.gender = req.body.gender;
  if (req.body.member) user.member = req.body.member;
  console.log(user);
  // Check Email exists
  User.findOne({ email: user.email })
    .then(user => {
      if (user) {
        return res.status(302).json({ email: "Email already exists" });
      } else {
      }
    })
    .catch(err => {
      return res.status(404).send(err);
    });

  //Create New user
  new User(user)
    .save()
    .then(user => {
      res.json(user);
    })
    .catch(err => res.status(400).send(err));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
