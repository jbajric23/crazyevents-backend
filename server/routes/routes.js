const EventController = require('../controllers/EventController');
const PosterController = require("../controllers/PosterController");

module.exports = (server) => {

    // Example route
    server.get('/', (req, res) => {
        res.send('Welcome to the CrazyEvents-Backend!');
    });

    server.get('/events', (req, res) => {
       EventController.getDummyEvents(req, res).then(r => {});
    });

    server.get('/event/:title', (req, res) => {
        EventController.getDummyEventsByTitle(req, res).then(r => {});
    })

    server.get('/posters', (req, res) => {
        PosterController.getDummyPosters(req, res).then(r => {});
    })

    server.get('/posters/toggle/:id', (req, res) => {
        PosterController.toggleFollowPoster(req, res).then(r => {});
    })
}
