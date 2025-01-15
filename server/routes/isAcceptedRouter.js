import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongoDB, getDatabase } from "../database/connection.js";

const router = express.Router();

// PATCH endpoint to update only isAccepted field
router.patch("/:id/isAccepted", async (req, res) => {
    try {
        const { id } = req.params;
        const { isAccepted } = req.body;

        // Validate the `isAccepted` field
        if (typeof isAccepted !== "boolean") {
            return res.status(400).send({ error: "Invalid value for isAccepted. It must be a boolean." });
        }

        // Ensure the MongoDB connection is established
        await connectToMongoDB();

        // Access the "bands" database and "records" collection
        const db = getDatabase("bands");
        const collection = db.collection("records");

        // Query to identify the record
        const query = { _id: new ObjectId(id) };

        // Update operation
        const updates = { $set: { isAccepted } };
        const result = await collection.updateOne(query, updates);

        // Handle the case where the record is not found
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: "Record not found" });
        }

        // Fetch the updated record
        const updatedRecord = await collection.findOne(query);

        // Respond with the updated record
        res.status(200).send(updatedRecord);
    } catch (err) {
        console.error("Error updating isAccepted:", err);
        res.status(500).send({ error: "Error updating isAccepted" });
    }
});

export default router;
