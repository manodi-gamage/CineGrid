/**
 * Component Architecture - CineGrid HomeScreen
 * 
 * Visual representation of component hierarchy and data flow
 */

/*
┌─────────────────────────────────────────────────────────────┐
│                        HomeScreen                           │
│  - Manages state (loading, error, movie data)              │
│  - Fetches data from TMDB API                              │
│  - Handles navigation                                       │
│  - Pull-to-refresh                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Header (Built-in)                                │    │
│  │  - Welcome message with user name                 │    │
│  │  - Search icon button                             │    │
│  │  - Profile icon button                            │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │  MovieCarousel                                     │    │
│  │  - Props: movies[], onMoviePress()                │    │
│  │  - Shows 5 trending movies                        │    │
│  │  - Full-width cards with backdrop images          │    │
│  │  - Pagination dots                                │    │
│  │  - Horizontal swipe                               │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │  CategorySection (Popular Movies)                  │    │
│  │  - Props: title, movies[], onMoviePress(),        │    │
│  │           onSeeAllPress()                          │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │  FlatList (Horizontal)                   │    │    │
│  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │    │    │
│  │  │  │ MC │ │ MC │ │ MC │ │ MC │ ...        │    │    │
│  │  │  └────┘ └────┘ └────┘ └────┘            │    │    │
│  │  │  MovieCard MovieCard MovieCard           │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │  CategorySection (Top Rated)                       │    │
│  │  [Same structure as above]                        │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │  CategorySection (Coming Soon)                     │    │
│  │  [Same structure as above]                        │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

COMPONENT DETAILS:

1. MovieCard
   ├── Image (poster)
   ├── Rating Badge (star + score)
   └── Text (title + year)

2. MovieCarousel
   ├── FlatList (horizontal, paging)
   │   └── Item
   │       ├── Image (backdrop)
   │       ├── LinearGradient (overlay)
   │       ├── Rating
   │       ├── Title
   │       ├── Overview
   │       └── Watch Now Button
   └── Pagination Dots

3. CategorySection
   ├── Header
   │   ├── Title Text
   │   └── See All Button
   └── FlatList (horizontal)
       └── MovieCard (repeated)

4. LoadingSpinner
   ├── ActivityIndicator
   └── Text (optional)

DATA FLOW:

  TMDB API
      ↓
  tmdbService.js
      ↓
  HomeScreen (useState)
      ↓
  ┌─────────────────────────┐
  │ trending: []            │
  │ popular: []             │
  │ topRated: []            │
  │ upcoming: []            │
  └─────────────────────────┘
      ↓
  Props to Components
      ↓
  ┌─────────────────────────────────────────┐
  │ MovieCarousel     ← trending[]          │
  │ CategorySection   ← popular[]           │
  │ CategorySection   ← topRated[]          │
  │ CategorySection   ← upcoming[]          │
  └─────────────────────────────────────────┘

NAVIGATION FLOW:

  User Action                →  Handler           →  Navigation
  ────────────────────────────────────────────────────────────
  Tap Movie Card             →  handleMoviePress  →  Details Screen (with movieId)
  Tap Search Icon            →  handleSearchPress →  Search Screen (TODO)
  Tap Profile Icon           →  handleProfilePress → Profile Screen
  Tap "See All"              →  handleSeeAll      →  CategoryList Screen (TODO)
  Pull Down                  →  onRefresh         →  Refetch all data

ERROR HANDLING:

  API Call Fails
      ↓
  catch (error)
      ↓
  setError(message)
      ↓
  Render Error UI
      ↓
  ┌─────────────────────────┐
  │  Error Icon             │
  │  Error Title            │
  │  Error Message          │
  │  [Retry Button]         │
  └─────────────────────────┘
      ↓
  User taps Retry
      ↓
  fetchMovies() again

PERFORMANCE OPTIMIZATIONS:

  ✓ Parallel API calls (Promise.all)
  ✓ FlatList virtualization
  ✓ Image lazy loading
  ✓ Minimal re-renders
  ✓ Efficient state updates
  ✓ Pull-to-refresh instead of auto-refresh

STYLING SYSTEM:

  colors.js (centralized)
      ↓
  Import in all components
      ↓
  Consistent theme:
  - background: #0A0A0B
  - cyan: #00FAFE
  - orange: #F2A33A
  - white: #FFFFFF
  - textSecondary: #A0A0A0
*/

export default {
  name: 'CineGrid Component Architecture',
  version: '1.0.0',
  description: 'Visual reference for HomeScreen component structure',
};
