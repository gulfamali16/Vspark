import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Image, TrendingUp, Clock, CheckCircle, XCircle, Swords, Shield, UserCog, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, pending: 0, approved: 0, rejected: 0, blogs: 0, competitions: 0 });
  const [recent, setRecent] = useState([]);
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('Admin');
  const [perms, setPerms] = useState(['all']);

  useEffect(() => {
    // Get role info from sessionStorage
    const storedRole  = sessionStorage.getItem('vspark_role')  || 'admin';
    const storedName  = sessionStorage.getItem('vspark_name')  || 'Admin';
    const storedPerms = sessionStorage.getItem('vspark_perms');
    setRole(storedRole);
    setName(storedName);
    setPerms(storedPerms ? JSON.parse(storedPerms) : ['all']);

    // Load stats
    Promise.all([
      supabase.from('events').select('id', { count: 'exact' }),
      supabase.from('registration_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('registration_requests').select('id', { count: 'exact' }).eq('status', 'approved'),
      supabase.from('registration_requests').select('id', { count: 'exact' }).eq('status', 'rejected'),
      supabase.from('blogs').select('id', { count: 'exact' }),
      supabase.from('competitions').select('id', { count: 'exact' }),
      supabase.from('registration_requests').select('*, competitions(title)').order('id', { ascending: false }).limit(6),
    ]).then(([ev, pend, appr, rej, bl, comp, rec]) => {
      setStats({
        events: ev.count || 0,
        pending: pend.count || 0,
        approved: appr.count || 0,
        rejected: rej.count || 0,
        blogs: bl.count || 0,
        competitions: comp.count || 0,
      });
      setRecent(rec.data || []);
    });
  }, []);

  const isAdmin = role === 'admin';
  const hasAll  = perms.includes('all');

  const cards = [
    { icon: Clock,         label: 'Pending',      value: stats.pending,      color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', perm: 'registrations', urgent: stats.pending > 0 },
    { icon: CheckCircle,   label: 'Approved',     value: stats.approved,     color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', perm: 'registrations' },
    { icon: XCircle,       label: 'Rejected',     value: stats.rejected,     color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', perm: 'registrations' },
    { icon: Swords,        label: 'Competitions', value: stats.competitions, color: 'text-primary-500', bg: 'bg-primary-50', border: 'border-primary-200', perm: 'competitions' },
    { icon: Calendar,      label: 'Events',       value: stats.events,       color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', perm: 'events' },
    { icon: FileText,      label: 'Blogs',        value: stats.blogs,        color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', perm: 'blogs' },
  ].filter(c => hasAll || perms.includes(c.perm));

  const statusColor = s => {
    if (s === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-orange-50 text-orange-700 border-orange-200';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 lg:p-10">

        {/* Header — shows correct name and role */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-sora font-black text-3xl text-gray-900 leading-none">
                Dashboard
              </h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isAdmin ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                {isAdmin ? <Shield size={14} /> : <UserCog size={14} />}
                <span className="font-bold text-[10px] tracking-widest uppercase">
                  {isAdmin ? 'SUPER ADMIN' : 'ASSISTANT'}
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              Welcome back, <span className={`font-semibold ${isAdmin ? 'text-primary-600' : 'text-indigo-600'}`}>{name}</span> — VSpark Control Panel
            </p>
          </div>

          {/* Show assistant permissions as tags */}
          {!isAdmin && (
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl max-w-sm">
              <p className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase mb-2">YOUR ACCESS</p>
              <div className="flex gap-2 flex-wrap">
                {perms.map(p => (
                  <span key={p} className="px-2 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded capitalize">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pending alert */}
        {stats.pending > 0 && (hasAll || perms.includes('registrations')) && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-orange-400"></div>
            <Clock size={20} className="text-orange-500 flex-shrink-0" />
            <p className="text-orange-800 font-medium text-sm md:text-base flex-1">
              <strong>{stats.pending}</strong> pending registration request{stats.pending > 1 ? 's' : ''} waiting for approval.
            </p>
            <Link to="/admin/registrations" className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-lg border border-orange-200 shadow-sm transition-colors whitespace-nowrap">
              Review Now
            </Link>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
          {cards.map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${bg} -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500`} />
              <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 rounded-full ${bg} border ${border} flex items-center justify-center ${color} relative z-10`}>
                   <Icon size={18} />
                </div>
                <TrendingUp size={16} className="text-emerald-500 relative z-10" />
              </div>
              <div className="font-sora font-black text-3xl text-gray-900 mb-1 relative z-10">{value}</div>
              <div className="text-[11px] font-bold text-gray-500 tracking-widest uppercase relative z-10">{label}</div>
            </div>
          ))}
        </div>

        {/* Recent requests — only show if has access */}
        {(hasAll || perms.includes('registrations')) && (
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
               <h2 className="font-sora font-bold text-lg md:text-xl text-gray-900 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                   <Users size={16} />
                 </div>
                 Recent Requests
               </h2>
               <Link to="/admin/registrations" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                 View All <ChevronRight size={16} />
               </Link>
            </div>

            {recent.length === 0
              ? <div className="text-center py-10 text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">No requests yet.</div>
              : (
                <div className="overflow-x-auto -mx-5 sm:mx-0">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="px-5 sm:px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Name</th>
                        <th className="hidden sm:table-cell px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Email</th>
                        <th className="hidden md:table-cell px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Institute</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Competition</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recent.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 sm:px-4 py-4 text-sm font-bold text-gray-900">{r.student_name}</td>
                          <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-600">{r.email}</td>
                          <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-600">{r.institute}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 font-medium truncate max-w-[120px]">{r.competitions?.title || r.competition_id}</td>
                          <td className="px-4 py-4 text-right">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded border ${statusColor(r.status)}`}>
                              {r.status?.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        )}
      </main>
    </div>
  );
}