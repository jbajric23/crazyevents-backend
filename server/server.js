const express = require('express');
const app = express(); // EINZIGE Instanz
const port = 3000;

require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

// Use Middleware
app.use(cors());
app.use(express.json());

// Static Image Delivery
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


// Optional: Log eingehende /uploads-Requests
app.use("/uploads", (req, res, next) => {
    console.log("GET /uploads" + req.url);
    next();
});

// 3️⃣ ROUTES
const registerRoutes = require('./routes/routes');
registerRoutes(app);  // ← app übergeben und verwenden

// 4️⃣ MONGODB + SERVER START
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB verbunden");
        app.listen(port, () => {
            console.log("Server läuft auf:");
            console.log(`- http://localhost:${port}`);
            console.log(`- http://10.0.2.2:${port} (für Emulator)`);

            const os = require('os');
            const addresses = Object.values(os.networkInterfaces())
                .flat()
                .filter(iface => iface.family === 'IPv4' && !iface.internal)
                .map(iface => iface.address);

            addresses.forEach(address =>
                console.log(`- http://${address}:${port}`));
        });
    })
    .catch(err => console.error("MongoDB-Fehler:", err));

