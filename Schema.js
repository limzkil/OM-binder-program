const mongoose = require("mongoose");
 
        const CreateSchema = new mongoose.Schema({
        email: String,
          elseEmail: String,
          numberSelf: Number,
          numberElse: Number,
          address: String,
          county: String,
          nameSelf: String,
          nameElse: String,
          dob: Date,
          size: String,
          length: String,
          color: String
        })

        module.exports = mongoose.model('readytoships', CreateSchema);
