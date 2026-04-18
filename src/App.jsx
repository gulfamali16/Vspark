/**
 * App.jsx — Root application component
 *
 * REFACTORING APPLIED:
 * 1. Extract ProtectedRoute into its own named component above App (Single Responsibility)
 * 2. Loading spinner extracted to a shared constant to avoid inline repetition (DRY)
 * 3. Route groups annotated with comments for readability
 * 4. Wildcard catch-all route documented explicitly
 */

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// ── Public Pages ──────────────────────────────────────────────────────────────
import Home from './pages/Home'
import Competitions from './pages/Competitions'
import Events from './pages/Events'
import Register from './pages/Register'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Highlights from './pages/Highlights'

// ── Admin Pages ───────────────────────────────────────────────────────────────
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminEvents from './admin/AdminEvents'
import AdminRegistrations from './admin/AdminRegistrations'
import AdminBlogs from './admin/AdminBlogs'
import AdminHighlights from './admin/AdminHighlights'

// REFACTOR: Reusable loading spinner style extracted as a constant (DRY)
// Previously this style object was duplicated inline — now defined once
const SPINNER_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: 'var(--bg)',
}
const SPINNER_INNER_STYLE = {
  width: 48,
  height: 48,
  border: '3px solid var(--border)',
  borderTop: '3px solid var(--primary)',
  borderRadius: '50%',
  animation: 'rotate 0.8s linear infinite',
}

/**
 * REFACTOR: ProtectedRoute extracted as a standalone named component.
 * Previously defined as an anonymous function inside App, making it
 * untestable and harder to read. Now a proper named component.
 *
 * Guards admin routes — redirects unauthenticated users to /admin/login.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Show spinner while Supabase auth state is being resolved
  if (loading) {
    return (
      <div style={SPINNER_STYLE}>
        <div style={SPINNER_INNER_STYLE} />
      </div>
    )
  }

  // Redirect to login if not authenticated; render children if authenticated
  return user ? children : <Navigate to="/admin/login" />
}

/**
 * App — Top-level router.
 * Wraps everything in AuthProvider so Supabase auth state is globally accessible.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/highlights" element={<Highlights />} />

          {/* ── Admin Routes (protected by ProtectedRoute) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="highlights" element={<AdminHighlights />} />
          </Route>

          {/* ── Catch-all: redirect unknown routes to Home ── */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
