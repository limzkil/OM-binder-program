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

const Binder = require("./Binder");
const Create = require("./Schema");

//setting up default port
const port = process.env.PORT || 5000;
// MIDDLEWARE
//Binding our server to a static directory

app.use(express.json());
app.use(cors());
app.use(express.static("./build"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

//setting up mongo connection
const databaseAuthorization = process.env.SECRET;
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
  // find user using the stored value
  await Admin.findOne(userObj).then((user) => {
    // if no user
    if (!user) {
      // set authorization cookie to null
      res.cookie("auth", null);
      // send message for failure to authenticate
      //res.json({ success: false, msg: "no user exists" });
      res.redirect("/login");
      // if the user exists
    } else {
      // make new token based in function created earlier
      let userToken = issueJwt(user);
      // set cookie for authorization for 8hrs so dont have to sign in every time for a single work day
      res.cookie("auth", userToken.token);
      // then redirect to dashboard
      res.redirect("/display");
    }
  });
});

// Model for inventorys collection that uses the binderschema
const BinderInventory = mongoose.model(`inventorys`, Binder);

// Model for processedinventorys that uses the binderschema
const ProcessedInventory = mongoose.model("processedinventorys", Binder);

// Schema models for WaitList, Ready to Ship and Shipped collection. Uses the CreateSchema
const waitListed = mongoose.model("waitListeds", Create);

const FormInput = mongoose.model("readytoships", Create);

const Shipped = mongoose.model("shippeds", Create);

//Binder Inventory APIs
//GET Route for displaying information from Inventory Collection
app.get("/binders", async (req, res) => {
  let allInventory = await BinderInventory.find({});
  res.json(allInventory);
});

//POST Route for adding a new entry into the Inventory Collection
app.post("/binders/save", async (req, res) => {
  const binder = new BinderInventory({
    size: req.body.size,

    color: req.body.color,

    length: req.body.length,

    quantity: parseInt(req.body.quantity),
  });

  try {
    await binder.save();

    res.json(binder);
  } catch (err) {
    //displays an error message should the attempt to POST fail
    console.log("ERROR : " + res.json({ message: err }));
  }
});

//UPDATE route for making edits to pieces of collection entries. Only
app.patch("/binders/:binderIds", async (req, res) => {
  let id = req.params.binderIds;
  //runs MongoDB update function
  let update = await BinderInventory.updateOne(
    //sets target/filter to specific id
    { _id: id },
    //list of all possible items one can edit
    {
      size: req.body.size,
      color: req.body.color,
      length: req.body.length,
      quantity: parseInt(req.body.quantity),
    }
  );

  res.json(update);
});

