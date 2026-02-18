const { MongoClient } = require("mongodb");

const URL =
  "mongodb+srv://shreyasbakare388_db_user:gt3fqEVx0CujQHfb@cluster0.wcxgfwh.mongodb.net/?appName=Cluster0";

const DB_NAME = "smart_bill_manager";

let db;

async function connectDB() {
  const client = new MongoClient(URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB Atlas connected");
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };

