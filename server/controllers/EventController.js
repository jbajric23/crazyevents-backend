const Event = require('../models/Event');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");

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
    async getDummyEventsById(req, res) {
        const { id } = req.params;
        const events = loadDummyData();
        const event = events.find(e => String(e.id) === String(id));

        if (event) {
            res.json(event);
        } else {
            res.status(404).send('Event not found');
        }
    },
    async createDummyEvent(req, res) {
        const { title, description, location, address, category, creator, date, mainImageUrl } = req.body;
        const events = loadDummyData();
        // ID anpassen
        const newId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;

        const newEvent = new Event(newId, title, description, location, address, creator, date, category, mainImageUrl, 0);
        console.log('Creating new event:', newEvent);

        events.push(newEvent);

        res.status(201).json(newEvent); // Neues Event als JSON zurückgeben
    }

};