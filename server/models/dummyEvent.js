class Event {
    constructor(title, description, location, address, creator, date, category, mainImageUrl = 'data/logo.png', going = 0) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.address = address;
        this.creator = creator;
        this.date = date;
        this.category = category;
        this.going = going;
    }

    static getDummyEvents() {
        return [
            new Event(
                "Summer Festival",
                "Ein buntes Open-Air-Konzert im Stadtpark",
                "Stadtpark",
                "iwo",
                "John Doe",
                "2025-06-21 18:00",
                "Music"
            ),
            new Event(
                "Art Exhibition",
                "Zeitgenössische Kunstwerke ausstellen",
                "Stadtpark",
                "iwo",
                "Art Gallery",
                "2025-07-10 10:00",
                "Art"
            ),
            new Event(
                "Tech Meetup",
                "Neueste Tech-Trends diskutieren",
                "Stadtpark",
                "iwo",
                "Tech Community",
                "2025-05-20 18:30",
                "Tech"
            ),
            new Event(
                "Cooking Class",
                "Italienische Küche selbst zubereiten",
                "Stadtpark",
                "iwo",
                "Chef Anna",
                "2025-05-15 14:00",
                "Cooking"
            ),
            new Event(
                "Vienna City Marathon",
                "Stadtmarathon für Hobby- und Profi-Läufer",
                "Stadtpark",
                "iwo",
                "Sports Club",
                "2025-09-01 09:00",
                "Sports"
            )
        ];
    }
}

module.exports = Event;