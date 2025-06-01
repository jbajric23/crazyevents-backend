const EventController = require('../controllers/eventController');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require('express');

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
}