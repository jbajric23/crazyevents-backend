class Poster {
  constructor(id, name, description, imageUrl, category, isFollowed = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.category = category;
    this.isFollowed = isFollowed;
  }

  static getDummyEvents() {
    return [
      new Poster(
          1,
          "DJ Faryal",
          "Ein buntes Open-Air-Konzert im Stadtpark",
          "data/logo.png",
          "Music",
          false
      ),
      new Poster(
          2,
          "Pablo Picasso",
          "Zeitgenössische Kunstwerke ausstellen",
          "data/logo.png",
          "Art",
          true
      ),
      new Poster(
          3,
          "Technick",
          "Neueste Tech-Trends diskutieren",
          "data/logo.png",
          "Tech",
          false
      ),
      new Poster(
          4,
          "Pierre Bousquet",
          "Italienische Küche selbst zubereiten",
          "data/logo.png",
          "Cooking",
          true
      ),
    ];
  }
}

module.exports = Poster;
