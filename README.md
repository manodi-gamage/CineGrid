# CineGRID - Your Personal Movie Companion

A feature-rich React Native mobile application built with Expo that helps users discover, explore, and manage their favorite movies. Powered by The Movie Database (TMDB) API.

![React Native](https://img.shields.io/badge/React%20Native-0.71-blue)
![Expo](https://img.shields.io/badge/Expo-~49.0.0-black)
![License](https://img.shields.io/badge/License-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Features

- **User Authentication** - Secure login and registration with JWT token management
- **Movie Discovery** - Browse trending, popular, top-rated, and upcoming movies
- **Smart Search** - Real-time movie search with debouncing and recent searches
- **Genre Filtering** - Explore movies by 19 different genres (Action, Comedy, Horror, Drama, etc.)
- **Favorites & Watchlist** - Save and manage your favorite movies with persistent storage
- **Movie Details** - View complete information including cast, trailers, ratings, and similar movies
- **Dark/Light Mode** - Toggle between themes with persistent user preference
- **User Profile** - Track viewing statistics and manage account settings
- **Onboarding Flow** - Smooth first-time user experience with interactive slides
- **Offline Support** - Persistent data storage with AsyncStorage
- **Pull-to-Refresh** - Update content across all screens
- **Infinite Scroll** - Seamless pagination for large movie lists
- **Error Handling** - Comprehensive error boundaries and network error management
- **Loading States** - Skeleton screens and loading indicators for better UX

## Tech Stack

### Core Technologies
- **Framework:** React Native with Expo
- **Language:** JavaScript
- **UI Library:** React Native Core Components
- **Navigation:** React Navigation v6
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **API:** The Movie Database (TMDB) API v3

### Key Libraries
- `@react-navigation/native` - Navigation solution
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `react-native-safe-area-context` - Safe area handling
- `axios` - HTTP requests
- `@react-native-async-storage/async-storage` - Local data persistence

## Screenshots

[Add your app screenshots here]

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn package manager
- Expo CLI (install globally: `npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)
- TMDB API Key ([Register here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cinegrid.git
cd cinegrid
```

2. Install dependencies
```bash
npm install
```
or if you use yarn:
```bash
yarn install
```

3. Create a `.env` file in the root directory
```bash
touch .env
```

4. Add your TMDB API key to the `.env` file
```env
TMDB_API_KEY=your_api_key_here
```

5. Configure babel for environment variables (if not already configured)

Update `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ],
  };
};
```

6. Start the development server
```bash
npx expo start
```

7. Run the app
- Scan the QR code with Expo Go app (Android/iOS)
- Press `a` to open Android emulator
- Press `i` to open iOS simulator
- Press `w` to open in web browser

### Test Credentials

For testing the authentication flow, use these TMDB dummy credentials:
```
Username: emilys
Password: emilyspass
```



## Key Features

### Authentication System
- Secure login with username and password
- User registration flow (simulated with TMDB API)
- JWT token management and storage
- Automatic token refresh
- Persistent authentication state
- Secure logout functionality
- Protected routes and navigation guards

### Movie Discovery
- **Trending Movies:** Daily and weekly trending content
- **Popular Movies:** Most popular movies with pagination
- **Top Rated:** Highest-rated movies of all time
- **Upcoming Releases:** Movies coming soon to theaters
- **Now Playing:** Currently showing in theaters
- Infinite scroll with automatic pagination
- Pull-to-refresh on all movie lists

### Search Functionality
- Real-time search with 500ms debounce
- Recent searches history (up to 10 searches)
- Search results with pagination
- Clear search and individual history deletion
- Empty state for no results
- Network error handling with retry

### Genre-Based Filtering
- 19 movie genres available
- Action, Adventure, Animation, Comedy, Crime, Documentary
- Drama, Family, Fantasy, History, Horror, Music
- Mystery, Romance, Science Fiction, TV Movie, Thriller, War, Western
- Color-coded genre cards with emojis
- Filter movies by single or multiple genres
- Sort by popularity, rating, or release date

### Favorites Management
- Add/remove movies to favorites with single tap
- Persistent storage across app sessions
- View all favorites in grid layout
- Swipe to delete from favorites
- Empty state with call-to-action
- Sync favorites with user profile statistics

### Movie Details Page
- Complete movie information (title, overview, runtime, rating)
- Release date and production details
- Cast and crew information with photos
- YouTube trailers and teasers
- Similar movie recommendations
- Genre tags and rating badges
- Add to favorites directly from details
- Navigate to cast member details (future)

### User Profile
- User statistics (favorites count, movies watched)
- Account information display
- Theme toggle (dark/light mode)
- Preferences management
- Settings and privacy options
- About section with app information
- Logout with confirmation dialog

### Theme System
- Dark mode (default)
- Light mode with optimized colors
- Persistent theme preference
- Automatic status bar styling
- Smooth theme transitions
- Consistent color palette across all screens

### Onboarding Experience
- 5-slide interactive onboarding
- Skip option on all slides except last
- Next/Get Started navigation
- First-launch detection
- Never shown again after completion
- Developer option to reset onboarding

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

To get your TMDB API key:
1. Create an account at [TMDB](https://www.themoviedb.org/signup)
2. Go to [API Settings](https://www.themoviedb.org/settings/api)
3. Request an API key (choose "Developer" option)
4. Copy your API key to the `.env` file

## API Reference

This application uses The Movie Database (TMDB) API v3.

### Base URL
```
https://api.themoviedb.org/3
```

### Key Endpoints Used

#### Authentication
```
POST /auth/login
```
Authenticate user and receive JWT token.

#### Movies
```
GET /movie/popular?page={page}
GET /movie/top_rated?page={page}
GET /movie/upcoming?page={page}
GET /movie/now_playing?page={page}
GET /movie/{movie_id}
GET /movie/{movie_id}/credits
GET /movie/{movie_id}/videos
GET /movie/{movie_id}/similar
```

#### Search
```
GET /search/movie?query={query}&page={page}
```

#### Discover
```
GET /discover/movie?with_genres={genre_id}&page={page}
```

#### Trending
```
GET /trending/movie/{time_window}
```
Time window: `day` or `week`

#### Configuration
```
GET /configuration
```
Get API configuration including image base URLs.

#### Genres
```
GET /genre/movie/list
```
Get list of all movie genres.

### Image URLs

TMDB provides images at different sizes. This app uses:
- **Posters:** `w500` (500px width)
- **Backdrops:** `original` (full resolution)
- **Profiles:** `w185` (185px width)

Base URL: `https://image.tmdb.org/t/p/`

Example: `https://image.tmdb.org/t/p/w500/posterPath.jpg`

### Rate Limiting

TMDB API has a rate limit of 40 requests per 10 seconds. This app implements:
- Request debouncing for search
- Pagination to reduce requests
- Error handling for rate limit responses

For complete API documentation, visit: [TMDB API Documentation](https://developer.themoviedb.org/reference/intro/getting-started)


## Acknowledgments

- **The Movie Database (TMDB)** for providing the comprehensive movie API
- **Expo** for the amazing React Native development platform
- **React Navigation** for the flexible navigation solution
- **React Native Community** for valuable open-source contributions
- All contributors who have helped improve this project

## Future Enhancements

Planned features for future releases:
- User reviews and ratings
- Social features (share movies, follow friends)
- Watchlist vs Watched separation
- Movie recommendations based on favorites
- Multiple language support (i18n)
- Offline mode with cached data
- Push notifications for new releases
- Integration with streaming services
- TV shows support
- Advanced filtering (year, rating range, runtime)
- Export watchlist functionality



### Common Issues

**App won't start:**
- Ensure all dependencies are installed: `npm install`
- Clear cache: `npx expo start -c`
- Check Node.js version (should be 14+)

**API not working:**
- Verify your TMDB API key in `.env` file
- Check internet connection
- Ensure API key is valid and active

**Images not loading:**
- Check network connection
- Verify image URLs are constructed correctly
- Some movies may not have images in TMDB

**Theme not persisting:**
- Clear app data and try again
- Check AsyncStorage permissions

## Performance Optimization

This app implements several performance optimizations:
- FlatList virtualization for long lists
- Image caching
- Debounced search inputs
- Pagination for large datasets
- React.memo for expensive components
- useCallback and useMemo hooks where appropriate
- Lazy loading of images


Built with React Native and Expo | Powered by TMDB API
