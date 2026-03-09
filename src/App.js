import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Website
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import Events from './pages/Events';
import Register from './pages/Register';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Highlights from './pages/Highlights';
import Department from './pages/Department';
import Login from './pages/Login';

// Admin
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminEvents from './admin/pages/AdminEvents';
import AdminRegistrations from './admin/pages/AdminRegistrations';
import AdminBlogs from './admin/pages/AdminBlogs';
import AdminHighlights from './admin/pages/AdminHighlights';
import AdminCompetitions from './admin/pages/AdminCompetitions';
import AdminSettings from './admin/pages/AdminSettings';
import AdminRoute from './admin/components/AdminRoute';
import AdminSchedule from './admin/pages/AdminSchedule';
import StudentCard from './pages/StudentCard';

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style:{background:'#0a0f1e',color:'#e8eaf6',border:'1px solid rgba(0,212,255,0.3)'}
      }}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/highlights" element={<Highlights />} />
        <Route path="/department" element={<Department />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
        <Route path="/admin/competitions" element={<AdminRoute><AdminCompetitions /></AdminRoute>} />
        <Route path="/admin/registrations" element={<AdminRoute><AdminRegistrations /></AdminRoute>} />
        <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
        <Route path="/admin/highlights" element={<AdminRoute><AdminHighlights /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/schedule" element={<AdminRoute><AdminSchedule /></AdminRoute>} />
        <Route path="/card" element={<StudentCard />} /> 
      </Routes>
    </Router>
  );
}
