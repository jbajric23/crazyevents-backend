const EventController = require('../controllers/eventController');

module.exports = (server) => {

    // Example route
    server.get('/', (req, res) => {
        res.send('Welcome to CrazyEvents-Backend!');
    });

    server.get('/events', (req, res) => {
       EventController.getDummyEvents(req, res).then(r => {});
    });

    server.get('/event/:id', (req, res) => {
        EventController.getDummyEventsById(req, res).then(r => {});
    })
}