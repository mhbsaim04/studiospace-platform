export const CATEGORIES = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"] as const;

export const CATEGORY_CARDS = [
  { label: "Photo Studios", value: "Photo Studio", blurb: "Cyc walls, daylight lofts and strobe-ready sets", icon: "camera" },
  { label: "Sound Stages", value: "Film Stage", blurb: "Soundproofed stages with grids and green screens", icon: "clapperboard" },
  { label: "Podcast Rooms", value: "Podcast Lounge", blurb: "Treated rooms with broadcast mics and cameras", icon: "mic" },
  { label: "Music Suites", value: "Music Suite", blurb: "Tracking rooms, vocal booths and producer desks", icon: "music" },
  { label: "Art Workshops", value: "Workshop", blurb: "Easels, pottery wheels and print presses", icon: "palette" },
] as const;

export const AMENITY_PRESETS = [
  "Wi-Fi", "Air conditioning", "Parking", "Green room", "Natural light", "Cyc wall", "Lighting grid",
  "Soundproofing", "Acoustic panels", "Coffee", "Changing room", "Power outlets",
];

export const TOKEN_ROUTE = "/api/token";
