const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

const Item = require('./model');

app.use(cors());

app.use(bodyParser.json());

//Connect to Mongo DB

mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true}, () => {

console.log('Connected to MongoDB…');

});

app.listen(9000);

// POST : save Item 

app.post('/savebinder', async(req, res) => {

const binder = new Item ({

size : req.body.size,

color : req.body.color,

length : req.body.length,

});

try {

const savedUser = await user.save()

res.json(savedUser);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});

// GET : show all binders

app.get('/binders', async(req, res) => {

try {

const findAll = await Item.find();

res.json(findAll);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});

// GET : find by ID

app.get('/binders/:binderId', async(req, res) => {

try {

const findById = await Item.findById(req.params.binderId);

res.json(findById);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});

// GET : find by ID

app.get('/binders/:binderId', async(req, res) => {

try {

const findById = await Item.findById(req.params.binderId);

res.json(findById);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});

// UPDATE : update by ID

app.patch('/binders/:binderId', async(req, res) => {

try {

const updateById = await Item.updateOne({ _id: req.params.binderId } , { $set : { Size : req.body.size} } );

res.json(updateById);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});

// DELETE : delete by ID

app.delete('/binders/:binderId', async(req, res) => {

try {

const deleteById = await Item.remove( { _id: req.params.binderId } );

res.json(deleteById);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});
