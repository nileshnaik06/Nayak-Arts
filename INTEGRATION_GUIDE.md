# Authentication Integration Guide

This guide shows how to use the authentication system in your components.

## Quick Start

### 1. Check if User is Authenticated

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function ProfileSection() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <p>You need to login to view this</p>;
  }
  
  return <p>Hello, {user?.userName}!</p>;
}
```

### 2. Protect a Route

```tsx
// In App.tsx
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 3. Add Logout Button

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

---

## Common Patterns

### Pattern 1: Conditional Navigation

```tsx
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function SomeComponent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  return <div>Protected Content</div>;
}
```

### Pattern 2: Display Different UI Based on Auth

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.userName}</span>
          <button>Logout</button>
        </div>
      ) : (
        <div>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      )}
    </header>
  );
}
```

### Pattern 3: Show Loading State

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading user data...</div>;
  }
  
  return (
    <div>
      <p>User: {user?.userName}</p>
    </div>
  );
}
```

---

## Available Hooks & Functions

### useAuth() Hook

```typescript
const {
  user,              // User | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  login,             // (user: User) => void
  logout,            // () => void
  register,          // (user: User) => void
} = useAuth();
```

### User Object

```typescript
interface User {
  _id: string;        // User ID from database
  userName: string;   // Username for display
}
```

---

## Storing Additional User Data

To store more user data, update the User interface:

```tsx
// In src/contexts/AuthContext.tsx

export interface User {
  _id: string;
  userName: string;
  email?: string;
  role?: string;
  // Add more fields as needed
}
```

Then update the API response handling:

```tsx
// In Login.tsx, after successful login
const response = await loginUser({ userName, password });

if (response.user) {
  login(response.user); // Now includes all User fields
}
```

---

## Protecting Multiple Routes

```tsx
// In App.tsx

<Route path="/" element={<Index />} />
<Route path="/gallery" element={<Gallery />} />

{/* Protected Routes */}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  }
/>

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

---

## Using Auth in API Calls

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserData } from "@/lib/api";

export function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Make authenticated API call
      fetchUserData(user._id).then(setData);
    }
  }, [isAuthenticated, user?._id]);
  
  return <div>{/* Render data */}</div>;
}
```

---

## Handling Auth Errors

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function ProtectedAction() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleAction = async () => {
    try {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      
      // Perform action
      // If API returns 401, handle logout
    } catch (error: any) {
      if (error.response?.status === 401) {
        // User session expired
        logout();
        navigate("/login");
      }
    }
  };
  
  return <button onClick={handleAction}>Perform Action</button>;
}
```

---

## Header Component with Auth

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Art Gallery</h1>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700">
                Welcome, <strong>{user?.userName}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-blue-600">
                Login
              </a>
              <a href="/register" className="text-blue-600">
                Register
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
```

---

## Best Practices

✅ **Do:**
- Use `useAuth()` in components that need auth data
- Check `isLoading` before rendering
- Call `logout()` and redirect in logout handlers
- Use ProtectedRoute for sensitive pages
- Store user ID for API calls that need it

❌ **Don't:**
- Manually manage localStorage
- Store passwords in context or localStorage
- Skip loading checks
- Trust client-side auth checks alone
- Store sensitive data in localStorage (backend should validate)

---

## Moving to Production

1. **Verify Backend Security:**
   - Ensure JWT tokens are httpOnly
   - Enable HTTPS
   - Check CORS configuration

2. **Update API URLs:**
   - Change `VITE_API_URL` environment variable
   - Use production API domain

3. **Test Auth Flow:**
   - Register new user
   - Login with credentials
   - Logout and verify access is blocked
   - Clear cookies and test

4. **Monitor:**
   - Log authentication events
   - Track failed login attempts
   - Monitor token expiration

---

## Questions?

Refer to `AUTHENTICATION.md` for detailed architecture and flow diagrams.
