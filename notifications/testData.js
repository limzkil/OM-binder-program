const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const harryPotter = await createEntry(client, {
      county: "BAMF",
      dateOfBirth: "2/11/09",
      name: { firstName: "Harry", lastName: "Potter" },
      phoneNumber: 123456789,
      email: "emailsrus@emails.com",
      shippingAddress: {
        address1: "9876 St",
        address2: "Apt. 543",
        state: "Maine",
        city: "Rockland",
        zip: 210,
        country: "USA",
      },
      binderSize: "large",
      binderPreference: {
        length: 2,
        color: "blue",
        noPref: null,
      },
    });
    await deleteEntry(client, harryPotter)
  } 
  
  finally {
    await client.close();
  }
}

main().catch(console.error);

async function createEntry(client, newListing) {
  const result = await client
    .db("test")
    .collection("test")
    .insertOne(newListing);
  console.log(
    `New Entry Created with the following name: ${result.insertedId}`
  );
  return result.insertedId;
}

async function updateEntry(client, entryId, updatedListing) {
  const result = await client
    .db("test")
    .collection("test")
    .updateOne({ _id: entryId }, { $set: updatedListing });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function deleteEntry(client, entryId) {
  const result = await client
    .db("test")
    .collection("test")
    .deleteOne({ _id: entryId });

  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
