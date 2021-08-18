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
  address: String,
  size: String,
  length: String,
  color: String,
  willWait: Boolean,
  moreInfo: String,
  date: Date,
})

module.exports = CreateSchema
