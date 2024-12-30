import express from "express";
import { ObjectId } from "mongodb";
import db from "../database/connection.js";

const router = express.Router();

// PATCH endpoint to update only isAccepted field
router.patch("/:id/isAccepted", async (req, res) => {
    try {
        const { id } = req.params;
        const { isAccepted } = req.body;

        if (typeof isAccepted !== "boolean") {
            return res.status(400).send("Invalid value for isAccepted");
        }

        const query = { _id: new ObjectId(id) };
        const updates = { $set: { isAccepted } };

        const collection = await db.collection("records");
        const result = await collection.updateOne(query, updates);

        if (result.matchedCount === 0) {
            return res.status(404).send("Record not found");
        }

        const updatedRecord = await collection.findOne(query); // Fetch updated record
        res.status(200).send(updatedRecord);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating isAccepted");
    }
});

export default router;
