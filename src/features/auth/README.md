# CineGrid Authentication System

## Overview

This is a complete authentication system for the CineGrid mobile app, built with React Native and Expo. It uses the DummyJSON API for demonstration purposes.

## 🚀 Features

- ✅ User login with username/password
- ✅ User registration (simulated)
- ✅ Form validation using Yup
- ✅ Secure token storage with AsyncStorage
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ User profile display
- ✅ Logout functionality
- ✅ Onboarding flow for first-time users
- ✅ Loading states and error handling

## 📁 File Structure

```
src/
├── features/
│   └── auth/
│       ├── AuthContext.js        # Authentication context provider
│       ├── authService.js        # API service for authentication
│       ├── authStorage.js        # Secure token storage utilities
│       ├── validation.js         # Yup validation schemas
│       └── index.js              # Export barrel file
├── navigation/
│   ├── AppNavigator.js           # Main app navigation with auth routing
│   └── MainTabNavigator.js       # Tab navigation with user header
└── screens/
    ├── LoginScreen.js            # Login screen with validation
    ├── RegisterScreen.js         # Registration screen with validation
    └── ProfileScreen.js          # User profile with logout
```

## 🔑 Test Credentials

Use these credentials to login (DummyJSON API):

**Primary Test Account:**

- Username: `emilys`
- Password: `emilyspass`

**Alternative Account:**

- Username: `kminchelle`
- Password: `0lelplR`

## 🛠️ Setup & Installation

All required dependencies are already installed in your project:

- `axios` - HTTP client for API calls
- `yup` - Form validation
- `@react-native-async-storage/async-storage` - Secure storage

## 📋 How It Works

### 1. Authentication Flow

```
App Launch
    ↓
Check if first launch → YES → Show Onboarding → Login Screen
    ↓ NO
Check authentication → YES → Main App (Tabs)
    ↓ NO
Login Screen
```

### 2. Login Process

1. User enters username and password
2. Form is validated using Yup schema
3. API call to DummyJSON `/auth/login`
4. Tokens stored in AsyncStorage
5. User data stored in AsyncStorage
6. Navigation to Main App

### 3. Token Management

- Access tokens are automatically attached to API requests
- If a request fails with 401, the system automatically:
  - Attempts to refresh the token
  - Retries the original request
  - If refresh fails, logs user out

### 4. Protected Routes

The `AppNavigator` component conditionally renders screens based on authentication status:

- **Not Authenticated**: Login, Register screens
- **Authenticated**: Main tabs, Details screen

## 🎨 Usage Examples

### Using Authentication in a Component

```javascript
import { useAuth } from "../features/auth/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <View>{isAuthenticated && <Text>Welcome, {user.firstName}!</Text>}</View>
  );
};
```

### Making Authenticated API Calls

```javascript
import apiClient from "../features/auth/authService";

// The axios instance automatically adds auth headers
const fetchData = async () => {
  const response = await apiClient.get("/some-endpoint");
  return response.data;
};
```

### Checking Storage Values

```javascript
import { getAccessToken, getUserData } from "../features/auth/authStorage";

const checkAuth = async () => {
  const token = await getAccessToken();
  const user = await getUserData();
  console.log("Token:", token);
  console.log("User:", user);
};
```

## 🔐 Security Features

1. **Token Storage**: Tokens are stored in AsyncStorage (consider using expo-secure-store for production)
2. **Password Security**: Passwords are never stored locally
3. **Input Sanitization**: All inputs are validated before submission
4. **Request Timeouts**: 10-second timeout on all API requests
5. **Error Handling**: User-friendly error messages without exposing sensitive info

## 📱 Screens

### LoginScreen

- Username and password fields with validation
- "Use Test Credentials" button for easy testing
- Real-time error display below fields
- Loading indicator during login
- Navigation to RegisterScreen

### RegisterScreen

- Full registration form (firstName, lastName, username, email, password, confirmPassword)
- Complete validation with specific rules
- Demo notice informing users to use test credentials
- Success alert with test credentials after registration

### ProfileScreen

- User profile image with gradient border
- Display name, username, email, gender, and ID
- Info cards with clean design
- Logout button with confirmation dialog

## 🎯 API Endpoints Used

### Login

```
POST https://dummyjson.com/auth/login
Body: { username, password, expiresInMins: 30 }
```

### Get Current User

```
GET https://dummyjson.com/auth/me
Headers: { Authorization: 'Bearer TOKEN' }
```

### Refresh Token

```
POST https://dummyjson.com/auth/refresh
Body: { refreshToken, expiresInMins: 30 }
```

### Register (Simulated)

```
POST https://dummyjson.com/users/add
Body: { firstName, lastName, username, email, password }
```

## 🧪 Testing

### Test the Login Flow

1. Run the app: `npm start`
2. Navigate to Login screen
3. Tap "Use Test Credentials"
4. Tap "Sign In"
5. Should navigate to Home screen with user's name in header

### Test Registration

1. Navigate to Register screen
2. Fill out the form (any values)
3. Tap "Sign Up"
4. Should see success alert with test credentials
5. Navigate back to Login

### Test Logout

1. Navigate to Profile tab
2. Tap "Logout"
3. Confirm in the alert
4. Should navigate back to Login screen

### Test Token Refresh

The token refresh happens automatically when an API call receives a 401 response. This is handled by the axios interceptor in `authService.js`.

## 🐛 Debug Features

The Login screen includes a debug button to reset onboarding:

```javascript
// Remove before production
const resetOnboarding = async () => {
  await AsyncStorage.removeItem("@cinegrid_has_launched");
};
```

## 🚨 Important Notes for Production

1. **Remove Debug Buttons**: Remove the "Reset Onboarding" button from LoginScreen
2. **Secure Storage**: Replace AsyncStorage with expo-secure-store for tokens
3. **Real API**: Replace DummyJSON with your actual backend API
4. **Error Logging**: Implement proper error logging service (e.g., Sentry)
5. **Validation**: Add server-side validation as well
6. **HTTPS**: Ensure all API calls use HTTPS
7. **Token Expiration**: Implement proper token expiration handling

## 📚 Validation Rules

### Login

- Username: Required, min 3 characters
- Password: Required, min 6 characters

### Registration

- First Name: Required, min 2 characters, letters only
- Last Name: Required, min 2 characters, letters only
- Username: Required, min 3 characters, alphanumeric + underscore
- Email: Required, valid email format
- Password: Required, min 8 characters, must contain number and special character
- Confirm Password: Required, must match password

## 🎨 UI/UX Features

- Neon gradient background orbs
- Gradient borders on buttons and profile image
- Real-time validation feedback
- Loading indicators
- Error messages below each field
- Smooth animations
- Keyboard-aware views
- Success/error alerts

## 📞 Support

For issues or questions about the authentication system:

1. Check the console logs for detailed error messages
2. Verify you're using the correct test credentials
3. Ensure you have an internet connection
4. Check that all dependencies are installed

## 🔄 Future Enhancements

- [ ] Social login (Google, Facebook)
- [ ] Biometric authentication
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Session management
- [ ] Multi-factor authentication
