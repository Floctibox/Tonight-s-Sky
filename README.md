# Tonight-s-Sky
Web project about Astronomie

Project Description
Tonight’s Sky is a simple web app that helps users understand what they can see in the night sky from their location. The user enters a city (or allows GPS), and the app shows what is visible, including the Moon, a few bright planets, and some constellations, with easy directions like south-east. The app also provides an Upcoming Events page (meteor showers, full moons, eclipses).

User interaction
The users can:
- Enter a city (or allow GPS) to get results for their location.
- View tonight’s visible objects (Moon / planets / constellations).
- Set simple alerts for upcoming events.

Data
This web site will works with the following main data types:
The User Location
   - City name (or GPS coordinates)
   - Country/region
   - Time zone
The Sky Objects
   - Object type: Moon / planet / constellation
   - Visibility status (visible or not)
   - Approximate time window
   - Simple direction
Astronomy Events
   - Event type: meteor shower / eclipse / full moon
   - Date and time
   - Where it can be seen

User-Specific Data (not sure)
   - Favorite locations
   - Saved objects
   - Notification preferences

Example 1 — Tonight result for a city
Location: Los Angeles, CA (USA)  
Date/Time: 2026-02-15 20:30

Tonight’s Sky:
- Moon: Visible, rising around 18:10, best viewing 19:00–02:00, direction: east → high
- Planet: Jupiter — Visible 19:30–03:30, direction: south-east, high
- Planet: Mars — Visible 20:00–01:00, direction: south, medium
- Constellation: Orion — Visible 20:00–23:30, direction: south-west, medium
- Constellation: Taurus — Visible 19:30–00:30, direction: west, high
- Constellation: Ursa Major (Big Dipper) — Visible 20:30–05:00, direction: north, medium

---

Example 2 — Upcoming events list
Upcoming Events:
- Full Moon — 2026-03-03 — Visible worldwide — “The Moon appears fully illuminated.”
- Meteor Shower (peak night) — 2026-04-22 — Best after midnight — “Lyrids meteor shower peak.”
- Eclipse — 2026-08-12 — Visibility depends on region — “Partial/total eclipse (region-specific).”

---

Example 3 — User saved data (favorites + preferences)
User Profile (example):
- Favorite locations:
  - “Home” — Paris, France
  - “Vacation” — Barcelona, Spain
- Saved objects:
  - Orion (constellation)
  - Jupiter (planet)
- Notification preference:
  - Alert me 1 day before major events
  - Alert me only if event is visible in my selected location

Reflection
It was easier than expected to describe the app in terms of user goals (“What can I see tonight?”) and to list the main data types. The hardest part was keeping the project simple while still being realistic, because astronomy data can become complex quickly (precise coordinates, atmospheric conditions, light pollution, etc.). Writing example data helped me reduce complexity and focus on beginner-friendly outputs like simple directions and visibility windows.

Open questions
- Where will the astronomy data come from (API, dataset, or manually curated sample data for MVP)?
- How accurate does the visibility information need to be for the course project?
- What is the simplest way to describe directions (N/E/S/W + “high/low”) without a compass feature?
