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

app.use(express.json());
app.use(cors());
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
const uri = `mongodb+srv://binderapp1:${databaseAuthorization}@test.ws3nz.mongodb.net/Shipping?retryWrites=true&w=majority`;
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
const formSchema = new mongoose.Schema({
  county: String,
  elseName: String,
  elseEmail: String,
  elsePhone: Number,
  name: String,
  dob: String,
  email: String,
  phone: Number,
  address: String,
  size: String,
  length: String,
  color: String,
});
// admin schema
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = new mongoose.model("admins", adminSchema);

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

app.post("/login", async (req, res, next) => {
  // store req.body for user object
  let userObj = req.body;
  console.log(userObj)
  // find user using the stored value
  await Admin.findOne(userObj).then((user) => {
    console.log(user)
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
      res.redirect("/display");
      // if user exists and passwords don't match or they try to visit route with no token
    } else {
      // set authorization cookie to null
      res.cookie("auth", null);
      // send status authorization denied
      res.status(401).send("authorization denied");
    }
  });
});

const FormInput = mongoose.model("readytoships", formSchema);

const binderSchema = new mongoose.Schema({
  size: String,
  length: String,
  color: String,
});
const BinderInventory = mongoose.model(`inventorys`, binderSchema);

const ProcessedInventory = mongoose.model('processedinventorys', binderSchema)


const waitListed = mongoose.model('waitListeds', formSchema)

// app.post("/binders", async (req, res) => {
//   let newEntry = Binders({
//     size: req.body.size,
//   });
//   await newEntry.save();
//   res.redirect("/send_mail");
// });

app.post("/", async (req, res) => {
  console.log(`I am the post`);
  let binderInventory = await BinderInventory.find({
    size: { $in: [req.body.size] },
  });
  if (binderInventory.length === 0) {
    console.log(`No binders in that size`);
    res.redirect("/");
  } else {
    let newEntry = FormInput({
      county: req.body.resMaine,
      elseName: req.body.elseName,
      elseEmail: req.body.elseEmail,
      elsePhone: req.body.elsePhone,
      name: req.body.name,
      dob: req.body.dob,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      size: req.body.size,
      length: req.body.length,
      color: req.body.color,
    });
    await newEntry.save();
    res.redirect("/");
  }
});

BinderInventory.watch().on("change", change => {
  if (change.operationType === "delete") {
    return;
  }

  else {
    let size = change.fullDocument.size
    waitListed.findOne({ size: size })
      .then(async function (doc) {
        console.log(doc)

        if (doc === null) {
          return;
        }

        else {
          //readytoship
          FormInput.insertMany([doc])
            .then(doc => {
              console.log("New Entry Saved");
            })
            .catch(error => {
              console.log(error);
            })

          await waitListed.deleteOne({ size: doc.size })

          await ProcessedInventory.insertMany([change.fullDocument])

          await BinderInventory.deleteOne({ size: change.fullDocument.size })
        }
      })




  }
})

app.post("/send_mail", async (req, res) => {
  console.log(req.body);
  let { emailSelf, elseEmail, numberSelf, numberElse, addressSelf, size } = req.body;
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  console.log(req.body)
  if (req.body.emailSelf) {
    console.log(req.body.size)
    console.log(req.body.emailSelf)
    let binderInventory = await BinderInventory.find({
      size: req.body.size.trim()
    });
    console.log(binderInventory)
    if (binderInventory.length === 0) {
      let newEntry = waitListed({
        county: req.body.resMaine,
        name: req.body.name,
        dob: req.body.dob,
        email: req.body.emailSelf,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.length,
        color: req.body.color
      });
      await newEntry.save();
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        to: emailSelf,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <h2>We apologize for the inconvenience, but your item is not currently in stock. You have been added to the waitlist.</h2>
            <p>All the best, Shadman</p>
             </div>
        `,
      });
    }

    else if (binderInventory.length > 0) {
      let newEntry = FormInput({
        county: req.body.resMaine,
        name: req.body.name,
        dob: req.body.dob,
        email: req.body.emailSelf,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.length,
        color: req.body.color
      });

      await newEntry.save();

      BinderInventory.findOne({ size: req.body.size })
        .then(doc => {
          console.log(doc);

          // Inserting the doc in the destination collection
          ProcessedInventory.insertMany([doc])
            .then(d => {
              console.log("New Entry Saved");
            })
            .catch(error => {
              console.log(error);
            })

          // Removing doc from the first collection
          BinderInventory.deleteOne({ size: doc.size })
            .then(d => {
              console.log("Removed Old Entry")
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        })

      await transport.sendMail({
        from: process.env.GMAIL_USER,
        to: emailSelf,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <h2>Please verify that the information below is correct!</h2>
            <p><strong>Email:</strong> ${emailSelf}</p>
            <p><strong>Phone number:</strong> ${numberSelf}</p>
            <p><strong>Address:</strong> ${addressSelf}</p>
   
            <p>All the best, Shadman</p>
             </div >
          
        `,
      })
      res.redirect("/");

    }

  }

  else if (req.body.elseEmail) {
    let binderInventory = await BinderInventory.find({
      size: req.body.size.trim()
    });

    if (binderInventory.length === 0) {
      let newEntry = waitListed({
        county: req.body.resMaine,
        elseName: req.body.elseName,
        elseEmail: req.body.elseEmail,
        elsePhone: req.body.numberElse,
        dob: req.body.dob,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.length,
        color: req.body.color
      });
      await newEntry.save();
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        to: elseEmail,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <h2>We apologize for the inconvenience, but your item is not currently in stock. You have been added to the waitlist.</h2>
            <p>All the best, Shadman</p>
             </div>
        `,
      });
    }

    else if (binderInventory.length > 0) {
      let newEntry = FormInput({
        county: req.body.resMaine,
        elseName: req.body.elseName,
        elseEmail: req.body.elseEmail,
        elsePhone: req.body.numberElse,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.length,
        color: req.body.color
      });

      await newEntry.save();

      BinderInventory.findOne({ size: req.body.size })
        .then(doc => {
          console.log(doc);

          // Inserting the doc in the destination collection
          ProcessedInventory.insertMany([doc])
            .then(d => {
              console.log("New Entry Saved");
            })
            .catch(error => {
              console.log(error);
            })

          // Removing doc from the first collection
          BinderInventory.deleteOne({ size: doc.size })
            .then(d => {
              console.log("Removed Old Entry")
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        })
      res.redirect("/");
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        to: elseEmail,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <h2>Please verify that the information below is correct!</h2>
            <p><strong>Email:</strong> ${elseEmail}</p>
            <p><strong>Phone number:</strong> ${numberElse}</p>
            <p><strong>Address:</strong> ${addressSelf}</p>
  
            <p>All the best, Shadman</p>
             </div >
          
        `,
      });


    }

  }
});
//app.get for the fetch request
app.get("/inventory", async (req, res) => {
  //send the inventory, right now just called email test
  let allInventory = await BinderInventory.find({});

  res.send(allInventory);
});
app.get("/requests", async (req, res) => {
  console.log(`request get`)
  let allRequests = await FormInput.find({});
  console.log(allRequests)
  res.send(allRequests);
});
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});


