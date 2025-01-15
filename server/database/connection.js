import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

export const connectToMongoDB = async () => {
  if (!isConnected) {
    try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. Successfully connected to MongoDB!");
      isConnected = true;
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err; // Rethrow the error for the caller to handle
    }
  }
};

// Function to access a specific database
export const getDatabase = (dbName) => {
  if (!isConnected) {
    throw new Error("MongoDB client is not connected. Call connectToMongoDB first.");
  }
  return client.db(dbName);
};

export default client;
