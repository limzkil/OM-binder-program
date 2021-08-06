require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();

//setting up default port
const port = process.env.PORT || 5000;
// MIDDLEWARE
//Binding our server to a static directory
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());

//setting up mongo connection
const databaseAuthorization = process.env.SECRET;
console.log(databaseAuthorization);
//set up path for connection, using .env for the password
const uri = `mongodb+srv://binderapp1:${databaseAuthorization}@test.ws3nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//connect to the db
mongoose.connect(uri, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});


//var to refer to the database
const db = mongoose.connection;
//set up a schema to test
const testSchema = new mongoose.Schema({
  email: String,
});
const emailTest = mongoose.model("Email-Test", testSchema);
// admin schema
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = new mongoose.model("Admin", adminSchema);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, user) {
    done(err, user);
  });
});

// define passport local strategy
passport.use(
  new LocalStrategy(
    // function for verifying user
    function(username, password, done) {
      // search db to find admin credentials
      Admin.findOne({ username: username }, function (err, user) {
        // if there is an error while retrieving
        if (err) {
          return done(err);
        }
        // if user is not found in db
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        // if the passwords don't match
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        // if no errors, return user
        return done(null, user);
      });
    }
  )
);
// post for admin login
app.post(
  "/admin/login",
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);

app.post("/", async (req, res) => {
  console.log(`Hel2l5552oz`);
  console.log(req.body.email);
  let newEntry = emailTest({
    email: req.body.email,
  });
  await newEntry.save();
  res.redirect("/");
});



app.post("/send_mail", async (req, res) => {
  let { email, number, address } = req.body;
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "test email",
    html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>Please verify that the information below is correct!</h2>
        <p><strong>Email:</strong> ${email}</p>
		<p><strong>Phone number:</strong> ${number}</p>
		<p><strong>Address:</strong> ${address}</p>
    
        <p>All the best, Shadman</p>
         </div>
    `,
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
