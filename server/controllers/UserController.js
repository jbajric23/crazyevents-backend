const User = require("../models/User");

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name und E-Mail erforderlich" });
    }

    try {
        if (req.user.userId !== id) {
            console.log(req.user.id + " versucht, Benutzer " + id + " zu aktualisieren");
            return res.status(403).json({ error: "Nicht erlaubt" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true, select: "-password" }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Update-Fehler:", err);
        res.status(500).json({ error: "Serverfehler" });
    }
};
