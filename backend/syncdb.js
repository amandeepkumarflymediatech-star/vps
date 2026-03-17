// sync-db.js

import { MongoClient } from "mongodb";

const LIVE_URI = "mongodb+srv://amandeepkumarflymediatech_db_user:wMP8AUOiRvYnxJJ3@cluster0.agbetrk.mongodb.net/?appName=Cluster0";
const LOCAL_URI = "mongodb://127.0.0.1:27017"; 
const LIVE_DB_NAME = "test";
const LOCAL_DB_NAME = "vps_admin_db";

async function syncDatabase() {
  const liveClient = new MongoClient(LIVE_URI);
  const localClient = new MongoClient(LOCAL_URI);

  try {
    console.log("Connecting to databases...");

    await liveClient.connect();
    await localClient.connect();

    const liveDb = liveClient.db(LIVE_DB_NAME);
    const localDb = localClient.db(LOCAL_DB_NAME);

    const collections = await liveDb.listCollections().toArray();

    console.log(`Found ${collections.length} collections`);

    for (const col of collections) {
      const collectionName = col.name;

      console.log(`Syncing collection: ${collectionName}`);

      const liveCollection = liveDb.collection(collectionName);
      const localCollection = localDb.collection(collectionName);

      // Fetch all data
      const data = await liveCollection.find({}).toArray();

      // Clear local collection
      await localCollection.deleteMany({});

      // Insert into local
      if (data.length > 0) {
        await localCollection.insertMany(data);
      }

      console.log(`✔ Synced: ${collectionName} (${data.length} records)`);
    }

    console.log("✅ Full database sync completed!");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  } finally {
    await liveClient.close();
    await localClient.close();
  }
}

syncDatabase();