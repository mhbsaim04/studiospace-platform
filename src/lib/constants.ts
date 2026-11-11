export const CATEGORIES = ["Photo Studio", "Video Production", "Podcast Lounge", "Design & Motion", "Workshop"] as const;

export const CATEGORY_CARDS = [
  { label: "Photo Studios", value: "Photo Studio", blurb: "Cyc walls, daylight lofts and strobe-ready sets", icon: "camera" },
  { label: "Video Production & Soundstages", value: "Video Production", blurb: "Large empty stages, cyc walls, green screens and LED-volume virtual production rooms", icon: "clapperboard" },
  { label: "Podcast Rooms", value: "Podcast Lounge", blurb: "Treated rooms with broadcast mics and cameras", icon: "mic" },
  { label: "Design & Motion Rooms", value: "Design & Motion", blurb: "Digital setups with design systems, 3D software and animation toolkits", icon: "shapes" },
  { label: "Art Workshops", value: "Workshop", blurb: "Easels, pottery wheels and print presses", icon: "palette" },
] as const;

/** Human-friendly plural for listings like the footer's "Popular categories". */
export const categoryPlural = (c: string) => (c === "Design & Motion" ? "Design & Motion Rooms" : `${c}s`);

export const AMENITY_PRESETS = [
  "Wi-Fi", "Air conditioning", "Parking", "Green room", "Natural light", "Cyc wall", "Lighting grid",
  "Soundproofing", "Acoustic panels", "Coffee", "Changing room", "Power outlets",
];

export const TOKEN_ROUTE = "/api/token";
