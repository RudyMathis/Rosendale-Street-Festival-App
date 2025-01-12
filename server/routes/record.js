import express from "express";
import db from "../database/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Utility to map request body to the form fields
const getFormBodyData = async (body) => {
  // Fetch the labels from the labels endpoint
  const labelsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/labels`)
  const labels = await labelsResponse.json();
  const fieldMappings = labels.record.fields;
  const formData = {};

  Object.keys(fieldMappings).forEach((key) => {
      formData[key] = body[key];
  });

  return formData;
};

// Get all records
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
});

// Get record by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
});

// Create a new record
router.post("/", async (req, res) => {
  try {
    const newDocument = await getFormBodyData(req.body);
    const collection = await db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// Update a record by ID
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = { $set: getFormBodyData(req.body) };

    const collection = await db.collection("records");
    const result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("records");
    const result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
