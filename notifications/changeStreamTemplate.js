const { MongoClient } = require("mongodb");

async function main() {
  //mongodb srv thing
  const uri = 'mongodb+srv://<binderapp1>:<process.env.SECRET>@test.ws3nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';;

  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    // Connect to the cluster
    await client.connect();

    //make your connection to the DB
    await functionDescription(client, 30000);

    //Pipeline acts like a filter to display only what you want. Without it, a console.log for example
    //will display everything
    const pipeline = [{
      '$match': {
          'operationType': 'insert',
      }
  }];
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

main().catch(console.error);

//add a function like "monitorpendingrequests". Reference the client, the amount of time we want it to open
async function functionDescription(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  //choose whatever db is needed plus the right collection
  const collection = client.db("Shipping").collection("waitListeds");

  const changeStream = collection.watch(pipeline);

  changeStream.on("change", (entry) => {
    console.log(`${entry.fullDocument.name.firstName}\n${entry.fullDocument.name.lastName}\n${entry.fullDocument.dateOfBirth}\n${entry.fullDocument.county}`)
  });

  await closeChangeStream(timeInMs, changeStream);
}

//close function. time refers to how long changestream should be active
function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing the change stream");
      changeStream.close();
      resolve();
    }, timeInMs);
  });
}




