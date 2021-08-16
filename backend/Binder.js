const mongoose = require('mongoose');

const BinderSchema = mongoose.Schema({
 
size : String,

color : String,

length : String,

dateSaved: {

type: Date,

default: Date.now

}

});

module.exports = mongoose.model('inventorys', BinderSchema);