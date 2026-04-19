import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CalendarDays, Users,
  FileText, Image, LogOut, ChevronRight,
  Swords, Settings, GraduationCap, UserCog, Shield, Trophy, Building,
  Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const ALL_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', perm: null },
  { to: '/admin/registrations', icon: Users, label: 'Registrations', perm: 'registrations', badge: true },
  { to: '/admin/competitions', icon: Swords, label: 'Competitions', perm: 'competitions' },
  { to: '/admin/results', icon: Trophy, label: 'Results', perm: 'results' },
  { to: '/admin/schedule', icon: Calendar, label: 'Schedule', perm: 'schedule' },
  { to: '/admin/events', icon: CalendarDays, label: 'Events', perm: 'events' },
  { to: '/admin/department', icon: GraduationCap, label: 'CS Department', perm: 'department' },
  { to: '/admin/universities', icon: Building, label: 'Universities', perm: 'universities' },
  { to: '/admin/blogs', icon: FileText, label: 'Blogs', perm: 'blogs' },
  { to: '/admin/highlights', icon: Image, label: 'Highlights', perm: 'highlights' },
  { to: '/admin/assistants', icon: UserCog, label: 'Assistants', perm: 'assistants' },
  { to: '/admin/settings', icon: Settings, label: 'Settings', perm: 'settings' },
];

export default function AdminSidebar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('Admin');
  const [perms, setPerms] = useState(['all']);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('vspark_role') || 'admin';
    const storedName = sessionStorage.getItem('vspark_name') || 'Admin';
    const storedPerms = sessionStorage.getItem('vspark_perms');
    setRole(storedRole);
    setName(storedName);
    setPerms(storedPerms ? JSON.parse(storedPerms) : ['all']);
  }, [loc.pathname]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [loc.pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('vspark_role');
    sessionStorage.removeItem('vspark_name');
    sessionStorage.removeItem('vspark_perms');
    navigate('/admin/login');
  };

  const visibleItems = ALL_ITEMS.filter(item => {
    if (!item.perm) return true;
    if (perms.includes('all')) return true;
    return perms.includes(item.perm);
  });

  const isAdmin = role === 'admin';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-primary-600 text-white rounded-full shadow-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 z-[55] flex flex-col w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/images/vspark.png" alt="VSpark" className="h-12 w-auto object-contain" />
            <div className="text-[10px] font-bold tracking-widest text-gray-400">
              {isAdmin ? 'ADMIN' : 'STAFF'}
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* ── User info ── */}
        <div className="p-4 mx-3 my-4 bg-gray-50 border border-gray-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-primary-100 text-primary-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {isAdmin ? <Shield size={18} /> : <UserCog size={18} />}
            </div>
            <div className="overflow-hidden">
              <p className="text-gray-900 text-sm font-bold truncate">{name}</p>
              <p className={`text-[10px] uppercase tracking-wider font-bold ${isAdmin ? 'text-primary-500' : 'text-indigo-500'}`}>
                {isAdmin ? 'SUPER ADMIN' : 'ASSISTANT'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1 custom-scrollbar">
          {visibleItems.map(({ to, icon: Icon, label, badge }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={active ? 'text-primary-600' : 'text-gray-400'} />
                {label}
                {badge && <span className="ml-auto w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />}
                {active && !badge && <ChevronRight size={16} className="ml-auto text-primary-400" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}