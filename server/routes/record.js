import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongoDB, getDatabase } from "../database/connection.js";

const router = express.Router();

// Utility to map request body to the form fields

const getFormBodyData = (body) => ({
  name: body.name,
  email: body.email,
  level: body.level,
  committeNotes: body.committeNotes,
  members: body.members,
  hudsonValley: body.hudsonValley,
  summary: body.summary,
  genre: body.genre,
  link: body.link,
  dates: body.dates,
  anotherGig: body.anotherGig,
  gigIfYes: body.gigIfYes,
  shirtSizeXS: body.shirtSizeXS,
  shirtSizeS: body.shirtSizeS,
  shirtSizeM: body.shirtSizeM,
  shirtSizeL: body.shirtSizeL,
  shirtSizeXL: body.shirtSizeXL,
  shirtSizeXXL: body.shirtSizeXXL,
  primaryContact: body.primaryContact,
  primaryEmail: body.primaryEmail,
  primaryPhone: body.primaryPhone,
  primaryAddress: body.primaryAddress,
  secondaryContact: body.secondaryContact,
  secondaryEmail: body.secondaryEmail,
  secondaryPhone: body.secondaryPhone,
  isNewToStreeFest: body.isNewToStreeFest,
  isWillingToFundraise: body.isWillingToFundraise,
  anythingElse: body.anythingElse,
  isAccepted: body.isAccepted,
  nameOfUser: body.nameOfUser,
  editedTime: body.editedTime,
});

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

// Create a new record(s)
router.post("/", async (req, res) => {
  try {
    let records = req.body;

    // If the body is a single record, process it using getFormBodyData
    if (!Array.isArray(records)) {
      records = [getFormBodyData(records)];  // Convert to an array after processing
    } else {
      // If it's an array, process each record
      records = records.map(record => getFormBodyData(record));
    }

    await connectToMongoDB();
    const db = getDatabase("bands");
    const collection = db.collection("records");

    let result;
    if (records.length > 1) {
      result = await collection.insertMany(records);
    } else {
      result = await collection.insertOne(records[0]);
    }

    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding records:", err);
    res.status(500).send({ error: "Error adding records" });
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
