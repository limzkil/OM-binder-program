const express = require("express");
require("dotenv").config();
const app = express();
//setting up default port
const port = process.env.PORT || 5000;
//Binding our server to a static directory
const cors = require("cors");

const nodemailer = require("nodemailer");

app.use(express.json());
app.use(cors());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
//setting up mongo conncetion
const mongoose = require("mongoose");
const databaseAuthorization = process.env.SECRET;
//set up path for connection, using .env for the password
const uri = `mongodb+srv://binderapp1:${databaseAuthorization}@test.ws3nz.mongodb.net/Shipping?retryWrites=true&w=majority`;
//connect to the db
mongoose.connect(uri, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});
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
const FormInput = mongoose.model("readytoships", formSchema);

const binderSchema = new mongoose.Schema({
  size: String,
  length: String,
  color: String,
});
const BinderInventory = mongoose.model(`inventorys`, binderSchema);

const ProcessedInventory = mongoose.model('processedinventorys', binderSchema)

const waitListSchema = new mongoose.Schema({
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
  color: String
  })

const waitListed = mongoose.model('waitListeds', waitListSchema)

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


