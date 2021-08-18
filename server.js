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
  elseEmail: String,
  elsePhone: Number,
  nameSelf: String,
  nameElse: String,
  dob: String,
  email: String,
  phone: Number,
  address: String,
  size: String,
  length: String,
  color: String,
  willWait: Boolean,
  moreInfo: String,
  yesSurvey: Boolean,
  date: Date,
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

// Create a model for the readytoships collection that uses the formSchema
const FormInput = mongoose.model("readytoships", formSchema);

//Schema for binder
const binderSchema = new mongoose.Schema({
  size: String,
  length: String,
  color: String,
  quantity: Number,
});
// Model for inventorys collection that uses the binderschema
const BinderInventory = mongoose.model(`inventorys`, binderSchema);

// Model for processedinventorys that uses the binderschema
const ProcessedInventory = mongoose.model("processedinventorys", binderSchema);

// Model for waitListeds that uses the formScehma
const waitListed = mongoose.model("waitListeds", formSchema);

app.post("/savebinder", async (req, res) => {
  // Find a binder in the inventory based on size length and color input by user
  let binderInventory = await BinderInventory.findOne({
    size: { $in: [req.body.binderSize] },
    length: { $in: [req.body.binderStyle] },
    color: { $in: [req.body.binderColor] },
  });
  // If the found binder doesn't exist, create a new entry in that binder inventory using user input from the modal
  if (!binderInventory) {
    let newEntry = BinderInventory({
      size: req.body.binderSize,
      length: req.body.binderStyle,
      color: req.body.binderColor,
      quantity: parseInt(req.body.binderQuantity),
    });
    //Save the new entry
    await newEntry.save();
    // Redirect to inventory page
    res.redirect("/display/inventory");
    // If the found binder exists, increase the quantity of that binder by 1 and save that entry. Redirect to inventory afterwards
  } else if (binderInventory) {
    // binderInventory.size = req.body.binderSize;
    binderInventory.quantity =
      binderInventory.quantity + parseInt(req.body.binderQuantity);
    await binderInventory.save();
    res.redirect("/display/inventory");
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
        // If there is no waitListed entry matching the newly added binder, just return
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
          if (doc.email) {
            // Send an email
            await transport.sendMail({
              // Sent from an email address in .env file
              from: process.env.GMAIL_USER,
              // Sent to the email that the user typed in "email" texbox
              to: doc.email,
              subject: "test email",
              // This represents the actual email message. Can be styled with HTML. Email below confirms when a binder is in stock after a person is added to the waitlist.
              html: `<div className="email" style="
                border: 1px solid black;
                padding: 20px;
                font-family: sans-serif;
                line-height: 2;
                font-size: 20px; 
                ">
                <p>Great news! Your binder in size <strong>${doc.size}</strong> is now in stock! It will be shipped out within a few business days. But before we do that please verify if the information below is correct. If anything is missing or incorrect, please email example@outmaine.com</p>
                <p><strong>Email:</strong> ${doc.email}</p>
                <p><strong>Phone number:</strong> ${doc.phone}</p>
                <p><strong>Address:</strong> ${doc.address}</p>
       
                <p>All the best, Shadman</p>
                 </div >
              
            `,
            });
            // Code is essentially the same as above except for if the user enters info in "email (else)"". This means the person is ordering a binder for someone else"
          } else {
            await transport.sendMail({
              from: process.env.GMAIL_USER,
              // Sent to the email that the user typed in "email (else)" texbox
              to: doc.elseEmail,
              subject: "test email",
              html: `<div className="email" style="
                border: 1px solid black;
                padding: 20px;
                font-family: sans-serif;
                line-height: 2;
                font-size: 20px; 
                ">
                <p>Great news! Your binder in size <strong>${doc.size}</strong> is now in stock! It will be shipped out within a few business days. But before we do that please verify if the information below is correct. If anything is missing or incorrect, please email example@outmaine.com</p>
                <p><strong>Email:</strong> ${doc.elseEmail}</p>
                <p><strong>Phone number:</strong> ${doc.elsePhone}</p>
                <p><strong>Address:</strong> ${doc.address}</p>
       
                <p>All the best, Shadman</p>
                 </div >
              
            `,
            });
          }
        }
      });
  }
});

