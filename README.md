<img width="1901" height="909" alt="image" src="https://github.com/user-attachments/assets/f962f842-4b37-4bdd-8d63-484679a62f82" />📍 Flowbit AOI Tool
Area of Interest Creation Tool — React + TypeScript + OpenLayers + Vite + Playwright
<p align="center"> <img src="https://img.shields.io/badge/React-18.0-blue?logo=react" /> <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" /> <img src="https://img.shields.io/badge/OpenLayers-7.4-green" /> <img src="https://img.shields.io/badge/TailwindCSS-3.0-38BDF8?logo=tailwindcss" /> <img src="https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite" /> <img src="https://img.shields.io/badge/Playwright-Testing-2C9?logo=playwright" /> </p>
📘 Overview

This project is a pixel-perfect implementation of the Flowbit Area of Interest Creation Tool, based on the supplied Figma design.

🔹 Built with React + TypeScript + Vite
🔹 Mapping engine via OpenLayers
🔹 AOI creation with polygon drawing, editing, cutting, freehand sketching
🔹 WMS aerial imagery from NRW (Germany)
🔹 Fully client-side, no backend required
🔹 Playwright E2E tests included
🔹 LocalStorage-based AOI persistence

📷 UI Preview

<img width="1901" height="909" alt="image" src="https://github.com/user-attachments/assets/2cef5980-5265-4317-b41b-71ba8f797af2" />
```
src/
├── components/
│   ├── AOIPanel.tsx
│   ├── MapToolbar.tsx
│   ├── MapContainer.tsx
│   ├── LeftNav.tsx
│   └── Topbar.tsx
├── state/
│   └── store.ts
├── utils/
│   └── wms.ts
└── pages/
    └── Home.tsx
```

🚀 Features

🗺️ Map

OSM + NRW WMS imagery
Smooth zoom & pan
Flash marker on search result

```
✏️ AOI Editing Tools
Tool	Description
🟧 Draw Polygon	Click to add vertices; double-click to finish
🟧 Freehand Draw	Sketch polygons quickly
🟦 Select	Multi-selection (independent shapes)
✏ Modify	Drag vertices
✂ Cut	Turf.js geometry difference
🗑 Delete AOI	Remove selected polygons
🔍 Search	Pan to city / address via Nominatim
💾 Save	Auto-saves to LocalStorage
```

🧱 Architecture
```
React (UI)
│
└── Zustand (global state)
     │
     └── OpenLayers (map + vector source)
         │
         ├── Draw / Modify / Select / Snap interactions
         ├── Turf.js geometry operations
         └── WMS + OSM layers
```

💡 Why this architecture?

React controls UI & state

OpenLayers controls geometry & map performance

Zustand stores only metadata, not geometry

Turf isolates expensive boolean operations


🛠️ Installation & Setup
```
1. Install dependencies
npm install

2. Start development server
npm run dev
```

Your app runs at:
```
👉 http://localhost:5173
```
🔍 Search Functionality

Search bar uses:

https://nominatim.openstreetmap.org/search

Returns:

Latitude

Longitude

Bounding box

Map animates smoothly to result and flashes a highlight circle.

💾 Persistence

AOIs persist automatically using:

localStorage["flowbit:aoi"]


Saved format is GeoJSON FeatureCollection.

📈 Performance Considerations

The app can scale up to thousands of AOIs because:

OpenLayers renders vectors using WebGL-accelerated pipelines

VectorSource reuses memory & avoids React rerenders

Turf operations happen only during cutting

LocalStorage caching avoids re-fetching data

Features do not enter React state (memory efficient)

🧪 Playwright Testing

Install browsers:
```
npx playwright install
```
Run tests:
```
npx playwright test
```
Included tests:
```
map-load.spec.ts — ensures map initializes

draw-polygon.spec.ts — simulates AOI creation
```
Example test:
```
test("map loads correctly", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.locator("canvas").first()).toBeVisible();
});
```

⚖️ Tradeoffs

Decision	Tradeoff
LocalStorage only	Limited to ~5MB; no syncing
Turf.js on client	Slower with >10,000 vertices
No backend	Cannot persist AOI across devices
OpenLayers	More complex API than Leaflet


🔐 Production Readiness Improvements

If this evolves to production:

Migrate AOIs to PostGIS backend

Use IndexedDB for large data sets

Add undo/redo stack

Add snapping grid + alignment guides

Use WebWorkers for heavy geometry ops

Improve mobile responsiveness

Add authentication (Flowbit login)

⏱️ Time Spent (Honest Breakdown)

Task	Time
```
Figma to React UI	3h
Map setup & WMS	1.5h
Drawing tools	3h
Cut/delete/modify	2h
Search implementation	1h
Persistence layer	1h
Playwright tests	1h
Documentation	1h
Polish & bugfixes	2h
Total	14.5 hours
```

🙌 Thanks

This project was built as part of the Flowbit Frontend Engineering Internship Assessment.

For any questions, feel free to contact me.
