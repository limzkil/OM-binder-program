const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

const Binder = require("./Binder");
const { json } = require("body-parser");

app.use(cors());

app.use(bodyParser.json());

//Connect to Mongo DB

mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true}, () => {

console.log('Connected to MongoDB…');

});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000);

// POST : save Binder


app.post("/savebinder", async (req, res) => {
  const binder = Binder({
    binderSize: req.params.binderSize,

    binderColor: req.params.binderColor,

    binderLength: req.params.binderLength,
  });

  try {
    await binder.save();

    res.json(binder);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

// GET : show all binders

app.get("/binders", async (req, res) => {
  try {
    const findAll = await Binder.find();

    res.json(findAll);
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

// GET : find by ID

app.get("/binders/:binderId", async (req, res) => {
  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `findById` call.
    
    const findById = await Binder.find(req.params.binderId);

    res.json(findById)};
  } catch (err) {
    console.log("ERROR : " + res.json({ message: err }));
  }
});

// UPDATE : update by ID

app.patch("/binders/:binderId", async (req, res) => {
try {
  const updateById = await Binder.updateOne(
{ size: req.params.binderId },
{ $set: { size: req.body.binderSize } }
);
res.json(updateById)

} catch (err) {
console.log("ERROR : " + res.json({ message: err }));
}
});

// DELETE : delete by ID

app.delete("/binders/:binderId", async (req, res) => {
  try {
    const deleteById = await Binder.deleteOne({ _id: req.params.binderId });

res.json(deleteById);

} catch(err) {

console.log('ERROR : ' + res.json({message : err}));

}

});
