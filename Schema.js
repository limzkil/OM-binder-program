const mongoose = require("mongoose");

const CreateSchema = new mongoose.Schema({
  county: String,
  progSource: String,
  elseEmail: String,
  elsePhone: Number,
  nameSelf: String,
  nameElse: String,
  dob: String,
  email: String,
  phone: Number,
  address: {
    address1: String,
  address2: String,
  city: String,
  state: String,
  zip: Number
},
  size: String,
  length: String,
  color: String,
  willWait: Boolean,
  moreInfo: String,
  date: Date,
})

module.exports = CreateSchema
