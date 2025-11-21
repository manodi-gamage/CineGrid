# TMDB API Integration Guide

## 📋 Overview

Complete TMDB (The Movie Database) API integration for CineGrid React Native Expo app. This setup provides a robust, production-ready API service with error handling, rate limiting awareness, and comprehensive image utilities.

## 🚀 Installation & Setup

### 1. Dependencies Installed

```bash
npm install axios react-native-dotenv
```

### 2. Environment Configuration

**`.env` file** (root directory):

```env
TMDB_API_KEY=2dd9e5c41d00bead364537f8973b512b
```

**Important**: `.env` is added to `.gitignore` to protect your API key.

### 3. Babel Configuration

The `babel.config.js` has been configured to support environment variables:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          allowUndefined: true,
        },
      ],
    ],
  };
};
```

## 📁 Project Structure

```
src/
├── config/
│   └── tmdbConfig.js          # API configuration & constants
├── services/
│   ├── tmdbService.js         # Main API service with all endpoints
│   └── __tests__/
│       └── tmdbService.test.js # Test file for API endpoints
└── utils/
    └── imageHelper.js          # Image URL construction utilities
```

## 🔧 Configuration Files

### `src/config/tmdbConfig.js`

Centralizes all TMDB API configuration:

- **API Key**: Loaded from environment variables
- **Base URLs**: API and image base URLs
- **Image Sizes**: All available sizes for posters, backdrops, profiles
- **Rate Limiting**: Configuration for TMDB's 40 requests/10 seconds limit
- **Default Settings**: Language, region, timeout

## 🌐 API Service

### `src/services/tmdbService.js`

Complete API service with axios interceptors and error handling.

#### Available Endpoints:

**Movie Discovery:**

```javascript
import tmdbService from "./src/services/tmdbService";

// Get trending movies (day or week)
const trending = await tmdbService.getTrendingMovies("day", page);

// Get popular movies
const popular = await tmdbService.getPopularMovies(page);

// Get top rated movies
const topRated = await tmdbService.getTopRatedMovies(page);

// Get upcoming movies
const upcoming = await tmdbService.getUpcomingMovies(page);

// Get now playing movies
const nowPlaying = await tmdbService.getNowPlayingMovies(page);
```

**Movie Details:**

```javascript
// Get detailed movie information
const details = await tmdbService.getMovieDetails(movieId);

// Get movie credits (cast & crew)
const credits = await tmdbService.getMovieCredits(movieId);

// Get similar movies
const similar = await tmdbService.getSimilarMovies(movieId);

// Get movie videos (trailers)
const videos = await tmdbService.getMovieVideos(movieId);
```

**Search & Discover:**

```javascript
// Search movies by query
const results = await tmdbService.searchMovies("Avengers", page);

// Get movies by genre
const byGenre = await tmdbService.getMoviesByGenre(genreId, page);

// Get movie genres list
const genres = await tmdbService.getMovieGenres();
```

**Additional Features:**

```javascript
// Get movie recommendations
const recommendations = await tmdbService.getMovieRecommendations(movieId);

// Get movie reviews
const reviews = await tmdbService.getMovieReviews(movieId);

// Get TMDB configuration (image sizes, etc.)
const config = await tmdbService.getConfiguration();
```

## 🖼️ Image Helper Utilities

### `src/utils/imageHelper.js`

Helper functions for constructing image URLs and formatting data.

#### Image URL Functions:

```javascript
import {
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  getResponsivePosterUrls,
} from "./src/utils/imageHelper";

// Get poster URL (default: w500)
const posterUrl = getPosterUrl(movie.poster_path);

// Get backdrop URL (default: original)
const backdropUrl = getBackdropUrl(movie.backdrop_path);

// Get profile URL for cast (default: w185)
const profileUrl = getProfileUrl(actor.profile_path);

// Get responsive poster URLs (multiple sizes)
const responsivePosters = getResponsivePosterUrls(movie.poster_path);
// Returns: { small, medium, large, xlarge, original }
```

#### Data Formatting Functions:

```javascript
import {
  getReleaseYear,
  formatRuntime,
  formatVoteAverage,
  formatCurrency,
  getTrailerKey,
} from "./src/utils/imageHelper";

// Format release date to year
const year = getReleaseYear("1999-03-30"); // "1999"

// Format runtime
const runtime = formatRuntime(136); // "2h 16m"

// Format vote average
const rating = formatVoteAverage(8.2); // "8.2"

// Format budget/revenue
const budget = formatCurrency(63000000); // "$63.0M"

// Extract trailer key from videos array
const trailerKey = getTrailerKey(videos.results);
```

#### YouTube Integration:

```javascript
import { getYouTubeThumbnail, getYouTubeUrl } from "./src/utils/imageHelper";

// Get YouTube thumbnail
const thumbnail = getYouTubeThumbnail(videoKey, "hqdefault");

