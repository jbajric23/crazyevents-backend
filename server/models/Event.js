const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    mainImageUrl: String,
    creator: { // Poster-Infos
        id: mongoose.Schema.Types.ObjectId, // User-ID
        name: String,
    },
    goingTo: [mongoose.Schema.Types.ObjectId], // User-IDs, die teilnehmen
    date: String,
    location: String,
    address: String
}, { collection: 'Events' });

module.exports = mongoose.model('Event', eventSchema);

module.exports = mongoose.model('Event', eventSchema);