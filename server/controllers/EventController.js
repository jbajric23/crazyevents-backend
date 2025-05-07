const { Events } = require('../models/dummyEvent');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");

// Dummy data for events
function loadDummyData(req, res) {
    const eventsFilePath = join(__dirname, '../data/dummyEvents.json');
    let events = [];

    try {
        const data = readFileSync(eventsFilePath, 'utf8');
        events = JSON.parse(data);
    } catch (error) {
        console.error('Error while loading data:', error);
    }
    return events;
}

module.exports = {
    async getDummyEvents(req, res) {
        try {
            res.send(loadDummyData());
        } catch (error) {
            console.error('Error while getting dummy events:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async getDummyEventsById(req, res) {
        const { id } = req.params;
        const events = loadDummyData();
        const event = events.find(event => event.id === parseInt(id));
        if (event) {
            res.send(event);
        } else {
            res.status(404).send('Event not found');
        }
    }
};