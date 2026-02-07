# 🎬 Movie Website — React Technical Project

This project is a **production-ready React application** built as part of a **technical assessment**.  
It demonstrates clean architecture, advanced state management, and real-world frontend constraints handling using **React + Redux + Redux-Saga**.

The objective of this project is not only to display movies, but to showcase:
- Code quality & readability
- Thoughtful UX decisions
- Efficient API usage
- Keyboard-only navigation
- Performance and scalability awareness

---

## 🔍 What This Project Demonstrates

### ✅ Frontend Engineering Skills
- Component-based architecture
- Clear separation of concerns (UI / state / side effects)
- Predictable global state management with Redux
- Side-effect orchestration with Redux-Saga
- Controlled rendering & optimized API calls

### ✅ Real-World UX Constraints
- Keyboard-only navigation (no mouse scrolling)
- Debounced and rate-limited search
- Pagination handling
- Graceful loading & error states
- Local persistence with `localStorage`

---

## 🚀 Application Features

### 🏠 Movie Listing Page
- Displays **popular movies** by default
- Responsive layout (4 cards per row on desktop)
- Keyboard navigation using arrow keys
- Pagination for Popular & Airing Now categories

### 🔎 Search
- Search input with:
  - Minimum **2 characters**
  - **500ms debounce**
  - **Rate-limited to 5 requests per 10 seconds**
- Prevents unnecessary API calls and API abuse

### 🎛 Filters
- Popular
- Airing Now
- My Favorites (stored locally)
- Filter requests are triggered:
  - Immediately on click
  - Or after **2 seconds on focus**

### ⭐ Favorites
- Add / remove movies from favorites
- Persisted using `localStorage`
- No backend required

### 📄 Movie Details Page
- Opens in the same tab
- Displays poster, rating, release date, overview
- Keyboard shortcuts:
  - `Enter` → add/remove favorite
  - `Escape` → go back

---

## ⌨️ Accessibility & Navigation

- Arrow keys for navigation
- Enter to select
- Escape to return
- Tab key disabled
- Mouse scrolling disabled (`overflow: hidden`)
- Fully usable **without a mouse**

---

## 🧠 Tech Stack

- **React**
- **Redux**
- **Redux-Saga**
- **React Router**
- **TMDB API**
- **Netlify (deployment)**

---

## 🔑 TMDB API Key (Required)

This project uses **The Movie Database (TMDB) API** to fetch movie data.

Without a valid API key, the application **will not display any movies**.

---

### 📍 How to Configure the API Key (Local Development)

1. Create a `.env` file at the **root of the project**
2. Add the following line:

```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