app.delete("/binders/:binderIds", async (req, res) => {
  try {
    const deleteById = await BinderInventory.deleteOne({
      _id: req.params.binderIds,
    });

    res.json(deleteById);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

//readytoship API routes

app.get("/ready", async (req, res) => {
  let allRequests = await FormInput.find({});
  res.send(allRequests);
});

app.post("/ready/save", async (req, res) => {
  const ready = new FormInput({
    county: req.body.county,
    progSource: req.body.progSource,
    firstBind: req.body.firstBind,
    emailElse: req.body.emailElse,
    phoneElse: req.body.phoneElse,
    nameElse: req.body.nameElse,
    nameSelf: req.body.nameSelf,
    dob: req.body.dob,
    emailSelf: req.body.emailSelf,
    phoneSelf: req.body.phoneSelf,
    address: req.body.address,
    size: req.body.size,
    length: req.body.length,
    color: req.body.color,
    willWait: req.body.willWait,
    moreInfo: req.body.moreInfo,
    date: Date.now(),
  });

  try {
    await ready.save();

    res.json(ready);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

// UPDATE : by ID

app.patch("/ready/:readyIds", async (req, res) => {
  let id = req.params.readyIds;

  let update = await FormInput.updateOne(
    { _id: id },
    {
      county: req.body.county,
      progSource: req.body.progSource,
      firstBind: req.body.firstBind,
      emailElse: req.body.emailElse,
      phoneElse: req.body.phoneElse,
      nameElse: req.body.nameElse,
      nameSelf: req.body.nameSelf,
      dob: req.body.dob,
      emailSelf: req.body.emailSelf,
      phoneSelf: req.body.phoneSelf,
      address: req.body.address,
      size: req.body.size,
      length: req.body.length,
      color: req.body.color,
      willWait: req.body.willWait,
      moreInfo: req.body.moreInfo,
    }
  );

  res.json(update);
});

app.delete("/ready/:readyIds", async (req, res) => {
  try {
    const deleteById = await FormInput.deleteOne({ _id: req.params.readyIds });

    res.json(deleteById);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

app.get("/wait", async (req, res) => {
  let allRequests = await waitListed.find({});
  res.send(allRequests);
});

app.post("/wait/save", async (req, res) => {
  const ready = new waitListed({
    county: req.body.county,
    progSource: req.body.progSource,
    firstBind: req.body.firstBind,
    emailElse: req.body.emailElse,
    phoneElse: req.body.phoneElse,
    nameElse: req.body.nameElse,
    nameSelf: req.body.nameSelf,
    dob: req.body.dob,
    emailSelf: req.body.emailSelf,
    phoneSelf: req.body.phoneSelf,
    address: req.body.address,
    size: req.body.size,
    length: req.body.length,
    color: req.body.color,
    willWait: req.body.willWait,
    moreInfo: req.body.moreInfo,
    date: Date.now(),
  });

  try {
    await ready.save();

    res.json(ready);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

// UPDATE : by ID

app.patch("/wait/:waitIds", async (req, res) => {
  let id = req.params.waitIds;

  const update = await waitListed.updateOne(
    { _id: id },
    {
      county: req.body.county,
      progSource: req.body.progSource,
      firstBind: req.body.firstBind,
      emailElse: req.body.emailElse,
      phoneElse: req.body.phoneElse,
      nameElse: req.body.nameElse,
      nameSelf: req.body.nameSelf,
      dob: req.body.dob,
      emailSelf: req.body.emailSelf,
      phoneSelf: req.body.phoneSelf,
      address: req.body.address,
      size: req.body.size,
      length: req.body.length,
      color: req.body.color,
      willWait: req.body.willWait,
      moreInfo: req.body.moreInfo,
    }
  );

  res.json(update);
});

app.delete("/wait/:waitIds", async (req, res) => {
  try {
    const deleteById = await waitListed.deleteOne({ _id: req.params.waitIds });

    res.json(deleteById);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

//shipped API Routes

app.get("/shipped", async (req, res) => {
  let allShipped = await Shipped.find({});
  res.json(allShipped);
});

app.post("/shipped/save", async (req, res) => {
  const ready = new Shipped({
    county: req.body.county,
    progSource: req.body.progSource,
    firstBind: req.body.firstBind,
    emailElse: req.body.emailElse,
    phoneElse: req.body.phoneElse,
    nameElse: req.body.nameElse,
    nameSelf: req.body.nameSelf,
    dob: req.body.dob,
    emailSelf: req.body.emailSelf,
    phoneSelf: req.body.phoneSelf,
    address: req.body.address,
    size: req.body.size,
    length: req.body.length,
    color: req.body.color,
    willWait: req.body.willWait,
    moreInfo: req.body.moreInfo,
    date: Date.now(),
  });

  try {
    await ready.save();

    res.json(ready);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

// UPDATE : by ID

app.patch("/shipped/:shippedIds", async (req, res) => {
  let id = req.params.shippedIds;

  let update = await Shipped.updateOne(
    { _id: id },
    {
      county: req.body.county,
      progSource: req.body.progSource,
      firstBind: req.body.firstBind,
      emailElse: req.body.emailElse,
      phoneElse: req.body.phoneElse,
      nameElse: req.body.nameElse,
      nameSelf: req.body.nameSelf,
      dob: req.body.dob,
      emailSelf: req.body.emailSelf,
      phoneSelf: req.body.phoneSelf,
      address: req.body.address,
      size: req.body.size,
      length: req.body.length,
      color: req.body.color,
      willWait: req.body.willWait,
      moreInfo: req.body.moreInfo,
    }
  );

  res.json(update);
});

app.delete("/wait/:waitIds", async (req, res) => {
  try {
    const deleteById = await FormInput.deleteOne({ _id: req.params.waitIds });

    res.json(deleteById);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

//API Route for button to move ReadytoShip items to Shipped
app.post("/ready/move/:moveId", async (req, res) => {
  FormInput.findOne({ _id: req.params.moveId })
    .then((changedDocument) => {
      // Inserting the changedDocument in the destination collection
      Shipped.insertMany([changedDocument])
        .then((d) => {
          console.log("New Entry Saved");
        })
        .catch((error) => {
          console.log(error);
        });

      // Removing changedDocument from the first collection
      FormInput.deleteOne(changedDocument)
        .then(async (d) => {
          console.log("Removed Old Entry");
          const transport = nodemailer.createTransport({
            // Sending from Gmail. User and pass are the variables in the .env
            service: "Gmail",
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
          });
          // console.log(req.body)
          if (changedDocument.emailElse) {
            // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
            await transport.sendMail({
              from: process.env.GMAIL_USER,
              // Send to the email that user typed in "email" textbox
              to: changedDocument.emailElse,
              subject: "WE ARE SHIPPING YOUR BINDER",
              attachments: [
                {
                  filename: "Logo.png",
                  path: __dirname + "/src/img/OUTMaine_Logo.png",
                  cid: "logo",
                },
              ],
              html: `<img
              src="cid:logo"
              alt="Logo"
              width="300"
              height="200"
            />
          <h1
            style="
              font-family: 'Oswald', sans-serif;
            "
          >
            <strong><u>WE ARE SHIPPING YOUR BINDER!</u></strong>
          </h1>
          <h3
            style="
              font-family: 'Oswald', sans-serif;
            "
          >
            <p>
              Notifications will arrive from USPS.com regarding tracking and delivery to the email address provided.
              <br />
              If you have any questions, please email <a href="mailto: inga@outmaine.org">inga@outmaine.org</a>.
              <br />
              <br />
              Please be on the lookout for a brief survey from OUT Maine regarding our Binder Donation Program.
              <br/> 
              Your voice helps us continue to fund and expand our work and we appreciate your honest feedback!
            </p>
            </h3>
              <p
              style="
              font-family: 'Oswald', sans-serif;
              padding-right: 40%;
              "
              >
                <strong>Thank You!<br />Out Maine Team<br />www.outmaine.org</strong>
              </p>
              `,
            });
          } else if (changedDocument.emailSelf) {
            // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
            await transport.sendMail({
              from: process.env.GMAIL_USER,
              // Send to the email that user typed in "email" textbox
              to: changedDocument.emailSelf,
              subject: "WE ARE SHIPPING YOUR BINDER",
              attachments: [
                {
                  filename: "Logo.png",
                  path: __dirname + "/src/img/OUTMaine_Logo.png",
                  cid: "logo",
                },
              ],
              html: `<img
              src="cid:logo"
              alt="Logo"
              width="300"
              height="200"
            />
          <h1
            style="
              font-family: 'Oswald', sans-serif;
              display: flex;
              justify-content: center;
            "
          >
            <strong><u>WE ARE SHIPPING YOUR BINDER!</u></strong>
          </h1>
          <h3
            style="
              font-family: 'Oswald', sans-serif;
              display: flex;
              justify-content: center;
            "
          >
            <p>
              Notifications will arrive from USPS.com regarding tracking and delivery to the email address provided.
              <br />
              If you have any questions, please email <a href="mailto: inga@outmaine.org">inga@outmaine.org</a>.
              <br />
              <br />
              Please be on the lookout for a brief survey from OUT Maine regarding our Binder Donation Program.
              <br/> 
              Your voice helps us continue to fund and expand our work and we appreciate your honest feedback!
              </p>
          </h3>
          <p
          style="
          font-family: 'Oswald', sans-serif;
          display: flex;
          justify-content: center;
          padding-right: 40%;
          "
          >
            <strong>Thank You!<br />Out Maine Team<br />www.outmaine.org</strong>
          </p>
              `,
            }); // changedDocument
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

//API Route for Sending Emails

app.post("/send_mail", async (req, res) => {
  let {
    county,
    progSource,
    firstBind,
    emailElse,
    phoneElse,
    nameElse,
    nameSelf,
    dob,
    emailSelf,
    phoneSelf,
    address,
    size,
    length,
    color,
    willWait,
    moreInfo,
  } = req.body;
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  // initialize variable for storing the returned values of collection queries
  let binderInventory;
  // check to see if they've marked they are willing to wait AND they've selected both length and color properties
  if (
    willWait === true &&
    color !== "No preference" &&
    length !== "No preference"
  ) {
    // Look in BinderInventory for a binder with size length and color equivalent to what the user input
    binderInventory = await BinderInventory.findOne({
      size: { $in: [size] },
      length: { $in: [length] },
      color: { $in: [color] },
      quantity: { $gte: 1 },
    });
    // next check if they've marked that they're willing to wait AND they've only got a preference on color
  } else if (willWait === true && color !== "No preference") {
    // query binder inventory for requested size and color with a quantity greater than 0
    binderInventory = await BinderInventory.find({
      size: { $in: [size] },
      color: { $in: [color] },
      quantity: { $gte: 1 },
      // sort results by quantity field with highest quantity at the top
    }).sort({ quantity: -1 });
    // if there are no binders with that size/color in stock
    if (binderInventory === null) {
      // make sure results show null
      binderInventory = null;
    } else {
      // if there are some in stock, give them one with the highest quantity
      binderInventory = binderInventory[0];
    }
    // next check that the they've marked they're willing to wait AND they've selected a preference on length
  } else if (willWait === true && length !== "No preference") {
    // query binder inventory for requested size and length with a quantity greater than 0
    binderInventory = await BinderInventory.find({
      size: { $in: [size] },
      length: { $in: [length] },
      quantity: { $gte: 1 },
      // sort by quantity field with highest being at the top
    }).sort({ quantity: -1 });
    if (binderInventory === null) {
      // if there are no results from previous query, make sure binderInventory returns null
      binderInventory = null;
    } else {
      // otherwise grab the binder in that size/length with the highest quantity
      binderInventory = binderInventory[0];
    }
    // if they've not selected they want to wait
  } else if (willWait === false) {
    console.log("no pref");
    // if they have no preferences, query inventory just by size
    binderInventory = await BinderInventory.find({
      size: { $in: [size] },
      quantity: { $gte: 1 },
      // sort returned results so highest quantity is first
    }).sort({ quantity: -1 });
    // grab binder at index 0 for highest quantity
    binderInventory = binderInventory[0];
    if (binderInventory === undefined) {
      binderInventory = null;
    }
  }
  if (binderInventory === null) {
    if (emailElse) {
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailElse,
        subject: "WE KNOW HAVING A BINDER IS IMPORTANT",
        attachments: [
          {
            filename: "Logo.png",
            path: __dirname + "/src/img/OUTMaine_Logo.png",
            cid: "logo",
          },
        ],
        html: `<img
          src="cid:logo"
          alt="Logo"
          width="300"
          height="200"
        />
      <h1
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>WE KNOW HAVING A BINDER IS IMPORTANT</u></strong>
      </h1>
      <h3
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <p>
          It's important to us that you get the binder you truly want and it looks
          like we are currently out of stock of the one you'd prefer. HOWEVER..<br />We've
          placed your information on our WaitList and when we get one back in
          stock we'll be sure to get it mailed to you as soon as we can. <br />
          If you'd like to change your request to something we DO have available
          please email <a href="mailto: inga@outmaine.org">inga@outmaine.org</a>
          <br />so we can see what other options may be available to ship sooner.
      Please take a moment to verify that the information below is correct.<br/> If
      something is incorrect and needs to be changed, please email
      <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can fix it before we ship the binder.
        </p>
      </h3>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Name:</strong> ${nameElse}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Email:</strong> ${emailElse}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Phone number:</strong> ${phoneElse}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
      <strong>Street: </strong>${address.address1}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Apt/PO Box: </strong>${address.address2}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
      >
        <strong>City: </strong>${address.city}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>State: </strong>${address.state}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Zip: </strong>${address.zip}
      </p>
      <br />
  
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>Binder Details</u></strong>
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Size:</strong> ${size}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Length:</strong> ${length}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Color:</strong> ${color}
      </p>
      <br />
  
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Thank You!<br />Out Maine Team</strong>
      </p>
    `,
      });
    } else if (emailSelf) {
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailSelf,
        subject: "WE KNOW HAVING A BINDER IS IMPORTANT",
        attachments: [
          {
            filename: "Logo.png",
            path: __dirname + "/src/img/OUTMaine_Logo.png",
            cid: "logo",
          },
        ],
        html: `<img
          src="cid:logo"
          alt="Logo"
          width="300"
          height="200"
        />
      <h1
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>WE KNOW HAVING A BINDER IS IMPORTANT</u></strong>
      </h1>
      <h3
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <p>
          It's important to us that you get the binder you truly want and it looks
          like we are currently out of stock of the one you'd prefer. HOWEVER..<br />We've
          placed your information on our WaitList and when we get one back in
          stock we'll be sure to get it mailed to you as soon as we can. <br />
          If you'd like to change your request to something we DO have available
          please email <a href="mailto: inga@outmaine.org">inga@outmaine.org</a>
          <br />so we can see what other options may be available to ship sooner.
      Please take a moment to verify that the information below is correct.<br/> If
      something is incorrect and needs to be changed, please email
      <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can fix it before we ship the binder.
        </p>
      </h3>
      
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Name:</strong> ${nameSelf}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Email:</strong> ${emailSelf}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Phone number:</strong> ${phoneSelf}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
      <strong>Street: </strong>${address.address1}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Apt/PO Box: </strong>${address.address2}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>City: </strong>${address.city}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>State: </strong>${address.state}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Zip: </strong>${address.zip}
      </p>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>Binder Details</u></strong>
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Size:</strong> ${size}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Length:</strong> ${length}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Color:</strong> ${color}
      </p>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Thank You!<br />Out Maine Team</strong>
      </p>
    `,
      });
    }
    // if binder does nto exists in db at all, add to waitlist
    let newEntry = waitListed({
      county: county,
      progSource: progSource,
      firstBind: firstBind,
      emailElse: emailElse,
      phoneElse: phoneElse,
      nameElse: nameElse,
      nameSelf: nameSelf,
      dob: dob,
      emailSelf: emailSelf,
      phoneSelf: phoneSelf,
      address: address,
      size: size,
      length: length,
      color: color,
      willWait: willWait,
      moreInfo: moreInfo,
      date: Date.now(),
    });
    // Save that entry
    await newEntry.save();
  } else if (binderInventory) {
    if (emailElse) {
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailElse,
        subject: "Your Binder Is In Stock And Ready To Ship",
        attachments: [
          {
            filename: "Logo.png",
            path: __dirname + "/src/img/OUTMaine_Logo.png",
            cid: "logo",
          },
        ],
        html: `
        <img
          src="cid:logo"
          alt="Logo"
          width="300"
          height="200"
        />
      <h1
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>Your Binder Is In Stock And Ready To Ship</u></strong>
      </h1>
      <h3
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <p>
          Before we get ready to ship it to you, please take a moment and double
          check that all of the information below is correct.<br /><strong
            ><u>If anything is missing or incorrect</u></strong
          >
          please email
          <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can make
          the necessary corrections before shipping:
        </p>
      </h3>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Name:</strong> ${nameElse}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Email:</strong> ${emailElse}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Phone number:</strong> ${phoneElse}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Street: </strong>${address.address1}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Apt/PO Box: </strong>${address.address2}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>City: </strong>${address.city}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>State: </strong>${address.state}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Zip: </strong>${address.zip}
      </p> 
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>Binder Details</u></strong>
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Size:</strong> ${binderInventory.size}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Length:</strong> ${binderInventory.length}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Color:</strong> ${binderInventory.color}
      </p>
      <br />
  
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        Please be on the lookout for a brief survey from OUT Maine regarding our
        Binder Donation Program.<br />
        Your voice helps us continue to fund and expand our work and we appreciate
        your honest feedback.
      </p>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Thank You!<br />Out Maine Team</strong>
      </p>
    
    `,
      });
    } else if (emailSelf) {
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailSelf,
        subject: "Your Binder Is In Stock And Ready To Ship",
        attachments: [
          {
            filename: "Logo.png",
            path: __dirname + "/src/img/OUTMaine_Logo.png",
            cid: "logo",
          },
        ],
        html: `
        <img
          src="cid:logo"
          alt="Logo"
          width="300"
          height="200"
        />
      <h1
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>Your Binder Is In Stock And Ready To Ship</u></strong>
      </h1>
      <h3
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <p>
          Before we get ready to ship it to you, please take a moment and double
          check that all of the information below is correct.<br /><strong
            ><u>If anything is missing or incorrect</u></strong
          >
          please email
          <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can make
          the necessary corrections before shipping:
        </p>
      </h3>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Name:</strong> ${nameSelf}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Email:</strong> ${emailSelf}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Phone number:</strong> ${phoneSelf}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Street: </strong>${address.address1}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Apt/PO Box: </strong>${address.address2}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>City: </strong>${address.city}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>State: </strong>${address.state}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Zip: </strong>${address.zip}
      </p> 
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong><u>Binder Details</u></strong>
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Size:</strong> ${binderInventory.size}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Length:</strong> ${binderInventory.length}
      </p>
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Color:</strong> ${binderInventory.color}
      </p>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        Please be on the lookout for a brief survey from OUT Maine regarding our
        Binder Donation Program.<br />
        Your voice helps us continue to fund and expand our work and we appreciate
        your honest feedback.
      </p>
      <br />
      <p
        style="
          font-family: 'Oswald', sans-serif;
        "
      >
        <strong>Thank You!<br />Out Maine Team</strong>
      </p>
    `,
      });
    }
    let newEntry = FormInput({
      county: county,
      progSource: progSource,
      firstBind: firstBind,
      emailElse: emailElse,
      phoneElse: phoneElse,
      nameElse: nameElse,
      nameSelf: nameSelf,
      dob: dob,
      emailSelf: emailSelf,
      phoneSelf: phoneSelf,
      address: address,
      size: binderInventory.size,
      length: binderInventory.length,
      color: binderInventory.color,
      willWait: willWait,
      moreInfo: moreInfo,
      date: Date.now(),
    });
    // Save that entry
    await newEntry.save();
    // Look in ProcessedInventory for a binder with size length and color equivalent to what the user input
    let processedBind = await ProcessedInventory.findOne({
      size: { $in: [binderInventory.size] },
      length: { $in: [binderInventory.length] },
      color: { $in: [binderInventory.color] },
    });
    if (processedBind === null) {
      let newEntry = ProcessedInventory({
        size: binderInventory.size,
        length: binderInventory.length,
        color: binderInventory.color,
        quantity: 1,
      });
      await newEntry.save();
    } else {
      // After finding that binder in ProcessedInventory, update the quantity by incrementing by 1
      await ProcessedInventory.updateOne(
        { _id: processedBind._id },
        { $set: { quantity: processedBind.quantity + 1 } }
      );
    }
    // After finding that binder in BinderInventory, update the quantity by decrementing by 1
    await BinderInventory.updateOne(
      { _id: binderInventory._id },
      { $set: { quantity: binderInventory.quantity - 1 } }
    );
  }
});

//Have a watch on the binder inventory collection (inventorys) everytime the collection is updated in some way. This watch will also send an email when a waitlisted person's item is in stock.
BinderInventory.watch().on("change", async (change) => {
  // If the operation is delete, just return
  if (change.operationType === "delete") {
    return;
  } else {
    //Otherwise, look for the newly added binder in binder inventory and find it using id
    let changedDocument = await BinderInventory.findOne({
      _id: { $in: [change.documentKey._id] },
    });
    console.log(changedDocument);
    //If the quantity of the binder is 0, return so that we no longer look for that specified binder.
    if (changedDocument.quantity === 0) {
      return;
    }

    // Look in waitListed for newly added binder(changedDocument)
    await waitListed
      .findOne({
        size: { $in: [changedDocument.size] },
        length: { $in: [changedDocument.length] },
        color: { $in: [changedDocument.color] },
      })
      .then(async function (doc) {
        console.log("before first doc = null");
        console.log(doc);
        // If there is no waitListed entry matching the newly added binder
        if (doc === null) {
          console.log("before just size/length");
          console.log(doc);
          // check wait list for no pref options on color/length by excluding one or the other, or both
          doc = await waitListed.findOne({
            size: { $in: [changedDocument.size] },
            length: { $in: [changedDocument.length] },
          });
          console.log("before size/color");
          console.log(doc);
          if (doc === null) {
            doc = await waitListed.findOne({
              size: { $in: [changedDocument.size] },
              color: { $in: [changedDocument.color] },
            });
          }
          console.log("before just size");
          console.log(doc);
          if (doc === null) {
            doc = await waitListed.findOne({
              size: { $in: [changedDocument.size] },
            });
          }
        }
        // after trying to find by just size and doc is still null then return
        if (doc === null) {
          return;
          // Otherwise, add the waitlisted entry into readytoship
        } else {
          //   readytoship
          FormInput.insertMany([doc])
            .then((doc) => {
              console.log("New Entry Saved in readytoships");
            })
            .catch((error) => {
              console.log(error);
            });
          // Delete that entire document from waitListed
          await waitListed.deleteOne(doc);

          // Look in ProcessedInventory for that same newly added binder (doc)
          let processedBind = await ProcessedInventory.findOne({
            size: { $in: [doc.size] },
            length: { $in: [doc.length] },
            color: { $in: [doc.color] },
          });

          //If that binder doesnt exist in processedinventory, create it
          if (processedBind === null) {
            let newEntry = ProcessedInventory({
              size: doc.size,
              length: doc.length,
              color: doc.color,
              quantity: 1,
            });
            await newEntry.save();
          } else {
            // After finding that binder in ProcessedInventory, update the quantity by incrementing by 1
            await ProcessedInventory.updateOne(
              { _id: processedBind._id },
              { $set: { quantity: processedBind.quantity + 1 } }
            );
          }
          // After finding that binder in BinderInventory, update the quantity by decrementing by 1. The stock has now been updated.
          await BinderInventory.updateOne(
            { _id: changedDocument._id },
            { $set: { quantity: changedDocument.quantity - 1 } }
          );
          // Create a transport variable using nodemailer
          const transport = nodemailer.createTransport({
            // Sending from Gmail. User and pass are the variables in the .env
            service: "Gmail",
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
          });
          // If the user enters info in "email"
          if (doc.emailElse) {
            await transport.sendMail({
              from: process.env.GMAIL_USER,
              // Send to the email that user typed in "email" textbox
              to: doc.emailElse,
              subject: "Your Binder Is In Stock And Ready To Ship",
              attachments: [
                {
                  filename: "Logo.png",
                  path: __dirname + "/src/img/OUTMaine_Logo.png",
                  cid: "logo",
                },
              ],
              html: `<img
                src="cid:logo"
                alt="Logo"
                width="300"
                height="200"
              />
            <h1
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong><u>YOUR BINDER IS BACK IN STOCK AND READY TO SHIP!</u></strong>
            </h1>
            <h3
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <p>
                Before we get ready to ship it to you, please take a moment and double
                check that all of the information below is correct.<br /><strong
                  ><u>If anything is missing or incorrect</u></strong
                >
                please email
                <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can make
                the necessary corrections before shipping:
              </p>
            </h3>
            <br />
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Name:</strong> ${doc.nameElse}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Email:</strong> ${doc.emailElse}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Phone number:</strong> ${doc.phoneElse}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
            <strong>Street: </strong>${doc.address.address1}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Apt/PO Box: </strong>${doc.address.address2}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>City: </strong>${doc.address.city}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>State: </strong>${doc.address.state}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Zip: </strong>${doc.address.zip}
            </p> 
            <br />
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong><u>Binder Details</u></strong>
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Size:</strong> ${doc.size}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Length:</strong> ${doc.length}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Color:</strong> ${doc.color}
            </p>
            <br />
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              Please be on the lookout for a brief survey from OUT Maine regarding our
              Binder Donation Program.<br />
              Your voice helps us continue to fund and expand our work and we appreciate
              your honest feedback.
            </p>
            <br />
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Thank You!<br />Out Maine Team</strong>
            </p>`,
            });
            // Code is essentially the same as above except for if the user enters info in "email (else)"". This means the person is ordering a binder for someone else"
          } else {
            // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
            await transport.sendMail({
              from: process.env.GMAIL_USER,
              // Send to the email that user typed in "email" textbox
              to: doc.emailSelf,
              subject: "Your Binder Is In Stock And Ready To Ship",
              attachments: [
                {
                  filename: "Logo.png",
                  path: __dirname + "/src/img/OUTMaine_Logo.png",
                  cid: "logo",
                },
              ],
              html: `<img
                src="cid:logo"
                alt="Logo"
                width="300"
                height="200"
              />
            <h1
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong><u>YOUR BINDER IS BACK IN STOCK AND READY TO SHIP!</u></strong>
            </h1>
            <h3
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <p>
                Before we get ready to ship it to you, please take a moment and double
                check that all of the information below is correct.<br /><strong
                  ><u>If anything is missing or incorrect</u></strong
                >
                please email
                <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can make
                the necessary corrections before shipping:
              </p>
            </h3>
            <br />
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Name:</strong> ${doc.nameSelf}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Email:</strong> ${doc.emailSelf}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Phone number:</strong> ${doc.phoneSelf}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
            <strong>Street: </strong>${doc.address.address1}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Apt/PO Box: </strong>${doc.address.address2}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>City: </strong>${doc.address.city}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>State: </strong>${doc.address.state}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Zip: </strong>${doc.address.zip}
            </p> 
            <br />
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong><u>Binder Details</u></strong>
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Size:</strong> ${doc.size}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Length:</strong> ${doc.length}
            </p>
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Color:</strong> ${doc.color}
            </p>
            <br />
        
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              Please be on the lookout for a brief survey from OUT Maine regarding our
              Binder Donation Program.<br />
              Your voice helps us continue to fund and expand our work and we appreciate
              your honest feedback.
            </p>
            <br />
        
            <p
              style="
                font-family: 'Oswald', sans-serif;
              "
            >
              <strong>Thank You!<br />Out Maine Team</strong>
            </p>
              `,
            });
          }
        }
      });
  }
});

waitListed.watch().on("change", async (change) => {
  // If the operation is delete, just return
  if (change.operationType === "delete") {
    return;
  } else {
    //Otherwise, look for the newly added binder in binder inventory and find it using id
    let changedDocument = await waitListed.findOne({
      _id: { $in: [change.documentKey._id] },
    });
    // console.log(changedDocument)

    let foundBinder = await BinderInventory.findOne({
      size: { $in: [changedDocument.size] },
      length: { $in: [changedDocument.length] },
      color: { $in: [changedDocument.color] },
      // quantity: { $gte: 1 }
    });
    // console.log(foundBinder)

    if (foundBinder === null || foundBinder.quantity === 0) {
      return;
    } else if (foundBinder) {
      await waitListed.deleteOne(changedDocument);
      await FormInput.insertMany([changedDocument]);

      // Look in ProcessedInventory for that same newly added binder (changedDocument)
      let processedBind = await ProcessedInventory.findOne({
        size: { $in: [changedDocument.size] },
        length: { $in: [changedDocument.length] },
        color: { $in: [changedDocument.color] },
      });

      //If that binder doesnt exist in processedinventory, create it
      if (processedBind === null) {
        let newEntry = ProcessedInventory({
          size: changedDocument.size,
          length: changedDocument.length,
          color: changedDocument.color,
          quantity: 1,
        });
        await newEntry.save();
      } else {
        // After finding that binder in ProcessedInventory, update the quantity by incrementing by 1
        await ProcessedInventory.updateOne(
          { _id: processedBind._id },
          { $set: { quantity: processedBind.quantity + 1 } }
        );
      }

      // After finding that binder in BinderInventory, update the quantity by decrementing by 1. The stock has now been updated.
      await BinderInventory.updateOne(
        { _id: foundBinder._id },
        { $set: { quantity: foundBinder.quantity - 1 } }
      );

      // Create a transport variable using nodemailer
      const transport = nodemailer.createTransport({
        // Sending from Gmail. User and pass are the variables in the .env
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      // If the user enters info in "email"
      if (changedDocument.emailElse) {
        await transport.sendMail({
          from: process.env.GMAIL_USER,
          // Send to the email that user typed in "email" textbox
          to: changedDocument.emailElse,
          subject: "YOUR BINDER IS BACK IN STOCK AND READY TO SHIP",
          attachments: [
            {
              filename: "Logo.png",
              path: __dirname + "/src/img/OUTMaine_Logo.png",
              cid: "logo",
            },
          ],
          html: `<img
            src="cid:logo"
            alt="Logo"
            width="300"
            height="200"
          />
        <h1
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong><u>YOUR BINDER IS BACK IN STOCK AND READY TO SHIP!</u></strong>
        </h1>
        <h3
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <p>
            Before we get ready to ship it to you, please take a moment and double
            check that all of the information below is correct.<br /><strong
              ><u>If anything is missing or incorrect</u></strong
            >
            please email
            <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can make
            the necessary corrections before shipping:
          </p>
        </h3>
        <br />
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Name:</strong> ${changedDocument.nameElse}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Email:</strong> ${changedDocument.emailElse}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Phone number:</strong> ${changedDocument.phoneElse}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
        <strong>Street: </strong>${changedDocument.address.address1}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Apt/PO Box: </strong>${changedDocument.address.address2}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>City: </strong>${changedDocument.address.city}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>State: </strong>${changedDocument.address.state}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Zip: </strong>${changedDocument.address.zip}
        </p> 
        <br />
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong><u>Binder Details</u></strong>
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Size:</strong> ${changedDocument.size}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Length:</strong> ${changedDocument.length}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Color:</strong> ${changedDocument.color}
        </p>
        <br />
    
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          Please be on the lookout for a brief survey from OUT Maine regarding our
          Binder Donation Program.<br />
          Your voice helps us continue to fund and expand our work and we appreciate
          your honest feedback.
        </p>
        <br />
    
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Thank You!<br />Out Maine Team</strong>
        </p>`,
        });
        // Code is essentially the same as above except for if the user enters info in "email (else)"". This means the person is ordering a binder for someone else"
      } else {
        // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
        await transport.sendMail({
          from: process.env.GMAIL_USER,
          // Send to the email that user typed in "email" textbox
          to: changedDocument.emailSelf,
          subject: "YOUR BINDER IS BACK IN STOCK AND READY TO SHIP",
          attachments: [
            {
              filename: "Logo.png",
              path: __dirname + "/src/img/OUTMaine_Logo.png",
              cid: "logo",
            },
          ],
          html: `<img
            src="cid:logo"
            alt="Logo"
            width="300"
            height="200"
          />
        <h1
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong><u>YOUR BINDER IS BACK IN STOCK AND READY TO SHIP!</u></strong>
        </h1>
        <h3
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <p>
            Before we get ready to ship it to you, please take a moment and double
            check that all of the information below is correct.<br /><strong
              ><u>If anything is missing or incorrect</u></strong
            >
            please email
            <a href="mailto: inga@outmaine.org">inga@outmaine.org</a> so we can make
            the necessary corrections before shipping:
          </p>
        </h3>
        <br />
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Name:</strong> ${changedDocument.nameSelf}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Email:</strong> ${changedDocument.emailSelf}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Phone number:</strong> ${changedDocument.phoneSelf}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
        <strong>Street: </strong>${changedDocument.address.address1}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Apt/PO Box: </strong>${changedDocument.address.address2}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>City: </strong>${changedDocument.address.city}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>State: </strong>${changedDocument.address.state}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Zip: </strong>${changedDocument.address.zip}
        </p> 
        <br />
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong><u>Binder Details</u></strong>
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Size:</strong> ${changedDocument.size}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Length:</strong> ${changedDocument.length}
        </p>
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Color:</strong> ${changedDocument.color}
        </p>
        <br />
    
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          Please be on the lookout for a brief survey from OUT Maine regarding our
          Binder Donation Program.<br />
          Your voice helps us continue to fund and expand our work and we appreciate
          your honest feedback.
        </p>
        <br />
    
        <p
          style="
            font-family: 'Oswald', sans-serif;
          "
        >
          <strong>Thank You!<br />Out Maine Team</strong>
        </p>`,
        });
      }
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
