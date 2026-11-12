# StudioSpace — Creative Studio Sharing Platform's Full-stack Website

**StudioSpace** is a peer-to-peer marketplace that turns idle creative spaces into working studios. Hosts list their rooms (photo studios, sound stages, podcast lounges, design suites, workshops), set their own rates and approve every booking request — while creators discover spaces, check live availability and book the exact hours they need, with transparent pricing on every listing.

> 🔗 **Live site:** `https://studiospace-marketplace-7r7l0juj2.vercel.app/` 



## ✨ Features

- **Explore & discover studios** — searchable, filterable, sortable grid (category, price cap, newest/top-rated/price sorting) with pagination and a curated "featured studios" strip on the home page
- **Hourly booking with live availability** — pick a date, see confirmed slots in real time, and get instant conflict detection that prevents double-bookings (overlap-aware, server-enforced)
- **Full host workflow** — list a new studio in minutes (image + gallery uploads via imgbb), edit or delete your listings, and manage incoming booking requests with a clean status flow (`Pending → Confirmed → Completed / Cancelled`)
- **Wishlist & personal dashboards** — save favorite studios with one tap, view reservations you made vs. requests you host in separate tabs, and track listings, earnings and pending requests in the stats dashboard
- **Ratings & reviews** — one verified review per user per studio with average rating recalculated server-side; hosts can't review their own studios
- **Secure authentication** — Better Auth with MongoDB: email/password **and** Google OAuth, HTTPOnly session cookies, JWT-verified API access and a cookie-cache for fast session reads
- **Cinematic dark UI** — smoky-black theme with a gold brand palette, vertical hero slider (Ken Burns zoom, viewfinder frame, REC tally), scroll-reveal animations, glassy navigation, and full mobile responsiveness
- **Real-time form feedback** — password strength meter, inline validation, toast notifications (sonner) and skeleton/loading states throughout

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | **Next.js 16** (App Router, Turbopack), **React 19** (React Compiler enabled) |
| Styling | **Tailwind CSS v4**, **shadcn/ui** components, **lucide-react** icons, **sonner** toasts |
| Sliders | **Swiper** (hero slider), **Embla Carousel** (studio gallery) |
| Auth | **Better Auth** (MongoDB adapter) — email/password + Google OAuth, JWT plugin, session cookie cache |
| Backend API | **Express 5** (Node.js) — sibling repo `studiospace-backend-server`, JWT/cookie-verified routes |
| Database | **MongoDB Atlas** (db: `studiospace`) |
| Media | **imgbb** API for studio image & gallery uploads |

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas connection string (free tier works)
- Google OAuth credentials (optional — email/password sign-in works without them)





## 🧪 Examiner Test Credentials

Use this pre-registered account to explore the platform as a regular user (book studios, save wishlists, review studios — and list/host your own space from the same account):

| | |
|---|---|
| **Email** | `examiner@studiospace.com`|
| **Password** | `Examiner@123`|



## 📄 License

Built as an educational project — free to use and adapt.
