const EventController = require('../controllers/EventController');
const FollowController = require('../controllers/FollowController');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require('../models/Event');
const { createEvent } = require('../controllers/EventController');
const Follow = require('../models/Follow');
const middleware = require("../middleware/middleware");
const userController = require('../controllers/UserController');
const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Speichere mit korrekter Dateiendung
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // z. B. ".jpg"
        cb(null, uuidv4() + ext);
    },
});
const upload = multer({ storage });


module.exports = (server) => {

    // Example route
    server.get('/', (req, res) => {
        res.send('Welcome to the CrazyEvents-Backend!');
    });

    server.get('/events', (req, res) => {
       EventController.getEvents(req, res).then(r => {});
    });

    server.get('/myevents/:id', (req, res) => {
       EventController.getMyEvents(req, res).then(r => {});
    });

    server.get('/event/:title', (req, res) => {
        EventController.getDummyEventsByTitle(req, res).then(r => {});
    })

    server.get('/events/:id', (req, res) => {
        EventController.getSingleEventById(req, res).then(r => {});
    });

    server.post('/event', createEvent);

    server.post('/register', async (req, res) => {
        const { name, email, password } = req.body;

        try {
            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ message: "User exists" });

            const hash = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hash });
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
            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
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

    // Going to
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

    server.get('/posters', (req, res) => {
       FollowController.getAllUsers(req, res).then(r => {});
    });

    server.get('/posters/:id', (req, res) => {
       FollowController.getUsers(req, res).then(r => {});
    });

    server.get('/posters/toggle/:fid/:uid', (req, res) => {
       FollowController.updateToggle(req, res).then(r => {});       
    });

    server.put("/users/:id", middleware, userController.updateUser)

    server.get('/posters/follow/:fid/:uid', (req, res) => {
       FollowController.isFollow(req, res).then(r => {});       
    });

    server.put("/events/:id/images", middleware, upload.array("images", 5), async (req, res) => {
        try {
            const eventId = req.params.id;
            const files = req.files;
            const baseUrl = "http://10.0.2.2:3000";

            if (!files || files.length === 0) {
                return res.status(400).json({ error: "Keine Bilder hochgeladen" });
            }

            // Erzeuge URLs aus gespeicherten Dateinamen
            const imageUrls = files.map(file => `${baseUrl}/uploads/${file.filename}`);

            const event = await Event.findByIdAndUpdate(
                eventId,
                {
                    $set: { mainImageUrl: imageUrls[0] },
                    $push: { gallery: { $each: imageUrls.slice(1) } },
                },
                { new: true }
            );

            res.json(event);
        } catch (err) {
            console.error("Bild-Upload-Fehler:", err);
            res.status(500).json({ error: "Serverfehler beim Hochladen der Bilder" });
        }
    });

    server.put("/events/:id/gallery", middleware, upload.array("images", 5), async (req, res) => {
        const eventId = req.params.id;
        const files = req.files;

        const baseUrl = "http://10.0.2.2:3000";
        const imageUrls = files.map(file => `${baseUrl}/uploads/${file.filename}`);

        try {
            const event = await Event.findByIdAndUpdate(
                eventId,
                { $push: { gallery: { $each: imageUrls } } },
                { new: true }
            );
            res.json(event);
        } catch (err) {
            res.status(500).json({ error: "Fehler beim Upload der Galerie-Bilder." });
        }
    });


    server.get("/events/:id", async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: "Event nicht gefunden" });
            }
            res.json(event);
        } catch (err) {
            console.error("GET /events/:id Fehler:", err);
            res.status(500).json({ error: "Serverfehler" });
        }
    });


}