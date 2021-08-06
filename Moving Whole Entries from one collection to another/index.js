// Requiring module
const mongoose = require('mongoose');
  
// Importing models from model.js
const { WaitListed, ReadyToShip } = require('./model');
  
// Connecting to database
mongoose.connect('',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
  
// Finding a doc in the first collection by whatever
// field we need and move it to the desired collection
WaitListed.findOne({county: "BAMF"})
    .then(doc => {
        console.log(doc);

        // Inserting the doc in the destination collection
        ReadyToShip.insertMany([doc])
            .then(d => {
                console.log("New Entry Saved");
            })
            .catch(error => {
                console.log(error);
            })
  
        // Removing doc from the first collection
        WaitListed.deleteOne({ county: doc.county })
            .then(d => {
                console.log("Removed Old Entry")
            })
            .catch(error => {
                console.log(error);
            });
    })
    .catch(error => {
        console.log(error);
})
