const jwt = require("jsonwebtoken");

module.exports = function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Kein Token übergeben" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token fehlt" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // ✅ notwendig!
        next();
    } catch (e) {
        return res.status(403).json({ error: "Ungültiger Token" });
    }
};