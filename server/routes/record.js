import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongoDB, getDatabase } from "../database/connection.js";

const router = express.Router();

// Utility to map request body to the form fields
// const getFormBodyData = async (body) => {
//   try {
//     // Fetch the labels from the labels endpoint
//     const labelsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/labels`);
//     const labels = await labelsResponse.json();
//     const fieldMappings = labels.record;
//     const formData = {};

//     Object.keys(fieldMappings).forEach((key) => {
//       formData[key] = body[key];
//     });

//     return formData;
//   } catch (err) {
//     console.error("Error fetching labels:", err);
//     throw new Error("Error fetching labels");
//   }
// };
// const getFormBodyData = async (body) => {
//   try {
//     const baseUrl = process.env.API_BASE_URL || "http://localhost:5050";
//     const labelsResponse = await fetch(`${baseUrl}/labels`);
//     const labels = await labelsResponse.json();

//     if (!labels || !labels.record) {
//       throw new Error("Invalid labels structure");
//     }

//     const fieldMappings = labels.record;
//     const formData = {};

//     // Iterate over each field mapping to ensure only one entry per field
//     Object.entries(fieldMappings).forEach(([dbKey, formKey]) => {
//       if (body[formKey] !== undefined) {
//         formData[dbKey] = body[formKey];
//       }
//     });

//     console.log("Mapped form data:", formData);
//     return formData;
//   } catch (err) {
//     console.error("Error in getFormBodyData:", err.message);
//     throw new Error("Failed to process form data");
//   }
// };

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

// router.post("/", async (req, res) => {
//   try {
//     console.log("Incoming request body:", req.body);

//     // Fetch and log the labels
//     const newDocument = await getFormBodyData(req.body);
//     console.log("Mapped document to insert:", newDocument);

//     // Log database connection status
//     await connectToMongoDB();
//     console.log("Connected to MongoDB");

//     const db = getDatabase("bands");
//     const collection = db.collection("records");

//     // Attempt insertion and log the result
//     const result = await collection.insertOne(newDocument);
//     console.log("Insert result:", result);

//     res.status(201).send(result);
//   } catch (err) {
//     console.error("Error adding record:", err);
//     res.status(500).send({ error: err.message || "Error adding record" });
//   }
// });


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