app.post("/send_mail", async (req, res) => {
  console.log("277 " + req.body);
  let { emailSelf, elseEmail, numberSelf, numberElse, addressSelf, size } =
    req.body;
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
    req.body.willWait === true &&
    req.body.bindColor !== "No preference" &&
    req.body.bindLength !== "No preference"
  ) {
    // Look in BinderInventory for a binder with size length and color equivalent to what the user input
    binderInventory = await BinderInventory.findOne({
      size: { $in: [req.body.size] },
      length: { $in: [req.body.bindLength] },
      color: { $in: [req.body.bindColor] },
    });
    // next check if they've marked that they're willing to wait AND they've only got a preference on color
  } else if (
    req.body.willWait === true &&
    req.body.bindColor !== "No preference"
  ) {
    // query binder inventory for requested size and color with a quantity greater than 0
    binderInventory = await BinderInventory.find({
      size: { $in: [req.body.size] },
      color: { $in: [req.body.bindColor] },
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
  } else if (
    req.body.willWait === true &&
    req.body.bindLength !== "No preference"
  ) {
    // query binder inventory for requested size and length with a quantity greater than 0
    binderInventory = await BinderInventory.find({
      size: { $in: [req.body.size] },
      length: { $in: [req.body.bindLength] },
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
  } else if (req.body.willWait === false) {
    // first check to see if they have any preferred color/length
    if (
      req.body.bindColor !== "No preference" &&
      req.body.bindLength !== "No preference"
    ) {
      // query binder inventory for requested size, length, and color with a quantity greater than 0
      binderInventory = await BinderInventory.findOne({
        size: { $in: [req.body.size] },
        length: { $in: [req.body.bindLength] },
        color: { $in: [req.body.bindColor] },
        quantity: { $gte: 1 },
      });
      // if nothing matches exact params, search by just size requested with quantity greater than 0
      if (binderInventory === null) {
        binderInventory = await BinderInventory.find({
          size: { $in: [req.body.size] },
          quantity: { $gte: 1 },
          // sort by quantity field with largest at the top
        }).sort({ quantity: -1 });
        // grab binder with highest quantity
        binderInventory = binderInventory[0];
      }
      // check if they've only selected a preferred color
    } else if (req.body.bindColor !== "No preference") {
      // query binder inventory for requested size AND color with quantity greater than 0
      binderInventory = await BinderInventory.find({
        size: { $in: [req.body.size] },
        color: { $in: [req.body.bindColor] },
        quantity: { $gte: 1 },
        // sort by quantity with highest at the top
      }).sort({ quantity: -1 });
      // if nothing matches previous query
      if (binderInventory === null) {
        // search by just requested size and quantity greater than 0
        binderInventory = await BinderInventory.find({
          size: { $in: [req.body.size] },
          quantity: { $gte: 1 },
          // sort by quantity with highest at the top
        }).sort({ quantity: -1 });
      } // grab binder at index 0 for highest quantity
      binderInventory = binderInventory[0];
      // check to see if they have a preferred length
    } else if (req.body.bindLength !== "No preference") {
      // query binder inventory for requested size and length with quantity greater than 0
      binderInventory = await BinderInventory.find({
        size: { $in: [req.body.size] },
        length: { $in: [req.body.bindLength] },
        quantity: { $gte: 1 },
        // sort returned results so highest quantity is first
      }).sort({ quantity: -1 });
      // if previous query returned no results
      if (binderInventory === null) {
        // search just by size and quantity greater than 0
        binderInventory = await BinderInventory.find({
          size: { $in: [req.body.size] },
          quantity: { $gte: 1 },
          // sort returned results so highest quantity is first
        }).sort({ quantity: -1 });
      }
      // grab binder at index 0 for highest quantity
      binderInventory = binderInventory[0];
    } else {
      // if they have no preferences and just selected size, query inventory just by size
      binderInventory = await BinderInventory.find({
        size: { $in: [req.body.size] },
        quantity: { $gte: 1 },
        // sort returned results so highest quantity is first
      }).sort({ quantity: -1 });
      // grab binder at index 0 for highest quantity
      binderInventory = binderInventory[0];
    }
  }

  // If the user types into "email" texbox
  if (req.body.emailSelf) {
    // if binder does nto exists in db at all, add to waitlist
    if (binderInventory === null) {
      let newEntry = waitListed({
        county: req.body.county,
        nameSelf: req.body.nameSelf,
        dob: req.body.dob,
        email: req.body.emailSelf,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.bindLength,
        color: req.body.bindColor,
        willWait: req.body.willWait,
        moreInfo: req.body.moreInfo,
        yesSurvey: req.body.yesSurvey,
        date: Date.now(),
      });
      // Save that entry
      await newEntry.save();
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailSelf,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <p>We apologize for the inconvenience, but your binder is currently not in stock. You have been added to the waitlist.</p>
            <p>Binder Details</p>
            <p>Size: ${req.body.size}</p>
            <p>Color: ${req.body.bindColor}</p>
            <p>Length: ${req.body.bindLength}</p>
            <p>All the best, Shadman</p>
             </div>
        `,
      });
    } // If it is not in stock, add that user as a whole new entry in the waitlist based on their form input.
    else if (binderInventory.quantity === 0) {
      let newEntry = waitListed({
        county: req.body.county,
        nameSelf: req.body.nameSelf,
        dob: req.body.dob,
        email: req.body.emailSelf,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.bindLength,
        color: req.body.bindColor,
        willWait: req.body.willWait,
        moreInfo: req.body.moreInfo,
        yesSurvey: req.body.yesSurvey,
        date: Date.now(),
      });
      // Save that entry
      await newEntry.save();
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailSelf,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <p>We apologize for the inconvenience, but your binder is currently not in stock. You have been added to the waitlist.</p>
            <p>Binder Details</p>
            <p>Size: ${binderInventory.size}</p>
            <p>Color: ${binderInventory.color}</p>
            <p>Length: ${binderInventory.length}</p>
            <p>All the best, Shadman</p>
             </div>
        `,
      });
      // If the item is in stock (i.e quantity > 1), add a new entry to the "readytoships" collection using the information the user input into the form.
    } else if (binderInventory.quantity > 0) {
      let newEntry = FormInput({
        county: req.body.county,
        nameSelf: req.body.nameSelf,
        dob: req.body.dob,
        email: req.body.emailSelf,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.bindLength,
        color: req.body.bindColor,
        willWait: req.body.willWait,
        moreInfo: req.body.moreInfo,
        yesSurvey: req.body.yesSurvey,
        date: Date.now(),
      });

      // Save that entry
      await newEntry.save();

      // Look in ProcessedInventory for a binder with size length and color equivalent to what the user input
      let processedBind = await ProcessedInventory.findOne({
        size: { $in: [req.body.size] },
        length: { $in: [req.body.bindLength] },
        color: { $in: [req.body.bindColor] },
      });
      if (processedBind === null) {
        let newEntry = ProcessedInventory({
          size: req.body.size,
          length: req.body.length,
          color: req.body.color,
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

      // Send an email confirming the requested binder is in stock and ask the customer to confirm information
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailSelf,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <p>Your requested binder is ready to ship! But before we do so, please verify that the information below is correct! If any of the information is incorrect or missing, please email example@outmaine.com.</p>
            <p><strong>Email:</strong> ${emailSelf}</p>
            <p><strong>Phone number:</strong> ${numberSelf}</p>
            <p><strong>Address:</strong> ${addressSelf}</p>
            <p>Binder Details</p>
            <p>Size: ${binderInventory.size}</p>
            <p>Color: ${binderInventory.color}</p>
            <p>Length: ${binderInventory.length}</p>
   
            <p>All the best, Shadman</p>
             </div >
          
        `,
      });
      res.redirect("/");
    }
    // Essentially the same as the code above except for if the user typed in the "email (else) textbox"
  } else if (req.body.elseEmail) {
    // if binder does nto exists in db at all, add to waitlist
    if (binderInventory === null) {
      let newEntry = waitListed({
        county: req.body.county,
        nameSelf: req.body.nameSelf,
        dob: req.body.dob,
        email: req.body.emailSelf,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.bindLength,
        color: req.body.bindColor,
        willWait: req.body.willWait,
        moreInfo: req.body.moreInfo,
        yesSurvey: req.body.yesSurvey,
        date: Date.now(),
      });
      // Save that entry
      await newEntry.save();
      // Send email stating the binder in specified size in not in stock and the user has been added to waitlist.
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send to the email that user typed in "email" textbox
        to: emailSelf,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <p>We apologize for the inconvenience, but your binder is currently not in stock. You have been added to the waitlist.</p>
            <p>Binder Details</p>
            <p>Size: ${req.body.size}</p>
            <p>Color: ${req.body.bindColor}</p>
            <p>Length: ${req.body.bindLength}</p>
            <p>All the best, Shadman</p>
             </div>
        `,
      });
    } else if (binderInventory === null) {
      let newEntry = waitListed({
        county: req.body.county,
        nameElse: req.body.nameElse,
        dob: req.body.dob,
        elseEmail: req.body.emailElse,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.bindLength,
        color: req.body.bindColor,
        willWait: req.body.willWait,
        moreInfo: req.body.moreInfo,
        yesSurvey: req.body.yesSurvey,
        date: Date.now(),
      });
      await newEntry.save();
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send email to the address typed in "email (else)" textbox
        to: elseEmail,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <p>We apologize for the inconvenience, but your binder is currently not in stock. You have been added to the waitlist.</p>
            <p>Binder Details</p>
            <p>Size: ${req.body.size}</p>
            <p>Color: ${req.body.bindColor}</p>
            <p>Length: ${req.body.bindLength}</p>
            <p>All the best, Shadman</p>
             </div>
        `,
      });
    } else if (binderInventory.quantity > 0) {
      let newEntry = FormInput({
        county: req.body.county,
        nameElse: req.body.nameElse,
        dob: req.body.dob,
        elseEmail: req.body.emailElse,
        phone: req.body.numberSelf,
        address: req.body.addressSelf,
        size: req.body.size,
        length: req.body.bindLength,
        color: req.body.bindColor,
        willWait: req.body.willWait,
        moreInfo: req.body.moreInfo,
        yesSurvey: req.body.yesSurvey,
        date: Date.now(),
      });

      await newEntry.save();

      // Inserting the doc in the destination collection
      let processedBind = await ProcessedInventory.findOne({
        size: { $in: [req.body.size] },
        length: { $in: [req.body.bindLength] },
        color: { $in: [req.body.bindColor] },
      });
      if (processedBind === null) {
        let newEntry = ProcessedInventory({
          size: req.body.size,
          length: req.body.length,
          color: req.body.color,
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
      await BinderInventory.updateOne(
        { _id: binderInventory._id },
        { $set: { quantity: binderInventory.quantity - 1 } }
      );

      res.redirect("/");
      await transport.sendMail({
        from: process.env.GMAIL_USER,
        // Send email to the address typed in "email (else)" textbox
        to: elseEmail,
        subject: "test email",
        html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <p>Your requested binder is ready to ship! But before we do so, please verify that the information below is correct! If any of the information is incorrect or missing, please email example@outmaine.com. </p>
            <p><strong>Email:</strong> ${elseEmail}</p>
            <p><strong>Phone number:</strong> ${numberElse}</p>
            <p><strong>Address:</strong> ${addressSelf}</p>
            <p>Binder Details</p>
            <p>Size: ${binderInventory.size}</p>
            <p>Color: ${binderInventory.color}</p>
            <p>Length: ${binderInventory.length}</p>
            <p>All the best, Shadman</p>
             </div >
          
        `,
      });
    }
  }
});

// post request for moving binder from "requested" to "shipped"
app.post("/confirmSent", async (req, res) => {});

//app.get for the fetch request
app.get("/inventory", async (req, res) => {
  //send the inventory, right now just called email test
  let allInventory = await BinderInventory.find({});
  res.send(allInventory);
});
app.get("/requests", async (req, res) => {
  let allRequests = await FormInput.find({});
  res.send(allRequests);
});

app.get("/waitlist", async (req, res) => {
  let waitlist = await waitListed.find({});
  res.send(waitlist);
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
