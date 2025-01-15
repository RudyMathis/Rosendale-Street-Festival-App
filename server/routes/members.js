import express from "express";
import client from "../database/connection.js"; // Import the MongoDB client
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all members
router.get("/", async (req, res) => {
    try {
        const db = client.db("employees"); // Access the "employees" database
        const collection = db.collection("members"); // Access the "members" collection
        const members = await collection.find({}).toArray(); // Fetch all members
        res.status(200).send(members);
    } catch (err) {
        console.error("Error fetching members:", err);
        res.status(500).send({ error: "Error fetching members" });
    }
});

// GET a single member by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract member ID from request parameters
        const db = client.db("employees");
        const collection = db.collection("members");
        const member = await collection.findOne({ _id: new ObjectId(id) }); // Find member by ID

        if (!member) {
        return res.status(404).send({ error: "Member not found" });
        }

        res.status(200).send(member);
    } catch (err) {
        console.error("Error fetching member by ID:", err);
        res.status(500).send({ error: "Error fetching member by ID" });
    }
});

// POST: Add a new member
router.post("/", async (req, res) => {
    try {
        const newMember = req.body;

        if (!newMember.name || !newMember.role || !newMember.password) {
            return res.status(400).send({ error: "Name, role, and password are required" });
        }

        const validRoles = ["member", "moderator", "admin"];
        if (!validRoles.includes(newMember.role)) {
            return res.status(400).send({ error: "Invalid role" });
        }

        const db = client.db("employees");
        const collection = db.collection("members");
        const result = await collection.insertOne(newMember);

        const insertedMember = { ...newMember, _id: result.insertedId };
        res.status(201).send(insertedMember);
    } catch (err) {
        console.error("Error adding member:", err);
        res.status(500).send({ error: "Error adding member" });
    }
});

// PATCH: Update a member by ID
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract member ID
        const updates = { $set: req.body }; // Prepare update data (e.g., name, role)

        const db = client.db("employees");
        const collection = db.collection("members");
        const result = await collection.updateOne({ _id: new ObjectId(id) }, updates);

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: "Member not found" });
        }

        const updatedMember = await collection.findOne({ _id: new ObjectId(id) }); // Fetch updated member
        res.status(200).send(updatedMember);
    } catch (err) {
        console.error("Error updating member:", err);
        res.status(500).send({ error: "Error updating member" });
    }
});

// DELETE: Remove a member by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const db = client.db("employees");
        const collection = db.collection("members");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: "Member not found" });
        }

        res.status(200).send({ message: "Member deleted successfully" });
    } catch (err) {
        console.error("Error deleting member:", err);
        res.status(500).send({ error: "Error deleting member" });
    }
});

export default router;
