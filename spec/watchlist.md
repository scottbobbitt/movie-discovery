# Watchlist Feature — Product Spec

## Overview
Allow users to save movies and TV shows to a personal watchlist that persists across browser sessions. No login required.

---

## Requirements

### Functional Requirements

| # | Requirement |
|---|-------------|
| 1 | User can add a movie or TV show to their watchlist |
| 2 | User can remove an item from their watchlist |
| 3 | Add/remove is accessible from the movie card (Home, Catalog pages) |
| 4 | Add/remove is accessible from the Detail page |
| 5 | A dedicated `/watchlist` page shows all saved items in a grid |
| 6 | A bookmark icon on each card indicates whether the item is saved |
| 7 | An empty state message is shown when the watchlist has no items |
| 8 | Watchlist persists across page refreshes and browser sessions |

### Non-Functional Requirements
- No new npm packages required — use existing stack only
- Works on mobile and desktop (consistent with existing responsive design)
- Consistent with existing dark/light theme support

---

## Design Approach

### State Management
Create a new Redux slice (`watchlistSlice`) with two actions:
- `addToWatchlist(movie)` — adds an IMovie item
- `removeFromWatchlist(id)` — removes by movie ID

On app load, the slice reads from `localStorage` to hydrate initial state.
On every change, the store subscribes and writes the updated list back to `localStorage`.

This mirrors how the existing theme is already persisted (see `src/context/themeContext.tsx`).

### Data Stored Per Item
Each watchlist item stores the `IMovie` shape already used throughout the app:
```ts
{
  id: string;
  poster_path: string;
  original_title: string;
  name: string;        // used for TV shows
  overview: string;
  backdrop_path: string;
  category: string;    // "movie" or "tv" — needed for routing
}
```

### New Files
| File | Purpose |
|------|---------|
| `src/store/watchlistSlice.ts` | Redux slice with add/remove actions and localStorage sync |
| `src/store/index.ts` | Standalone Redux store combining TMDB API + watchlist slice |
| `src/pages/Watchlist/index.tsx` | Watchlist page — grid of MovieCards + empty state |
| `src/common/WatchlistButton/index.tsx` | Reusable bookmark toggle button (filled vs outline icon) |

### Modified Files
| File | Change |
|------|--------|
| `src/constants/index.ts` | Add "Watchlist" entry to `navLinks` array |
| `src/App.tsx` | Add `/watchlist` route + lazy import |
| `src/main.tsx` | Wrap app in Redux `<Provider>` with new store |
| `src/common/MovieCard/index.tsx` | Add `WatchlistButton` overlay on poster hover |
| `src/pages/Detail/index.tsx` | Add `WatchlistButton` near title/overview |

---

## Tech Stack

No new dependencies. Everything needed is already installed:

| Need | Solution | Already in project? |
|------|----------|---------------------|
| Watchlist state | Redux Toolkit slice | Yes |
| Persistence | `localStorage` | Yes (used for theme) |
| New page/route | React Router v6 | Yes |
| Styling | Tailwind CSS | Yes |
| Bookmark icon | react-icons (`BsBookmark` / `BsBookmarkFill`) | Yes |

---

## Incremental Milestones (Test As You Go)

### Milestone 1 — State Layer
**Build:** `watchlistSlice.ts` + wire into store
**Test:** Open browser DevTools → Console → type `localStorage.getItem("watchlist")` → should return `null` initially. Add an item via Redux DevTools; confirm localStorage updates.

### Milestone 2 — Watchlist Page
**Build:** `/watchlist` route + empty page with nav link
**Test:** Click "Watchlist" in the nav bar → see the new page with an empty state message.

### Milestone 3 — Add/Remove from Movie Cards
**Build:** `WatchlistButton` component + integrate into `MovieCard`
**Test:** Hover over any movie card → bookmark icon appears. Click it → icon fills in. Navigate to `/watchlist` → movie appears in the grid. Click again → removed.

### Milestone 4 — Add/Remove from Detail Page
**Build:** Add `WatchlistButton` to the Detail page
**Test:** Open any movie or TV show detail page → bookmark button visible. Toggle it → check that the icon on the corresponding movie card (if visible) stays in sync. Refresh page → watchlist state is preserved.

---

## Out of Scope (for now)
- User accounts or cloud sync
- Sorting or filtering the watchlist
- Watchlist share links
- Move-to-watched tracking
