// Requiring module
const mongoose = require("mongoose");

// Defining waitListed schema
const waitlistedSchema = new mongoose.Schema({
  _id: String,
  county: String,
  self: Boolean,
  else: Boolean,
  pickup: Boolean,
  dateOfBirth: Date,
  name: { firstName: String, lastName: String },
  phoneNumber: Number,
  email: String,
  shippingAddress: {
    address1: String,
    address2: String,
    state: String,
    city: String,
    zip: Number,
    country: String,
  },
  binderPreference: {
    binderSize: String,
    length: String,
    color: String,
    noPref: Boolean,
  },
});

// Defining readyToBeShipped schema
const readytoshipSchema = new mongoose.Schema({
  _id: String,
  county: String,
  self: Boolean,
  else: Boolean,
  pickup: Boolean,
  dateOfBirth: Date,
  name: { firstName: String, lastName: String },
  phoneNumber: Number,
  email: String,
  shippingAddress: {
    address1: String,
    address2: String,
    state: String,
    city: String,
    zip: Number,
    country: String,
  },
  binderPreference: {
    binderSize: String,
    length: String,
    color: String,
    noPref: Boolean,
  },
});

// Creating model for both schemas
const WaitListed = mongoose.model("WaitListed", waitlistedSchema, "waitListeds");
const ReadyToShip = mongoose.model("ReadyToShip", readytoshipSchema, "readyToShips");

// Exporting our modals
module.exports = {
  WaitListed,
  ReadyToShip,
};
