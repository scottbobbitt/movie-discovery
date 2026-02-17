# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check with tsc, then build for production
npm run preview   # Preview the production build locally
```

There are no tests in this project.

## Environment Setup

A `.env` file is required at the project root (alongside `package.json`):

```
VITE_API_KEY=<tmdb-api-key>
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
```

Optional vars: `VITE_GA_MEASUREMENT_ID`, `VITE_GOOGLE_AD_CLIENT`, `VITE_GOOGLE_AD_SLOT`

## Architecture

### Provider Stack (`main.tsx`)
Providers wrap the app in this order (innermost first for relevance):
1. `ApiProvider` (RTK Query) — wraps the TMDB API client
2. `ThemeProvider` — dark/light/system theme, persisted to `localStorage`
3. `GlobalContextProvider` — video modal state and sidebar open/close
4. `LazyMotion` — Framer Motion feature bundle

### Data Fetching
All API calls go through RTK Query in `src/services/TMDB.ts`. Two endpoints:
- `useGetShowsQuery({ category, type, page })` — paginated lists (popular, top_rated, search, similar)
- `useGetShowQuery({ category, id })` — single item with `?append_to_response=videos,credits`

`category` is always `"movie"` or `"tv"`. These strings also form URL paths (e.g. `/movie/550`).

### Routing (`App.tsx`)
Routes are lazy-loaded. Order matters — the catch-all `/:category` must come after `/:category/:id`:
```
/                  → Home
/:category/:id     → Detail
/:category         → Catalog (movie or tv)
*                  → NotFound
```

### State & Context
- **RTK Query cache** — all remote data; no manual Redux reducers exist yet
- **GlobalContext** (`src/context/globalContext.tsx`) — `isModalOpen`, `videoId`, `showSidebar`
- **ThemeContext** (`src/context/themeContext.tsx`) — `theme` ("Dark"/"Light"), reads/writes `localStorage` via `saveTheme`/`getTheme` in `src/utils/helper.ts`

### Styling Conventions
- Tailwind CSS with `darkMode: "class"` — toggle by adding/removing `"dark"` on `document.documentElement`
- Custom design tokens in `tailwind.config.cjs`: `black: "#191624"`, `mainColor`, `secondaryColor`, custom fonts (`nunito`, `roboto`, `robotoCondensed`), breakpoint `xs: 380px`
- Shared Tailwind class strings live in `src/styles/index.ts` (e.g. `maxWidth`, `textColor`, `watchBtn`) — use these instead of duplicating classes
- Conditional class merging: always use `cn(...inputs)` from `src/utils/helper.ts` (wraps `clsx` + `tailwind-merge`)

### Path Alias
`@/` resolves to `src/` (configured in `vite.config.ts`). Use `@/` for all internal imports.

### Component Exports
All reusable components in `src/common/` are re-exported from `src/common/index.ts`. Import from `@/common`, not from individual component paths.

### Adding a New Page
1. Create `src/pages/YourPage/index.tsx`
2. Lazy-import it in `App.tsx`
3. Add a `<Route>` in the `<Routes>` block
4. Add a nav entry to the `navLinks` array in `src/constants/index.ts` (consumed by both `Header` and `SideBar`)

## Development Practices

### Testing
This project has no test runner configured. When adding new features, manually verify each milestone in the browser before moving on — don't build multiple layers at once and test them together. The `spec/watchlist.md` file defines the incremental milestones pattern to follow for new features.

### Commits
Write commits at each working milestone, not at the end of a feature. A good commit message states what changed and why, e.g. `add watchlistSlice with localStorage persistence` not `update files`. Keep commits small and focused so any milestone can be reverted cleanly.

### Following Existing Patterns
Before adding something new, check if the pattern already exists:
- **localStorage persistence** → follow `ThemeContext` (`saveTheme`/`getTheme` in `helper.ts`)
- **Global UI state** → add to `GlobalContext`, not a new context
- **Reusable components** → add to `src/common/` and export from `src/common/index.ts`
- **Shared Tailwind strings** → add to `src/styles/index.ts`, don't inline repeated class blocks
- **New constants** (nav links, sections) → add to `src/constants/index.ts`

### Code Quality
- Run `npm run build` before considering any feature done — it runs `tsc` and will catch type errors that the dev server silently ignores
- ESLint runs automatically during `npm run dev` via `vite-plugin-eslint`; fix lint errors before committing
- Don't add new npm packages without a clear reason — the existing stack covers routing, state, animation, styling, and icons
