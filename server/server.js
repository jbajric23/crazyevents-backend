const express = require('express');
const server = express();
const port = 3000;

// Middleware for JSON-Parsing
server.use(express.json());

// Example route
server.get('/', (req, res) => {
    res.send('Welcome to CrazyEvents-Backend!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);
});