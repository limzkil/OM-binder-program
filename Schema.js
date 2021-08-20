const mongoose = require("mongoose");

const CreateSchema = new mongoose.Schema({
  county: String,
  progSource: String,
  elseEmail: String,
  elsePhone: String,
  nameSelf: String,
  nameElse: String,
  dob: String,
  email: String,
  phone: String,
  address: {
    address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String
},
  size: String,
  length: String,
  color: String,
  willWait: Boolean,
  moreInfo: String,
  date: Date,
})

module.exports = CreateSchema
