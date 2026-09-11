# 🎒 Campus Lost & Found Management System

A minimal, responsive frontend for managing lost and found items on a university campus. Built with **React 19**, **Vite**, and plain CSS — no UI libraries, no backend wiring.

---

## ✨ Features

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, stats bar, quick-links, recent items, how-it-works |
| Report Lost | `/report-lost` | Form to report a lost item with sidebar tips |
| Report Found | `/report-found` | Form to report a found item with sidebar tips |
| Browse | `/browse` | Search + filter UI across Lost / Found / Matched tabs |
| Claims | `/claims` | Status cards for Pending / Approved / Rejected claims |
| Notifications | `/notifications` | Read/unread notification list with dismiss actions |
| Admin | `/admin` | Dashboard with stats, report tables, match & claim management |

### Reusable Components

```
src/components/
├── layout/
│   ├── Layout.jsx          # Outlet wrapper (Navbar + Footer)
│   ├── Navbar.jsx          # Sticky nav with responsive hamburger
│   └── Footer.jsx          # 3-column footer
└── ui/
    ├── Card.jsx            # Card, ItemCard, MatchCard, ClaimCard
    ├── Section.jsx         # Page section with title / subtitle / action
    ├── EmptyState.jsx      # Friendly empty-state placeholder
    └── LoadingPlaceholder.jsx  # Skeleton shimmer (card / row / text)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Install & run

```bash
# 1. Clone the repo
git clone https://github.com/your-org/campus-lost-found.git
cd campus-lost-found

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL when you have a backend

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

---

## 🗂 Project Structure

```
campus-lost-found/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── layout/          # Layout, Navbar, Footer
│   │   └── ui/              # Card, Section, EmptyState, LoadingPlaceholder
│   ├── data/
│   │   └── staticData.js    # Static demo data (no backend)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ReportLost.jsx
│   │   ├── ReportFound.jsx
│   │   ├── Browse.jsx
│   │   ├── Claims.jsx
│   │   ├── Notifications.jsx
│   │   └── Admin.jsx
│   ├── App.jsx              # Router configuration
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & CSS variables
├── .env.example             # Environment variable template
├── index.html
└── vite.config.js
```

---

## 🎨 Design Tokens

All colours, spacing, and radii are defined as CSS custom properties in `src/index.css`:

```css
--color-primary     /* #2563eb – blue  */
--color-lost        /* #dc2626 – red   */
--color-found       /* #16a34a – green */
--color-matched     /* #7c3aed – purple*/
--color-pending     /* #d97706 – amber */
```

---

## 🔧 Extending the Project

- **Connect a backend** – set `VITE_API_BASE_URL` in `.env` and replace static data imports with `fetch` / `axios` calls.
- **Add authentication** – insert an auth provider at the `BrowserRouter` level in `App.jsx` and add protected route wrappers.
- **Add a new page** – create `src/pages/MyPage.jsx`, import it in `App.jsx`, and add a `<Route>` inside the `<Layout>` route.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^19 | UI framework |
| react-dom | ^19 | DOM renderer |
| react-router-dom | ^7 | Client-side routing |
| vite | ^8 | Build tool & dev server |
| @vitejs/plugin-react | ^6 | React fast-refresh plugin |

No UI component libraries. No CSS frameworks. No backend dependencies.

---

## 📄 License

MIT
