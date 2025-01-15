import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongoDB, getDatabase } from "../database/connection.js";

const router = express.Router();

// Utility to map request body to the form fields
const getFormBodyData = async (body) => {
  try {
    // Fetch the labels from the labels endpoint
    const labelsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/labels`);
    const labels = await labelsResponse.json();
    const fieldMappings = labels.record.fields;
    const formData = {};

    Object.keys(fieldMappings).forEach((key) => {
      formData[key] = body[key];
    });

    return formData;
  } catch (err) {
    console.error("Error fetching labels:", err);
    throw new Error("Error fetching labels");
  }
};

// Get all records
router.get("/", async (req, res) => {
  try {
    await connectToMongoDB();
    const db = getDatabase("bands");
    const collection = db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).send({ error: "Error fetching records" });
  }
});

// Get record by ID
router.get("/:id", async (req, res) => {
  try {
    await connectToMongoDB();
    const db = getDatabase("bands");
    const collection = db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).send({ error: "Record not found" });
    }
    res.status(200).send(result);
  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).send({ error: "Error fetching record" });
  }
});

// Create a new record
router.post("/", async (req, res) => {
  try {
    const newDocument = await getFormBodyData(req.body); // Get form data
    await connectToMongoDB();
    const db = getDatabase("bands");
    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).send({ error: "Error adding record" });
  }
});

// Update a record by ID
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = { $set: await getFormBodyData(req.body) }; // Get the updated data

    await connectToMongoDB();
    const db = getDatabase("bands");
    const collection = db.collection("records");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Record not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).send({ error: "Error updating record" });
  }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    await connectToMongoDB();
    const db = getDatabase("bands");
    const collection = db.collection("records");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Record not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).send({ error: "Error deleting record" });
  }
});

export default router;
