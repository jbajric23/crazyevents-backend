const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    creator: { // Poster-Infos
        id: mongoose.Schema.Types.ObjectId, // User-ID
        name: String,
    },
    goingTo: [mongoose.Schema.Types.ObjectId], // User-IDs, die teilnehmen
    date: String,
    location: String,
    address: String,
    mainImageUrl: String,
    gallery: [String], // Array von Bild-URLs
}, { collection: 'Events' });

module.exports = mongoose.model('Event', eventSchema);

// module.exports = mongoose.model('Event', eventSchema);n