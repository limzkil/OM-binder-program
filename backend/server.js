const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

const Binder = require("./Binder");
const { json } = require("body-parser");

app.use(cors());

app.use(bodyParser.json());


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connect to Mongo DB

mongoose.connect(
  "mongodb+srv://binderapp1:binderapp12345@test.ws3nz.mongodb.net/Shipping?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB…");
  }
);

app.listen(3000);

// POST : save Binder


app.post("/savebinder", async (req, res) => {
  const binder = new Binder({
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

app.get("/binders/:binderIds", async (req, res) => {
 const ObjectId = mongoose.Types.ObjectId
    var search={"_id": new ObjectId(req.query.where)};
    const locate= Binder.find(search)
    console.log(locate)
;
});

// UPDATE : update by ID

app.patch("/binders/update", async (req, res) => {
try {
  const ObjectId = mongoose.Types.ObjectId
  const updateById = await Binder.updateOne(
{ _id: req.params.ObjectId },
{ $set: { size: req.body.size } }
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
