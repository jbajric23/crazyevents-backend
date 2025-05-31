const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    location: String,
    address: String,
    creator: String,
    date: String,
    category: String,
    going: Number,
}, { collection: 'Events' });

module.exports = mongoose.model('Event', eventSchema);