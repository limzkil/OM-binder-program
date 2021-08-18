const mongoose = require('mongoose');

const BinderSchema = mongoose.Schema({
 
size : String,

color : String,

length : String,

quantity: Number,

dateSaved: {

type: Date,

default: Date.now

}

});

module.exports = BinderSchema