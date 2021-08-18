const mongoose = require('mongoose');

const BinderSchema = mongoose.Schema({
 
size : String,

color : String,

length : String,

quantity: String,

dateSaved: {

type: Date,

default: Date.now

}

});

module.exports = BinderSchema