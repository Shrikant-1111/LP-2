const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Event = require("./models/Event");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"));

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD_HASH;

// Admin Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email !== adminEmail ||
        !await bcrypt.compare(password, adminPassword)) {
        return res.status(401).json({ message: "Invalid Login" });
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

// Authentication Middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Invalid Token" });
    }
}

// Get Events
app.get("/events", verifyToken, async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

// Add Event
app.post("/events", verifyToken, async (req, res) => {
    const event = new Event(req.body);
    await event.save();
    res.json({ message: "Event Added Successfully" });
});

// Update Event
app.put("/events/:id", verifyToken, async (req, res) => {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Event Updated Successfully" });
});

// Delete Event
app.delete("/events/:id", verifyToken, async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event Deleted Successfully" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});