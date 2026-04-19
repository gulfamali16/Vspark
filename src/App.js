import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Core
import Home from './pages/Home';

// Website Pages (Lazy)
const Competitions = lazy(() => import('./pages/Competitions'));
const Events = lazy(() => import('./pages/Events'));
const Register = lazy(() => import('./pages/Register'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Highlights = lazy(() => import('./pages/Highlights'));
const Department = lazy(() => import('./pages/Department'));
const Login = lazy(() => import('./pages/Login'));
const StudentCard = lazy(() => import('./pages/StudentCard'));

// Admin Pages (Lazy)
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminEvents = lazy(() => import('./admin/pages/AdminEvents'));
const AdminRegistrations = lazy(() => import('./admin/pages/AdminRegistrations'));
const AdminBlogs = lazy(() => import('./admin/pages/AdminBlogs'));
const AdminHighlights = lazy(() => import('./admin/pages/AdminHighlights'));
const AdminResults = lazy(() => import('./admin/pages/AdminResults'));
const AdminCompetitions = lazy(() => import('./admin/pages/AdminCompetitions'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminSchedule = lazy(() => import('./admin/pages/AdminSchedule'));
const AdminDepartment = lazy(() => import('./admin/pages/AdminDepartment'));
const AdminAssistants = lazy(() => import('./admin/pages/AdminAssistants'));
const AdminUniversities = lazy(() => import('./admin/pages/AdminUniversities'));

import AdminRoute from './admin/components/AdminRoute';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style:{background:'#0a0f1e',color:'#e8eaf6',border:'1px solid rgba(0,212,255,0.3)'}
      }}/>
      <Suspense fallback={<LoadingSpinner />}>
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
          <Route path="/admin/results" element={<AdminRoute><AdminResults /></AdminRoute>} />
          <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
          <Route path="/admin/highlights" element={<AdminRoute><AdminHighlights /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/admin/schedule" element={<AdminRoute><AdminSchedule /></AdminRoute>} />
          <Route path="/admin/department" element={<AdminRoute><AdminDepartment /></AdminRoute>} />
          <Route path="/admin/assistants" element={<AdminRoute><AdminAssistants /></AdminRoute>} /> 
          <Route path="/admin/universities" element={<AdminRoute><AdminUniversities /></AdminRoute>} /> 
          <Route path="/card" element={<StudentCard />} /> 
        </Routes>
      </Suspense>
    </Router>
  );
}
