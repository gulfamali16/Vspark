import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, X, Save,
  GraduationCap, Users, Trophy, Github, Linkedin, Mail,
  Star, BookOpen
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// ── FACULTY TAB ──────────────────────────────────────────────
function FacultyTab() {
  const [faculty, setFaculty] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { name: '', designation: '', specialization: '', bio: '', image_url: '', github_url: '', linkedin_url: '', email: '', is_hod: false, display_order: 0, is_active: true };
  const [form, setForm] = useState(emptyForm);

  const load = () => supabase.from('faculty').select('*').order('display_order').then(({ data }) => setFaculty(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name) { toast.error('Name required'); return; }
    const { error } = editing
      ? await supabase.from('faculty').update(form).eq('id', editing)
      : await supabase.from('faculty').insert([form]);
    if (error) { toast.error('Save failed'); return; }
    toast.success(editing ? 'Faculty updated!' : 'Faculty added!');
    setModal(false); setEditing(null); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    await supabase.from('faculty').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="mb-4">
      <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      <input type={type} value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })}
        placeholder={placeholder} className="admin-input" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sora font-bold text-xl text-gray-900 flex items-center gap-2"><Users size={18} className="text-primary-500" /> Faculty Members</h2>
        <button className="btn-primary text-sm" onClick={() => { setForm(emptyForm); setEditing(null); setModal(true); }}>
          <Plus size={14} /> Add Faculty
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {faculty.length === 0 && <p className="text-gray-400 text-sm font-medium col-span-3">No faculty added yet.</p>}
        {faculty.map(f => (
          <div key={f.id} className={`bg-white rounded-2xl border shadow-sm p-5 relative overflow-hidden ${!f.is_active ? 'opacity-60' : ''}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{ background: f.is_hod ? '#F59E0B' : '#4F46E5' }} />
            <div className="flex gap-4 pl-2 mb-4">
              {f.image_url ? (
                <img src={f.image_url} alt={f.name}
                  className="w-14 h-14 rounded-full object-cover border-2 flex-shrink-0"
                  style={{ borderColor: f.is_hod ? '#F59E0B' : '#E5E7EB' }}
                  onError={e => e.target.style.display = 'none'} />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center flex-shrink-0">
                  <Users size={22} className="text-primary-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-sora font-bold text-gray-900 truncate">{f.name}</h3>
                  {f.is_hod && <Star size={13} className="text-yellow-500 flex-shrink-0" />}
                </div>
                <p className="text-primary-600 text-xs font-semibold mb-0.5 truncate">{f.designation}</p>
                <p className="text-gray-400 text-xs truncate">{f.specialization}</p>
              </div>
            </div>

            {f.bio && <p className="text-gray-500 text-xs leading-relaxed mb-4 pl-2">{f.bio.slice(0, 100)}{f.bio.length > 100 ? '...' : ''}</p>}

            <div className="flex gap-3 mb-4 pl-2 flex-wrap">
              {f.github_url && <a href={f.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors"><Github size={12} /> GitHub</a>}
              {f.linkedin_url && <a href={f.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-gray-400 hover:text-primary-600 text-xs font-medium transition-colors"><Linkedin size={12} /> LinkedIn</a>}
              {f.email && <a href={`mailto:${f.email}`} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors"><Mail size={12} /> Email</a>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setForm(f); setEditing(f.id); setModal(true); }} className="btn-outline text-xs py-1.5 flex-1 justify-center"><Edit2 size={11} /> Edit</button>
              <button onClick={() => del(f.id)} className="btn-danger text-xs py-1.5 flex-1 justify-center"><Trash2 size={11} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-sora font-bold text-xl text-gray-900">{editing ? 'Edit' : 'Add'} Faculty</h3>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-5">
              <Field label="Full Name" field="name" />
              <Field label="Designation" field="designation" />
              <Field label="Specialization" field="specialization" />
              <Field label="Display Order" field="display_order" type="number" />
            </div>
            <Field label="Profile Image URL" field="image_url" placeholder="https://..." />
            <Field label="GitHub URL" field="github_url" />
            <Field label="LinkedIn URL" field="linkedin_url" />
            <Field label="Email" field="email" type="email" />
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Bio</label>
              <textarea value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="admin-input resize-y" />
            </div>
            <div className="flex gap-6 mb-6">
              {[['is_hod', '⭐ Head of Department'], ['is_active', 'Active / Visible']].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                  <input type="checkbox" className="w-4 h-4" checked={form[k] || false} onChange={e => setForm({ ...form, [k]: e.target.checked })} /> {l}
                </label>
              ))}
            </div>
            <button onClick={save} className="btn-primary w-full justify-center py-3"><Save size={14} /> {editing ? 'Update' : 'Add'} Faculty</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROGRAMS TAB ─────────────────────────────────────────────
function ProgramsTab() {
  const [programs, setPrograms] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { title: '', degree: 'BS', duration: '4 Years', description: '', total_seats: 60, is_active: true };
  const [form, setForm] = useState(emptyForm);

  const load = () => supabase.from('programs').select('*').order('title').then(({ data }) => setPrograms(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    const payload = { ...form, total_seats: parseInt(form.total_seats) || 60 };
    const { error } = editing
      ? await supabase.from('programs').update(payload).eq('id', editing)
      : await supabase.from('programs').insert([payload]);
    if (error) { toast.error('Save failed'); return; }
    toast.success(editing ? 'Program updated!' : 'Program added!');
    setModal(false); setEditing(null); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this program?')) return;
    await supabase.from('programs').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sora font-bold text-xl text-gray-900 flex items-center gap-2"><BookOpen size={18} className="text-indigo-500" /> Academic Programs</h2>
        <button className="btn-primary text-sm" onClick={() => { setForm(emptyForm); setEditing(null); setModal(true); }}>
          <Plus size={14} /> Add Program
        </button>
      </div>

      <div className="space-y-4">
        {programs.length === 0 && <p className="text-gray-400 text-sm font-medium">No programs added yet.</p>}
        {programs.map(p => (
          <div key={p.id} className={`admin-card flex justify-between items-start flex-wrap gap-4 relative overflow-hidden ${!p.is_active ? 'opacity-60' : ''}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl bg-indigo-500" />
            <div className="flex-1 pl-3">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h3 className="font-sora font-bold text-gray-900">{p.title}</h3>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[11px] font-bold">{p.degree}</span>
                <span className="text-gray-400 text-sm">{p.duration}</span>
                <span className="text-sm font-bold text-gray-700">Seats: {p.total_seats}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setForm(p); setEditing(p.id); setModal(true); }} className="btn-outline text-xs py-1.5 px-3"><Edit2 size={12} /> Edit</button>
              <button onClick={() => del(p.id)} className="btn-danger text-xs py-1.5 px-3"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-sora font-bold text-xl text-gray-900">{editing ? 'Edit' : 'Add'} Program</h3>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-5">
              {[['title', 'Program Title'], ['degree', 'Degree (BS/MS/PhD)'], ['duration', 'Duration'], ['total_seats', 'Total Seats']].map(([k, l]) => (
                <div key={k} className="mb-4">
                  <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{l}</label>
                  <input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} className="admin-input" />
                </div>
              ))}
            </div>
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="admin-input resize-y" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600 mb-6">
              <input type="checkbox" className="w-4 h-4" checked={form.is_active || false} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              Active / Visible on website
            </label>
            <button onClick={save} className="btn-primary w-full justify-center py-3"><Save size={14} /> {editing ? 'Update' : 'Add'} Program</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ACHIEVEMENTS TAB ─────────────────────────────────────────
function AchievementsTab() {
  const [blogs, setBlogs] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    supabase.from('blogs').select('*').order('created_at', { ascending: false }).then(({ data }) => setBlogs(data || []));
    supabase.from('site_settings').select('value').eq('key', 'achievement_blog_ids').single()
      .then(({ data }) => {
        if (data?.value) { try { setSelected(JSON.parse(data.value)); } catch (e) {} }
      });
  }, []);

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const save = async () => {
    await supabase.from('site_settings').upsert([{ key: 'achievement_blog_ids', value: JSON.stringify(selected) }], { onConflict: 'key' });
    toast.success('Achievements saved! These blogs now show as Department Achievements.');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-sora font-bold text-xl text-gray-900 flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /> Department Achievements</h2>
        <button onClick={save} className="btn-primary text-sm"><Save size={14} /> Save Selection</button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6">
        <p className="text-yellow-800 text-sm leading-relaxed">
          ✓ Select which blogs appear as "Department Achievements" on the CS Department page.<br />
          Only the blog title shows in the achievements section. Clicking it opens the full blog.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-400 text-sm font-medium">No blogs yet. Add blogs first from the Blogs section.</p>
      ) : (
        <div className="space-y-3">
          {blogs.map(blog => {
            const isSelected = selected.includes(blog.id);
            return (
              <div key={blog.id} onClick={() => toggle(blog.id)}
                className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
              >
                <div>
                  <p className={`font-sora font-bold text-sm mb-1 ${isSelected ? 'text-yellow-900' : 'text-gray-800'}`}>{blog.title}</p>
                  <p className="text-gray-400 text-xs">{new Date(blog.created_at).toLocaleDateString()}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="text-white text-[10px] font-black">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────
export default function AdminDepartment() {
  const [tab, setTab] = useState('faculty');

  const tabs = [
    { id: 'faculty',      label: 'Faculty',      icon: Users },
    { id: 'programs',     label: 'Programs',     icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title flex items-center gap-3">
            <GraduationCap size={22} className="text-primary-600" /> CS Department
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Manage faculty, programs, and department achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-7 py-3.5 font-sora font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
                tab === id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === 'faculty'      && <FacultyTab />}
        {tab === 'programs'     && <ProgramsTab />}
        {tab === 'achievements' && <AchievementsTab />}
      </main>
    </div>
  );
}