// Get YouTube video URL
const videoUrl = getYouTubeUrl(videoKey);
```

## 🎯 Usage Examples

### Example 1: Display Popular Movies

```javascript
import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text } from "react-native";
import tmdbService from "./src/services/tmdbService";
import { getPosterUrl } from "./src/utils/imageHelper";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await tmdbService.getPopularMovies(1);
      setMovies(data.results);
    } catch (error) {
      console.error("Error loading movies:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Image
            source={{ uri: getPosterUrl(item.poster_path) }}
            style={{ width: 150, height: 225 }}
          />
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
};
```

### Example 2: Movie Details Screen

```javascript
import React, { useEffect, useState } from "react";
import { View, Image, Text, ScrollView } from "react-native";
import tmdbService from "./src/services/tmdbService";
import {
  getBackdropUrl,
  getPosterUrl,
  formatRuntime,
  formatVoteAverage,
} from "./src/utils/imageHelper";

const MovieDetails = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      const data = await tmdbService.getMovieDetails(movieId);
      setMovie(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  if (!movie) return <Text>Loading...</Text>;

  return (
    <ScrollView>
      <Image
        source={{ uri: getBackdropUrl(movie.backdrop_path) }}
        style={{ width: "100%", height: 200 }}
      />
      <Image
        source={{ uri: getPosterUrl(movie.poster_path) }}
        style={{ width: 120, height: 180 }}
      />
      <Text>{movie.title}</Text>
      <Text>Rating: {formatVoteAverage(movie.vote_average)}</Text>
      <Text>Runtime: {formatRuntime(movie.runtime)}</Text>
      <Text>{movie.overview}</Text>
    </ScrollView>
  );
};
```

### Example 3: Search Movies

```javascript
import React, { useState } from "react";
import { View, TextInput, FlatList } from "react-native";
import tmdbService from "./src/services/tmdbService";

const SearchMovies = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      const data = await tmdbService.searchMovies(searchQuery);
      setResults(data.results);
    } catch (error) {
      console.error("Search error:", error.message);
    }
  };

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={handleSearch}
        placeholder="Search movies..."
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
};
```

## 🧪 Testing

### Run Tests

Test file is located at `src/services/__tests__/tmdbService.test.js`

```javascript
import {
  testTmdbService,
  quickTest,
} from "./src/services/__tests__/tmdbService.test";

// Run full test suite
await testTmdbService();

// Or run quick test
await quickTest();
```

### Manual Testing in Your App

```javascript
import tmdbService from "./src/services/tmdbService";

// Test in a component
useEffect(() => {
  const testApi = async () => {
    try {
      const movies = await tmdbService.getPopularMovies(1);
      console.log("✅ API Working:", movies.results.length, "movies");
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };
  testApi();
}, []);
```

## ⚠️ Error Handling

The service automatically handles common errors:

- **401 Unauthorized**: Invalid API key
- **404 Not Found**: Resource doesn't exist
- **429 Rate Limit**: Too many requests
- **500 Server Error**: TMDB server issues
- **Network Error**: No internet connection

Error objects have this structure:

```javascript
{
  type: 'UNAUTHORIZED' | 'NOT_FOUND' | 'RATE_LIMIT' | 'SERVER_ERROR' | 'NETWORK_ERROR',
  message: 'User-friendly error message',
  status: 401 | 404 | 429 | 500 | null
}
```

## 🔒 Security Best Practices

✅ **Implemented:**

- API key stored in `.env` file
- `.env` added to `.gitignore`
- `.env.example` provided for team members
- No hardcoded credentials in code

## 📊 Rate Limiting

TMDB API allows **40 requests per 10 seconds**. The service is aware of this limit but doesn't enforce it automatically. For high-traffic apps, consider implementing:

- Request queuing
- Response caching
- Debouncing search inputs

## 🎨 Image Sizes Reference

### Poster Sizes

- `w92` - Thumbnail
- `w154` - Small
- `w185` - Medium
- `w342` - Large
- `w500` - Extra Large (default)
- `w780` - XXL
- `original` - Original size

### Backdrop Sizes

- `w300` - Small
- `w780` - Medium
- `w1280` - Large
- `original` - Original size (default)

### Profile Sizes

- `w45` - Thumbnail
- `w185` - Medium (default)
- `h632` - Large
- `original` - Original size

## 🔄 Next Steps

After clearing the cache and restarting Expo, you can:

1. Import and use the service in your screens
2. Create movie listing components
3. Build search functionality
4. Add favorites/watchlist features
5. Implement movie detail views

## 📚 Resources

- [TMDB API Documentation](https://developer.themoviedb.org/reference/intro/getting-started)
- [TMDB Image Documentation](https://developer.themoviedb.org/docs/image-basics)
- [Axios Documentation](https://axios-http.com/docs/intro)

## ⚡ Quick Start Checklist

- [x] Install dependencies (axios, react-native-dotenv)
- [x] Create `.env` file with API key
- [x] Configure `babel.config.js`
- [x] Create `tmdbConfig.js`
- [x] Create `tmdbService.js`
- [x] Create `imageHelper.js`
- [x] Add `.env` to `.gitignore`
- [ ] Clear Metro cache: `npx expo start --clear`
- [ ] Test API in your app
- [ ] Build UI components
- [ ] Enjoy building CineGrid! 🎬

---

**Created for CineGrid** - Your React Native Movie App
