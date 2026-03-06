import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public Pages
import Home from './pages/Home'
import Competitions from './pages/Competitions'
import Events from './pages/Events'
import Register from './pages/Register'
import Login from './pages/Login'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Highlights from './pages/Highlights'

// Admin Pages
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminEvents from './admin/AdminEvents'
import AdminRegistrations from './admin/AdminRegistrations'
import AdminBlogs from './admin/AdminBlogs'
import AdminHighlights from './admin/AdminHighlights'
import AdminSettings from './admin/AdminSettings'
import AdminCompetitions from './admin/AdminCompetitions'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite' }}></div>
    </div>
  )
  return user ? children : <Navigate to="/admin/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/highlights" element={<Highlights />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="competitions" element={<AdminCompetitions />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="highlights" element={<AdminHighlights />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
