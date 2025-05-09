const Event = require('../models/dummyEvent');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");

// Dummy data for events
function loadDummyData(req, res) {
    let events = [];

    try {
        events = Event.getDummyEvents();
    } catch (error) {
        console.error('Error while loading data:', error);
    }
    return events;
}

module.exports = {
    async getDummyEvents(req, res) {
        try {
            const events = loadDummyData();
            res.json(events); // Daten als JSON zurückgeben
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
    }
};