const mongoose = require("mongoose");

const CreateSchema = new mongoose.Schema({
  county: String,
  progSource: String,
  firstBind: Boolean,
  emailElse: String,
  phoneElse: String,
  nameElse: String,
  nameSelf: String,
  dob: String,
  emailSelf: String,
  phoneSelf: String,
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
