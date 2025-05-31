const Poster = require('../models/dummyPosters');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");

function loadDummyData() {
    let events = [];

    try {
        posters = Poster.getDummyEvents();
    } catch (error) {
        console.error('Error while loading data:', error);
    }
    return posters;
}

posters = loadDummyData();

module.exports = {
    async getDummyPosters(req, res) {
        try {
            const posters = loadDummyData();
            res.json(posters); // Daten als JSON zurückgeben
        } catch (error) {
            console.error('Error while getting dummy events:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async toggleFollowPoster(req, res) {
        const { id } = req.params;
        //const posters = loadDummyData();
        const poster = posters.find(poster => poster.id === parseInt(id));
        if (poster) {
            poster.isFollowed = !poster.isFollowed;
            res.json(poster); // Daten als JSON zurückgeben
            console.log(`Poster with ID ${id} followed status toggled to ${poster.isFollowed}`);
        } else {
            res.status(404).send('Poster not found');
        }
    }
};