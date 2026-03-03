# Complete Authentication Flow - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  App.tsx                                                        │
│  └── AuthProvider (src/contexts/AuthContext.tsx)              │
│      └── Routes                                                │
│          ├── / (Index)                       [Public]          │
│          ├── /gallery                        [Public]          │
│          ├── /about                          [Public]          │
│          ├── /contact                        [Public]          │
│          ├── /register                       [Public]          │
│          ├── /login                          [Public]          │
│          ├── /admin                          [Protected]       │
│          │   └── ProtectedRoute Component                     │
│          │       └── AdminDashboard                           │
│          └── /* (404)                        [Public]          │
│                                                                 │
│  Each Component                                                │
│  └── useAuth() Hook                                           │
│      └── Access: user, isAuthenticated, logout                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Registration Flow

```
START: User clicks "Don't have account? Register"
  │
  ▼
┌─────────────────────────────┐
│ Register Page               │
│ - Shows registration form   │
│ - Inputs: username,password │
└─────────────────────────────┘
  │
  │ User submits form
  ▼
┌─────────────────────────────┐
│ Register.tsx                │
│ - validateForm()            │
│ - loading state ON          │
└─────────────────────────────┘
  │
  │ handleSubmit()
  ▼
┌─────────────────────────────┐
│ registerUser() API Call     │
│ POST /api/user/register     │
│ Data: {userName, password}  │
└─────────────────────────────┘
  │
  │ HTTPS Request
  ▼
┌─────────────────────────────────────────┐
│ Backend (Node.js)                       │
│ - Check username doesn't exist          │
│ - Hash password with bcrypt             │
│ - Create user in MongoDB                │
│ - Generate JWT token                    │
│ - Set httpOnly cookie with token        │
└─────────────────────────────────────────┘
  │
  │ Success? Return user data
  ▼
┌──────────────────────────────┐
│ Response: 201 Created        │
│ {                            │
│   message: "Created",        │
│   user: {                    │
│     _id: "...",              │
│     userName: "admin"        │
│   }                          │
│ }                            │
└──────────────────────────────┘
  │
  │ response.user received
  ▼
┌─────────────────────────────┐
│ Register.tsx                │
│ - register(response.user)    │
└─────────────────────────────┘
  │
  │ register() function
  ▼
┌─────────────────────────────────────────┐
│ AuthContext.tsx                         │
│ - setUser(userData)                     │
│ - localStorage.setItem('user', JSON)    │
│ - State updated globally                │
└─────────────────────────────────────────┘
  │
  │ Auth state: isAuthenticated = true
  ▼
┌─────────────────────────────┐
│ navigate("/admin")          │
│ Redirect to dashboard       │
└─────────────────────────────┘
  │
  │ Route: /admin
  ▼
┌──────────────────────────────┐
│ ProtectedRoute Component      │
│ - Checks isAuthenticated      │
│ - isAuthenticated = true ✓    │
│ - Renders children            │
└──────────────────────────────┘
  │
  │ Render
  ▼
┌─────────────────────────────┐
│ AdminDashboard              │
│ - Shows "Welcome, admin"     │
│ - Shows logout button        │
│ - Can manage images          │
└─────────────────────────────┘
  │
  ▼
END: User successfully registered & logged in
```

---

## User Login Flow

```
START: User at login page
  │
  ▼
┌─────────────────────────────┐
│ Login Page                  │
│ - Shows login form          │
│ - Inputs: username,password │
└─────────────────────────────┘
  │
  │ User submits credentials
  ▼
┌─────────────────────────────┐
│ Login.tsx                   │
│ - validateForm()            │
│ - loading state ON          │
└─────────────────────────────┘
  │
  │ handleSubmit()
  ▼
┌─────────────────────────────┐
│ loginUser() API Call        │
│ POST /api/user/login        │
│ Data: {userName, password}  │
└─────────────────────────────┘
  │
  │ HTTPS Request (with credentials)
  ▼
┌──────────────────────────────────────────┐
│ Backend (Node.js)                        │
│ - Find user by username in MongoDB       │
│ - Compare password with bcrypt.compare() │
│ - Check password matches ✓               │
│ - Generate JWT token                     │
│ - Set httpOnly cookie with token         │
└──────────────────────────────────────────┘
  │
  │ Success? Return user data
  ▼
┌──────────────────────────────┐
│ Response: 200 OK             │
│ {                            │
│   message: "Logged in",      │
│   user: {                    │
│     _id: "...",              │
│     userName: "admin"        │
│   }                          │
│ }                            │
│ Cookie: token=JWT_VALUE      │
└──────────────────────────────┘
  │
  │ response.user received
  ▼
┌─────────────────────────────┐
│ Login.tsx                   │
│ - login(response.user)       │
└─────────────────────────────┘
  │
  │ login() function
  ▼
┌──────────────────────────────────────────┐
│ AuthContext.tsx                          │
│ - setUser(userData)                      │
│ - localStorage.setItem('user', JSON)     │
│ - Global state updated                   │
│ - All components notified of state change│
└──────────────────────────────────────────┘
  │
  │ Auth state: isAuthenticated = true
  ▼
┌─────────────────────────────┐
│ navigate("/admin")          │
│ Redirect to dashboard       │
└─────────────────────────────┘
  │
  │ Route: /admin
  ▼
┌──────────────────────────────┐
│ ProtectedRoute Component      │
│ - Checks isAuthenticated      │
│ - isAuthenticated = true ✓    │
│ - Renders AdminDashboard      │
└──────────────────────────────┘
  │
  ▼
END: User logged in successfully
```

---

## Page Refresh - Session Persistence

```
START: User at /admin, refreshes page
  │ Page reloads
  ▼
┌──────────────────────────────┐
│ App.tsx Mounts               │
│ - React re-initializes       │
└──────────────────────────────┘
  │
  │ AuthProvider mounts
  ▼
┌────────────────────────────────────────┐
│ AuthContext.tsx                        │
│ - useEffect() runs on mount            │
│ - Checks localStorage for saved user   │
└────────────────────────────────────────┘
  │
  │ localStorage.getItem('user')
  ▼
┌──────────────────────────────┐
│ Found in localStorage?        │
│                              │
│ YES ✓                        │
└──────────────────────────────┘
  │
  │ JSON.parse(savedUser)
  ▼
┌──────────────────────────────┐
│ Update state:                │
│ - setUser(parsedUser)        │
│ - setIsLoading(false)        │
│ - isAuthenticated = true     │
└──────────────────────────────┘
  │
  │ State propagates to components
  ▼
┌──────────────────────────────┐
│ ProtectedRoute checks auth   │
│ - isAuthenticated = true ✓   │
│ - isLoading = false          │
│ - Renders AdminDashboard     │
└──────────────────────────────┘
  │
  ▼
END: User session restored, still logged in ✓
```

---

## Accessing Protected Route Without Login

```
START: Unauthenticated user tries /admin
  │
  ▼
┌──────────────────────────┐
│ URL: /admin              │
│ No login data in browser │
└──────────────────────────┘
  │
  │ Route matches /admin
  ▼
┌──────────────────────────────┐
│ ProtectedRoute renders       │
│ - Checks isAuthenticated     │
│ - isLoading = true initially │
└──────────────────────────────┘
  │
  │ Loading state
  ▼
┌──────────────────────────────┐
│ Shows loading spinner        │
│ "Loading..."                 │
│ (very brief)                 │
└──────────────────────────────┘
  │
  │ AuthContext checks localStorage
  ▼
┌──────────────────────────────┐
│ No user data found           │
│ - setUser(null)              │
│ - setIsLoading(false)        │
│ - isAuthenticated = false    │
└──────────────────────────────┘
  │
  │ isAuthenticated = false
  ▼
┌──────────────────────────────┐
│ ProtectedRoute executes:     │
│ if (!isAuthenticated)        │
│   return <Navigate to login> │
└──────────────────────────────┘
  │
  │ navigate("/login")
  ▼
┌──────────────────────────────┐
│ Browser redirects to /login  │
│ User sees login form         │
└──────────────────────────────┘
  │
  ▼
END: User must login first
```

---

## Logout Flow

```
START: User clicks "Logout" button
  │
  ▼
┌─────────────────────────────┐
│ AdminDashboard.tsx          │
│ - handleLogout() triggers   │
└─────────────────────────────┘
  │
  │ logout() function called
  ▼
┌────────────────────────────────────────┐
│ AuthContext.tsx logout()               │
│ 1. setUser(null)                       │
│ 2. localStorage.removeItem('user')     │
│ 3. Clear cookies                       │
│    document.cookie = "token=..."       │
│ (httpOnly cookies cleared by server)   │
└────────────────────────────────────────┘
  │
  │ State changes
  ▼
┌──────────────────────────────┐
│ Global state update:         │
│ - user = null                │
│ - isAuthenticated = false    │
└──────────────────────────────┘
  │
  │ All components re-render
  ▼
┌────────────────────────────────┐
│ navigate("/login")             │
│ Redirect to login page         │
└────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────┐
│ Login Page                       │
│ - No user data available         │
│ - Must login again               │
└──────────────────────────────────┘
  │
  ▼
END: User logged out, session cleared
```

---

## Data Locations & Lifecycle

### During Registration/Login

```
┌──────────────────────────────────┐
│ User submits form                │
└──────────────────────────────────┘
         │
         │ POST request
         ▼
    Backend validation
    └─ Returns: { user: {...} }
         │
         ▼
┌──────────────────────────────────────────────┐
│ Frontend receives response                   │
│                                              │
│ Data Flow:                                   │
│  1. response.data.user                       │
│  2. login(userData)                          │
│  3. setUser(userData)                        │
│  4. localStorage.setItem('user', JSON)       │
│                                              │
│ Stored Locations:                            │
│  • Context (RAM) ← In-memory                 │
│  • localStorage ← Persistent disk storage    │
│  • httpOnly cookie ← For API requests        │
└──────────────────────────────────────────────┘
```

### During Page Refresh

```
┌──────────────────────────────────┐
│ Page reloads                     │
└──────────────────────────────────┘
         │
         │ AuthContext useEffect
         ▼
┌──────────────────────────────────────────────┐
│ Check localStorage.getItem('user')           │
│                                              │
│ If found:                                    │
│  1. JSON.parse()                             │
│  2. setUser(parsedData)                      │
│  3. Context state restored                   │
│  4. Components re-render                     │
│  5. User stays logged in ✓                   │
│                                              │
│ If not found:                                │
│  1. setUser(null)                            │
│  2. isAuthenticated = false                  │
│  3. Redirect to login                        │
└──────────────────────────────────────────────┘
```

### During Logout

```
┌──────────────────────────────────┐
│ User clicks logout button        │
└──────────────────────────────────┘
         │
         │ logout()
         ▼
┌────────────────────────────────────────────────┐
│ 1. Context:                                    │
│    setUser(null)                               │
│    isAuthenticated = false                     │
│                                                │
│ 2. localStorage:                               │
│    localStorage.removeItem('user')             │
│    (Browser disk storage cleared)              │
│                                                │
│ 3. Cookies:                                    │
│    document.cookie = "token=..."               │
│    (Client clears; server also clears)         │
│                                                │
│ 4. Result:                                     │
│    - No data in Context (RAM)                  │
│    - No data in localStorage (disk)            │
│    - No cookie (browser storage)               │
│    - User session completely cleared           │
└────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ navigate("/login")               │
│ Redirect to login page           │
└──────────────────────────────────┘
```

---

## API Request/Response Format

### Register Request & Response

```
REQUEST:
┌─────────────────────────────────┐
│ POST /api/user/register         │
│                                 │
│ Headers:                        │
│  Content-Type: application/json │
│                                 │
│ Body:                           │
│ {                              │
│   "userName": "admin",          │
│   "password": "password123"     │
│ }                              │
└─────────────────────────────────┘

RESPONSE (Success):
┌─────────────────────────────────┐
│ Status: 201 Created             │
│                                 │
│ Headers:                        │
│  Set-Cookie: token=JWT;...     │
│                                 │
│ Body:                           │
│ {                              │
│   "message": "User created",    │
│   "user": {                     │
│     "_id": "65a1...",           │
│     "userName": "admin"         │
│   }                            │
│ }                              │
└─────────────────────────────────┘

RESPONSE (Error):
┌─────────────────────────────────┐
│ Status: 409 Conflict            │
│                                 │
│ Body:                           │
│ {                              │
│   "message": "User exists"      │
│ }                              │
└─────────────────────────────────┘
```

### Login Request & Response

```
REQUEST:
┌─────────────────────────────────┐
│ POST /api/user/login            │
│                                 │
│ Headers:                        │
│  Content-Type: application/json │
│                                 │
│ Body:                           │
│ {                              │
│   "userName": "admin",          │
│   "password": "password123"     │
│ }                              │
└─────────────────────────────────┘

RESPONSE (Success):
┌─────────────────────────────────┐
│ Status: 200 OK                  │
│                                 │
│ Headers:                        │
│  Set-Cookie: token=JWT;...     │
│                                 │
│ Body:                           │
│ {                              │
│   "message": "Logged in",       │
│   "user": {                     │
│     "_id": "65a1...",           │
│     "userName": "admin"         │
│   }                            │
│ }                              │
└─────────────────────────────────┘

RESPONSE (Error):
┌─────────────────────────────────┐
│ Status: 401 Unauthorized        │
│                                 │
│ Body:                           │
│ {                              │
│   "message": "Invalid creds"    │
│ }                              │
└─────────────────────────────────┘
```

---

## Component & Hook Usage Quick Reference

```tsx
// In Login.tsx
import { useAuth } from "@/contexts/AuthContext";
const { login } = useAuth();
login(userData);

// In Register.tsx
import { useAuth } from "@/contexts/AuthContext";
const { register } = useAuth();
register(userData);

// In AdminDashboard.tsx
import { useAuth } from "@/contexts/AuthContext";
const { user, logout } = useAuth();

// In Any Component
import { useAuth } from "@/contexts/AuthContext";
const { user, isAuthenticated, isLoading } = useAuth();
```

---

## State Transitions Diagram

```
        ┌─────────────┐
        │   START     │
        │ No user     │
        │ Not logged  │
        └──────┬──────┘
               │
         ┌─────▼──────┐
         │ Visit /reg │ (or /login)
         └─────┬──────┘
               │
         ┌─────▼──────────────────┐
         │ Submit credentials     │
         │ API call               │
         └─────┬──────────────────┘
               │
         ┌─────▼──────────────────┐
         │ Backend validates      │
         │ Sets JWT token         │
         └─────┬──────────────────┘
               │
         ┌─────▼──────────────────┐
         │ Response with user     │
         │ Call login/register()  │
         └─────┬──────────────────┘
               │
        ┌──────▼──────────┐
        │   LOGGED IN     │
        │   user data     │
        │   isAuth = true │
        └──────┬──────────┘
               │
      ┌────────┴────────┐
      │                 │
  ┌───▼──────┐      ┌───▼──────────┐
  │ Navigate │      │ Refresh page │
  │ to /admin│      │ (persisted)  │
  └───┬──────┘      └───┬──────────┘
      │                 │
      └────────┬────────┘
               │
         ┌─────▼──────────────────┐
         │ ProtectedRoute allows  │
         │ access to /admin       │
         │ AdminDashboard renders │
         └─────┬──────────────────┘
               │
         ┌─────▼──────────────────┐
         │ User clicks logout     │
         └─────┬──────────────────┘
               │
         ┌─────▼──────────────────┐
         │ logout() called        │
         │ - Clear context        │
         │ - Clear localStorage   │
         │ - Clear cookies        │
         │ - Redirect /login      │
         └─────┬──────────────────┘
               │
        ┌──────▼──────────┐
        │   NOT LOGGED IN │
        │ isAuth = false  │
        │ Try /admin →401 │
        └─────────────────┘
```

---

## Summary

This complete flow ensures:
- ✅ Users can register & login securely
- ✅ Sessions persist across page refreshes
- ✅ Unauthorized access is blocked
- ✅ Logout completely clears all data
- ✅ User data is always available via useAuth()
- ✅ Protected routes are enforced

**The system is secure, efficient, and user-friendly!** 🎉
