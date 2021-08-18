const mongoose = require("mongoose");
<<<<<<< HEAD

const CreateSchema = new mongoose.Schema({
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
  date: Date,
})

module.exports = CreateSchema
=======
 
        const CreateSchema = new mongoose.Schema({
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
          date: Date,
        })

        module.exports = CreateSchema
>>>>>>> 6ec96532da50a1a986b2f11b601e411239535b0f
