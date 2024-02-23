//Import Mongo library and config from dataBase
const { MongoClient } = require("mongodb");
const config = require("./dataBase");

//Connection with DB
const client = new MongoClient(config.mongoURI);

//Batch for big inserts to DB
const batchSize = 100;

//Insert Items in DB
async function insertItem(newItems) {
  try {
    await client.connect();
    const database = client.db(config.options.dbName);
    //Collection name
    const collection = database.collection("ITEMS");

    //Insert by batch
    for (let i = 0; i < newItems.length; i += batchSize) {
      const batch = newItems.slice(i, i + batchSize);
      // Insert all items in the array
      const result = await collection.insertMany(batch);
      console.log(
        `${result.insertedCount} items inserted into the database`
      );
    }
  } finally {
    await client.close();
  }
}

module.exports = insertItem;
