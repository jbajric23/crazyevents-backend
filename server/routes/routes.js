const EventController = require('../controllers/eventController');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require('express');
const Event = require('../models/Event');

module.exports = (server) => {

    // Example route
    server.get('/', (req, res) => {
        res.send('Welcome to the CrazyEvents-Backend!');
    });

    server.get('/events', (req, res) => {
       EventController.getEvents(req, res).then(r => {});
    });

    server.get('/event/:title', (req, res) => {
        EventController.getDummyEventsByTitle(req, res).then(r => {});
    })

    server.get('/events/:id', (req, res) => {
        EventController.getSingleEventById(req, res).then(r => {});
    });

    server.post('/event', (req, res) => {
        EventController.createDummyEvent(req, res).then(r => {});
    });

    /*****************************************************************
     * Poster routes
     *****************************************************************/

    server.post('/register', async (req, res) => {
        const { email, password } = req.body;

        try {
            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ message: "User exists" });

            const hash = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hash });
            await user.save();

            res.status(201).json({ message: "User created" });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    });

    server.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    });

    // Middleware zur JWT-Verifizierung
    const auth = (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch {
            res.status(403).json({ message: "Invalid token" });
        }
    };

    server.post('/events/:id/interest', auth, async (req, res) => {
        const userId = req.user.userId;
        const eventId = req.params.id;

        try {
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).json({ message: "Event not found" });

            const isGoing = event.goingTo.includes(userId);
            if (isGoing) {
                event.goingTo = event.goingTo.filter(id => id.toString() !== userId);
            } else {
                event.goingTo.push(userId);
            }

            await event.save();
            res.json({ message: isGoing ? "Interest removed" : "Interest marked", goingTo: event.goingTo });
        } catch (e) {
            res.status(500).json({ message: "Server error", error: e.message });
            console.error(e);
        }
    });
}