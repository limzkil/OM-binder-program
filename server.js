require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy } = require("passport-jwt");
const app = express();

//setting up default port
const port = process.env.PORT || 5000;
// MIDDLEWARE
//Binding our server to a static directory
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

//setting up mongo connection
const databaseAuthorization = process.env.SECRET;
console.log(databaseAuthorization);
//set up path for connection, using .env for the password
const uri = `mongodb+srv://binderapp1:${databaseAuthorization}@test.ws3nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//connect to the db
mongoose.connect(
  uri,
  {
    useNewURLParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose is connected.");
  }
);

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

// function to extract jwt token for authorization
function extractJwt(req) {
  let token = null;
  // if there is a req and a cookie named auth
  if (req && req.cookies.auth) {
    token = req.cookies.auth;
  }

  return token;
}
// options object for strategy
let options = {
  jwtFromRequest: extractJwt,
  secretOrKey: process.env.KEY,
};
// defining strategy we are using
passport.use(
  new Strategy(options, (authToken, done) => {
    // search db for user by comparing _id to authToken.sub
    Admin.findOne({ _id: authToken.sub }, (err, resp) => {
      if (err) {
        throw err;
      }
      // if no error but also no user
      if (!resp) {
        resp.send("Username or password incorrect");
      } else {
        // if everything passes, send back user found
        return done(null, resp);
      }
    });
  })
);

// function to create a jwt give na user object
function issueJwt(user) {
  let newToken = {
    // storing identifier in jwt using user id
    sub: user._id,
    // issued at
    iat: Date.now(),
  };
  // sign jwt to encrypt using a secret
  let signedJwt = jwt.sign(newToken, process.env.KEY, { expiresIn: "8h" });
  // return object to be used for authentication
  return {
    token: signedJwt,
    expires: "8h",
  };
}

app.post("/", async (req, res) => {
  console.log(`Hel2l5552oz`);
  console.log(req.body.email);
  let newEntry = emailTest({
    email: req.body.email,
  });
  await newEntry.save();
  res.redirect("/");
});

app.post("/admin/login", async (req, res, next) => {
  // store req.body for user object
  let userObj = req.body;
  // find user using the stored value
  await Admin.findOne(userObj).then((user) => {
    // if no user
    if (!user) {
      // set authorization cookie to null
      res.cookie("auth", null);
      // send message for failure to authenticate
      res.json({ success: false, msg: "no user exists" });
      // if the user password matches database
    } else if (userObj.password === user.password) {
      // make new token based in function created earlier
      let userToken = issueJwt(user);
      // set cookie for authorization for 8hrs so dont have to sign in every time for a single work day
      res.cookie("auth", userToken.token);
      // then redirect to dashboard
      res.redirect("/admin/dashboard");
      // if user exists and passwords don't match or they try to visit route with no token
    } else {
      // set authorization cookie to null
      res.cookie("auth", null);
      // send status authorization denied
      res.status(401).send("authorization denied");
    }
  });
});
// get route for authenticating the dashboard via passport jwt strategy
app.get(
  "/admin/dashboard",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    res.redirect("/admin/dashboard");
  })
);

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
