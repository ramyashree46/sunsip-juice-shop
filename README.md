# Sunsip — Fresh Squeezed Sunshine

A summer juice & ice-cream shop demo built with **React + Tailwind CSS**, AI-rendered imagery, and `localStorage`-backed persistence.

## Features

- Landing page with floating fruits, marquee, and AI-rendered hero collage
- Menu of 12 summer juices and 6 slow-churned ice creams (with prices, search, filter)
- Customer login + sign-up (email, contact number, password) — saved to `localStorage`
- Add-to-cart drawer with quantity controls
- Checkout modal that captures name, email, contact number, address — saves the order
- Admin login (demo password: `admin123`)
- Admin dashboard with stats, orders table, customers list, and JSON export
- Custom CSS animations: floating fruits, rising bubbles, gradient shift, pulse-glow, shimmer, marquee, slow-spin

## Run locally

```bash
npm install
npm start
```

Then open <http://localhost:3000> (or whichever port CRA picks).

## Where data is stored

All persistence is via `localStorage` on the user's device. Keys:

| Key | What |
|---|---|
| `sunsip_customers` | Account sign-ups (name, email, phone, password, timestamp) |
| `sunsip_orders` | Orders (id, items, total, customer details, timestamp) |
| `sunsip_cart` | Current cart (survives reload) |
| `sunsip_session` | Currently logged-in customer |
| `sunsip_admin` | Whether admin is signed in |

To reset: open DevTools → Application → Local Storage → clear those keys.

## AI imagery

Product images are generated on-the-fly by [Pollinations.ai](https://pollinations.ai) (no API key required). The corresponding fruit emoji shows underneath while the AI image loads, and remains as a graceful fallback if the network is unavailable.

## Tech

- React 18 (CRA)
- Tailwind CSS 3.4
- Lucide icons
- Pollinations.ai for AI images
- Custom CSS keyframe animations
