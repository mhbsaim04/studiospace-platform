import { BadgeCheck, CalendarCheck, Clapperboard, Clock, Headset, Search, ShieldCheck, Wrench } from "lucide-react";

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

/** Section 1 (shared by home + how-it-works): the 4-step booking workflow. */
export const BOOKING_STEPS = [
  { icon: Search, title: "Discover Spaces", text: "Filter by category, price and city to shortlist rooms that fit your shoot." },
  { icon: Clock, title: "Select Shoot Hours", text: "Pick a date and time range. Live availability and the full price show before you commit." },
  { icon: CalendarCheck, title: "Book Instantly", text: "Send your request in one tap. Hosts confirm quickly and overlapping slots are blocked." },
  { icon: Clapperboard, title: "Create & Produce", text: "Arrive, plug in and roll. Download your invoice once the booking is confirmed." },
];

/** Section 2 (shared by home + how-it-works): platform assurances. */
export const PLATFORM_ASSURANCES = [
  { icon: ShieldCheck, title: "Liability protection", text: "Every confirmed booking is covered by our host and creator liability terms." },
  { icon: BadgeCheck, title: "Verified profiles", text: "Hosts and creators sign in with verified accounts, so you know who is on set." },
  { icon: Wrench, title: "Equipment safety", text: "Listed gear is inspected by hosts, and security deposits protect both sides." },
  { icon: Headset, title: "24/7 host support", text: "Real people answer booking questions at any hour, including pre-dawn call times." },
];

export const AMENITY_PRESETS = [
  "Wi-Fi", "Air conditioning", "Parking", "Green room", "Natural light", "Cyc wall", "Lighting grid",
  "Soundproofing", "Acoustic panels", "Coffee", "Changing room", "Power outlets",
];

export const TOKEN_ROUTE = "/api/token";
