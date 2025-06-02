const Event = require('../models/Event');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");
// Implement mongoose connection

module.exports = {
    async getEvents(req, res) {
        try {
            const events = await Event.find();
            res.json(events);
        } catch (error) {
            console.error('Error while getting dummy events:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async getDummyEventsByTitle(req, res) {
        const { title } = req.params;
        const events = loadDummyData();
        const event = events.find(event => event.title.toLowerCase() === title.toLowerCase());
        if (event) {
            res.json(event); // Daten als JSON zurückgeben
        } else {
            res.status(404).send('Event not found');
        }
    },
    async getSingleEventById(req, res) {
        const { id } = req.params;
        const events = await Event.find();
        const event = events.find(e => String(e.id) === String(id));

        if (event) {
            res.json(event);
        } else {
            res.status(404).send('Event not found');
        }
    },
    async createEvent(req, res) {
        try {
            const { title, description, category, creator, date, location, address } = req.body;
            const event = new Event({
                title,
                description,
                category,
                creator,
                date,
                location,
                address,
                goingTo: []
            });
            await event.save();
            res.status(201).json(event);
        } catch (err) {
            console.error('Fehler beim Erstellen des Events:', err);
            console.log(err);
            res.status(500).json({ message: 'Serverfehler', error: err.message });
        }
    }

};