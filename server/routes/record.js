import express from "express";
import db from "../database/connection.js";
import { ObjectId } from "mongodb";
import { name } from "tar/lib/types.js";

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
    const newDocument = getFormBodyData(req.body);
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
