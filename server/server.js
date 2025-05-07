const express = require('express');
const server = express();
const port = 3000;

// Middleware for JSON-Parsing
server.use(express.json());

// Use routes
const routes = require('./routes/routes')(server);

// Start the server
server.listen(port, () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];

    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    console.log(`Server running on:`);
    // Or Try Emulator IP address: 10.0.2.2
    console.log(`- http://localhost:${port}`);
    addresses.forEach((address) => {
        console.log(`- http://${address}:${port}`);
    });
});