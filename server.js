const express = require('express')
require("dotenv").config
const app = express()
//setting up default port
const port = process.env.PORT || 5000
//Binding our server to a static directory
app.use(express.static("./public"))

//setting up mongo conncetion
const mongoose = require("mongoose")
const databaseAuthorization = process.env.SECRET
//set up path for connection, using .env for the password
const uri = `mongodb+srv://binderApp:${databaseAuthorization}@test.ws3nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
//connect to the db
mongoose.conncet(uri, {
    useNewURLParser: true,
    useUnifiedTopology: true
})
//var to refer to the database
const db = mongoose.connection



app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})