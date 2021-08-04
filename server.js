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
console.log(databaseAuthorization)
//set up path for connection, using .env for the password
const uri = `mongodb+srv://binderApp1:${databaseAuthorization}@test.ws3nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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

app.post("/", async (req, res) => {
    console.log(`Hel2l5552oz`)
    console.log(req.body.email)
   let newEntry = emailTest({
        email: req.body.email
    })
await newEntry.save()
res.redirect('/')
}) 



app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
