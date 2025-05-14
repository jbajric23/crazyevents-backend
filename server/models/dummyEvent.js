class Event {
    constructor(id, title, description, location, address, creator, date, category, mainImageUrl = 'data/logo.png', going = 0) {
        this.id = id;
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
                '1',
                "Summer Festival für Faryal",
                "Ein buntes Open-Air-Konzert im Stadtpark",
                "Stadtpark",
                "iwo",
                "John Doe",
                "2025-06-21 18:00",
                "Music",
                "data/logo.png",
                12,
            ),
            new Event(
                '2',
                "Art Exhibition",
                "Zeitgenössische Kunstwerke ausstellen",
                "Museum der Moderne",
                "iwo",
                "Art Gallery",
                "2025-07-10 10:00",
                "Art",
                "data/logo.png",
                20,
            ),
            new Event(
                '3',
                "Tech Meetup",
                "Neueste Tech-Trends diskutieren",
                "Stadtpark",
                "iwo",
                "Tech Community",
                "2025-05-20 18:30",
                "Tech",
                "data/logo.png",
                30,
            ),
            new Event(
                '4',
                "Cooking Class",
                "Italienische Küche selbst zubereiten",
                "Stadtpark",
                "iwo",
                "Chef Anna",
                "2025-05-15 14:00",
                "Cooking",
                "data/logo.png",
                40,
            ),
            new Event(
                '5',
                "Vienna City Marathon",
                "Stadtmarathon für Hobby- und Profi-Läufer",
                "Stadtpark",
                "iwo",
                "Sports Club",
                "2025-09-01 09:00",
                "Sports",
                "data/logo.png",
                50,
            )
        ];
    }
}

module.exports = Event;
