const mongoose = require('mongoose');

const BinderSchema = mongoose.Schema({
 
binderSize : String,

binderColor : String,

binderLength : String,

dateSaved: {

type: Date,

default: Date.now

}

});

module.exports = mongoose.model('inventorys', BinderSchema);