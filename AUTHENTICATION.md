# Authentication & User Management System

This document explains the authentication system implemented in the Art Gallery application.

## Overview

The application uses React Context API to manage global authentication state. Users can register, login, and access protected routes (like the admin dashboard) only when authenticated.

---

## Components & Files Created

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)

A React Context that manages:
- **User Data**: Stores user ID and username
- **Authentication State**: Tracks if user is logged in
- **Loading State**: Manages initial authentication check
- **Methods**:
  - `login(user)` - Store user data after successful login
  - `register(user)` - Store user data after successful registration
  - `logout()` - Clear user data and cookies

**Key Features:**
- Persists user data in `localStorage` (survives page refresh)
- Automatically loads saved user data on app startup
- Manages JWT token in httpOnly cookies (backend handled)

### 2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

A wrapper component that:
- Checks if user is authenticated
- Redirects unauthenticated users to login page
- Shows loading spinner while checking auth state
- Renders protected component if user is logged in

**Usage:**
```tsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

---

## File Modifications

### **App.tsx**
```
✅ Added AuthProvider wrapper (provides context to entire app)
✅ Added ProtectedRoute wrapper around /admin route
✅ Now redirects unauthorized users to /login
```

### **Login.tsx**
```
✅ Imports useAuth hook
✅ Calls login() after successful authentication
✅ Stores user data in context & localStorage
✅ Displays user feedback on errors
```

### **Register.tsx**
```
✅ Imports useAuth hook
✅ Calls register() after successful registration
✅ Stores user data in context & localStorage
✅ Auto-redirects to dashboard if user already exists (error shown)
```

### **AdminDashboard.tsx**
```
✅ Imports useAuth hook
✅ Displays welcome message with logged-in username
✅ Shows logout button in header
✅ Calls logout() when user clicks logout
✅ Redirects to login after logout
✅ Can now only be accessed when authenticated
```

### **api.ts**
```
✅ Updated loginUser() to return response data directly
✅ Updated registerUser() to return response data directly
✅ Added getCurrentUser() for future profile fetching
✅ All requests include withCredentials: true for cookie handling
```

---

## How It Works

### 1. **Registration Flow**
```
User fills form → registerUser() API call
  ↓
Backend creates user + JWT token (in httpOnly cookie)
  ↓
Response returns user data { _id, userName }
  ↓
register(userData) stores in context & localStorage
  ↓
Navigate to /admin dashboard
```

### 2. **Login Flow**
```
User enters credentials → loginUser() API call
  ↓
Backend validates + sets JWT token (in httpOnly cookie)
  ↓
Response returns user data { _id, userName }
  ↓
login(userData) stores in context & localStorage
  ↓
Navigate to /admin dashboard
```

### 3. **Dashboard Access Flow**
```
User tries to access /admin
  ↓
ProtectedRoute checks isAuthenticated
  ↓
If NO user → Redirect to /login
  ↓
If user exists → Load AdminDashboard
```

### 4. **Logout Flow**
```
User clicks logout button
  ↓
logout() clears context, localStorage, & cookies
  ↓
Navigate to /login
```

### 5. **Page Refresh Flow**
```
Page refreshes
  ↓
AuthContext useEffect runs on mount
  ↓
Checks localStorage for saved user
  ↓
If user found → Sets context with saved data
  ↓
User stays logged in ✅
```

---

## Data Structure

### User Object
```typescript
interface User {
  _id: string;        // MongoDB user ID
  userName: string;   // Username for display
}
```

### AuthContext Value
```typescript
interface AuthContextType {
  user: User | null;           // Current user or null
  isAuthenticated: boolean;    // true if user logged in
  isLoading: boolean;          // true while checking auth
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}
```

---

## Usage in Components

### Using the Auth Hook

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please login</p>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.userName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## Backend Integration

### Login Response Expected
```json
{
  "message": "user Logged in",
  "user": {
    "userName": "admin",
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1"
  }
}
```

### Register Response Expected
```json
{
  "message": "User created successfully",
  "user": {
    "userName": "admin",
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1"
  }
}
```

### Cookie Handling
- Backend sets httpOnly cookie after login/register
- Cookie is automatically sent with all API requests (withCredentials: true)
- Frontend cannot access the cookie directly (for security)
- Cookie is cleared on logout

---

## Security Features

✅ **HttpOnly Cookies** - JWT tokens can't be accessed by JavaScript (XSS protection)
✅ **CORS Credentials** - Uses withCredentials for secure cross-origin requests
✅ **Protected Routes** - Unauthorized users redirected to login
✅ **LocalStorage + Context** - User data persists across sessions
✅ **No Password Stored** - Only user ID & username in context
✅ **Automatic Logout** - Clears all data when user logs out

---

## Testing the Authentication

### 1. **Test Registration**
- Navigate to `/register`
- Enter username & password
- Should redirect to `/admin` dashboard
- Refresh page - should stay logged in
- Check browser localStorage for saved user

### 2. **Test Login**
- Navigate to `/login`
- Enter credentials
- Should redirect to `/admin` dashboard
- User display shows in top right

### 3. **Test Protected Route**
- Log out
- Try accessing `/admin` directly
- Should redirect to `/login`

### 4. **Test Logout**
- Click logout button in dashboard
- Should clear user data
- Should redirect to `/login`
- Admin dashboard no longer accessible

---

## Future Enhancements

- Add "Remember Me" functionality
- Implement refresh token rotation
- Add role-based access control (RBAC)
- Add user profile page with data editing
- Implement password change functionality
- Add two-factor authentication (2FA)
- Session timeout with warning

---

## Troubleshooting

**Problem:** User data not persisting after refresh
- **Solution:** Check if localStorage is enabled in browser
- Check browser DevTools → Application → LocalStorage

**Problem:** Can't access admin dashboard despite being logged in
- **Solution:** Check if AuthProvider wraps the entire app in App.tsx
- Verify ProtectedRoute is correctly wrapping the route

**Problem:** Login redirects but shows "Please login" message
- **Solution:** Ensure response includes `user` object with `_id` and `userName`
- Check backend login endpoint response format

**Problem:** Logout doesn't work
- **Solution:** Verify logout() function is being called
- Check if browser allows cookie deletion

---

## File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx         ← Authentication context & hooks
├── components/
│   └── ProtectedRoute.tsx      ← Route protection wrapper
├── pages/
│   ├── Login.tsx               ← Updated with context
│   ├── Register.tsx            ← Updated with context
│   └── AdminDashboard.tsx      ← Updated with context
├── lib/
│   └── api.ts                  ← Updated API functions
└── App.tsx                     ← Updated with AuthProvider & ProtectedRoute
```
