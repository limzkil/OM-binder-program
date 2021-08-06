const express = require("express");
require("dotenv").config();
const app = express();
//setting up default port
const port = process.env.PORT || 5000;
//Binding our server to a static directory
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
//setting up mongo conncetion
const mongoose = require("mongoose");
const databaseAuthorization = process.env.SECRET;
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
const formSchema = new mongoose.Schema({
  county: String,
  elseName: String,
  elseEmail:String,
  elsePhone: Number,
  name: String,
  dob: String,
  email: String,
  phone: Number, 
  address: String,
  size:String,
  length: String,
  color: String

});
const FormInput  = mongoose.model("request", formSchema);
const binderSchema = new mongoose.Schema({
  size: String,
  length: String,
  color: String
});
const BinderInventory = mongoose.model(`binder`, binderSchema);
app.post("/binders", async (req, res) => {
  console.log(req.body);
  let newEntry = Binders({
    size: req.body.binders,
  });
  await newEntry.save();
  res.redirect("/");
});

app.post("/", async (req, res) => {
  console.log(`I am the post`)
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
      elseEmail:req.body.elseEmail,
      elsePhone: req.body.elsePhone,
      name: req.body.name,
      dob: req.body.dob,
      email: req.body.email,
      phone: req.body.phone, 
      address: req.body.address,
      size:req.body.size,
      length: req.body.length,
      color: req.body.color
    });
    await newEntry.save();
    res.redirect("/");
  }
});
/* 
const cors = require("cors");

const nodemailer = require("nodemailer");


app.use(express.json());
app.use(cors());

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
}); */
//app.get for the fetch request
app.get("/inventory", async (req, res) => {
  //send the inventory, right now just called email test
  let allInventory = await FormInput.find({});

  res.send(allInventory);
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
