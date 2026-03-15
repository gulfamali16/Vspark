import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, X, Save,
  GraduationCap, Users, Trophy, Github, Linkedin, Mail,
  Star, BookOpen
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const inputSt = {
  width: '100%', padding: '11px 13px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(0,212,255,0.2)',
  color: '#e8eaf6', fontFamily: 'Rajdhani,sans-serif',
  fontSize: '0.93rem', outline: 'none', marginBottom: '0.9rem',
};

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#00d4ff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} /> Faculty Members
        </h2>
        <button className="btn-neon" onClick={() => { setForm(emptyForm); setEditing(null); setModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
          <Plus size={14} /> Add Faculty
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
        {faculty.map(f => (
          <div key={f.id} className="glass" style={{ padding: '1.5rem', borderLeft: `3px solid ${f.is_hod ? '#ffd700' : '#00d4ff'}`, opacity: f.is_active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {f.image_url ? (
                <img src={f.image_url} alt={f.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${f.is_hod ? '#ffd700' : 'rgba(0,212,255,0.3)'}` }} onError={e => e.target.style.display = 'none'} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '2px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} style={{ color: '#00d4ff' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.05rem', letterSpacing: 1.5, color: '#e8eaf6' }}>{f.name}</h3>
                  {f.is_hod && <Star size={12} style={{ color: '#ffd700' }} />}
                </div>
                <p style={{ color: '#00d4ff', fontSize: '0.8rem', marginBottom: 2 }}>{f.designation}</p>
                <p style={{ color: '#8892b0', fontSize: '0.78rem' }}>{f.specialization}</p>
              </div>
            </div>

            {f.bio && <p style={{ color: '#8892b0', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{f.bio.slice(0, 100)}{f.bio.length > 100 ? '...' : ''}</p>}

            <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {f.github_url && <a href={f.github_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8892b0', fontSize: '0.78rem', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#e8eaf6'} onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}><Github size={13} /> GitHub</a>}
              {f.linkedin_url && <a href={f.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8892b0', fontSize: '0.78rem', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'} onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}><Linkedin size={13} /> LinkedIn</a>}
              {f.email && <a href={`mailto:${f.email}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8892b0', fontSize: '0.78rem', textDecoration: 'none' }}><Mail size={13} /> Email</a>}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setForm(f); setEditing(f.id); setModal(true); }} style={{ flex: 1, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', cursor: 'pointer', padding: '6px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Edit2 size={12} /> Edit</button>
              <button onClick={() => del(f.id)} style={{ flex: 1, background: 'rgba(255,61,119,0.08)', border: '1px solid rgba(255,61,119,0.2)', color: '#ff3d77', cursor: 'pointer', padding: '6px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
        {faculty.length === 0 && <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No faculty added yet.</p>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: 560, padding: '2rem', borderColor: 'rgba(0,212,255,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6' }}>{editing ? 'Edit' : 'Add'} Faculty</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              {[['name', 'Full Name'], ['designation', 'Designation'], ['specialization', 'Specialization'], ['display_order', 'Display Order (number)']].map(([k, l]) => (
                <div key={k}>
                  <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>{l}</label>
                  <input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputSt} />
                </div>
              ))}
            </div>
            {[['image_url', 'Profile Image URL'], ['github_url', 'GitHub URL'], ['linkedin_url', 'LinkedIn URL'], ['email', 'Email']].map(([k, l]) => (
              <div key={k}>
                <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>{l}</label>
                <input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputSt} placeholder={k === 'image_url' ? 'https://...' : ''} />
              </div>
            ))}
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Bio</label>
            <textarea value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} style={{ ...inputSt, resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
              {[['is_hod', '⭐ Head of Department'], ['is_active', 'Active / Visible']].map(([k, l]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#8892b0', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={form[k] || false} onChange={e => setForm({ ...form, [k]: e.target.checked })} style={{ width: 'auto' }} />
                  {l}
                </label>
              ))}
            </div>
            <button onClick={save} className="btn-neon" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <Save size={14} /> {editing ? 'Update' : 'Add'} Faculty
            </button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={18} /> Academic Programs
        </h2>
        <button className="btn-neon" style={{ borderColor: '#7c3aed', color: '#7c3aed' }} onClick={() => { setForm(emptyForm); setEditing(null); setModal(true); }}>
          <Plus size={14} style={{ display: 'inline', marginRight: 6 }} /> Add Program
        </button>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {programs.map(p => (
          <div key={p.id} className="glass" style={{ padding: '1.5rem', borderLeft: '3px solid #7c3aed', opacity: p.is_active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: 2, color: '#e8eaf6' }}>{p.title}</h3>
                  <span style={{ padding: '2px 8px', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', border: '1px solid rgba(124,58,237,0.3)' }}>{p.degree}</span>
                  <span style={{ color: '#8892b0', fontSize: '0.8rem' }}>{p.duration}</span>
                  <span style={{ color: '#ffd700', fontSize: '0.8rem', fontFamily: 'JetBrains Mono' }}>Seats: {p.total_seats}</span>
                </div>
                <p style={{ color: '#8892b0', fontSize: '0.88rem', lineHeight: 1.6 }}>{p.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setForm(p); setEditing(p.id); setModal(true); }} style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', color: '#7c3aed', cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Edit2 size={12} /> Edit</button>
                <button onClick={() => del(p.id)} style={{ background: 'rgba(255,61,119,0.08)', border: '1px solid rgba(255,61,119,0.2)', color: '#ff3d77', cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {programs.length === 0 && <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No programs added yet.</p>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: 500, padding: '2rem', borderColor: 'rgba(124,58,237,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6' }}>{editing ? 'Edit' : 'Add'} Program</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              {[['title', 'Program Title'], ['degree', 'Degree (BS/MS/PhD)'], ['duration', 'Duration'], ['total_seats', 'Total Seats']].map(([k, l]) => (
                <div key={k}>
                  <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>{l}</label>
                  <input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputSt} />
                </div>
              ))}
            </div>
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Description</label>
            <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputSt, resize: 'vertical' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#8892b0', fontSize: '0.88rem', marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.is_active || false} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 'auto' }} />
              Active / Visible on website
            </label>
            <button onClick={save} className="btn-neon" style={{ width: '100%', borderColor: '#7c3aed', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <Save size={14} /> {editing ? 'Update' : 'Add'} Program
            </button>
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
    // Load saved achievement blog IDs
    supabase.from('site_settings').select('value').eq('key', 'achievement_blog_ids').single()
      .then(({ data }) => {
        if (data?.value) {
          try { setSelected(JSON.parse(data.value)); } catch (e) { }
        }
      });
  }, []);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const save = async () => {
    await supabase.from('site_settings').upsert([{ key: 'achievement_blog_ids', value: JSON.stringify(selected) }], { onConflict: 'key' });
    toast.success('Achievements saved! These blogs now show as Department Achievements.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#ffd700', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy size={18} /> Department Achievements
        </h2>
        <button onClick={save} className="btn-neon" style={{ borderColor: '#ffd700', color: '#ffd700', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
          <Save size={14} /> Save Selection
        </button>
      </div>

      <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', marginBottom: '1.5rem' }}>
        <p style={{ color: '#ffd700', fontSize: '0.82rem', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}>
          ✓ Select which blogs appear as "Department Achievements" on the CS Department page.<br />
          Only the blog title shows in the achievements section. Clicking it opens the full blog.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No blogs yet. Add blogs first from the Blogs section.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {blogs.map(blog => {
            const isSelected = selected.includes(blog.id);
            return (
              <div
                key={blog.id}
                onClick={() => toggle(blog.id)}
                style={{
                  padding: '1rem 1.5rem', cursor: 'pointer',
                  background: isSelected ? 'rgba(255,215,0,0.07)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'rgba(255,215,0,0.4)' : 'rgba(0,212,255,0.1)'}`,
                  borderLeft: `3px solid ${isSelected ? '#ffd700' : 'transparent'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <p style={{ color: '#e8eaf6', fontWeight: 600, fontSize: '0.92rem', marginBottom: 3 }}>{blog.title}</p>
                  <p style={{ color: '#8892b0', fontSize: '0.78rem', fontFamily: 'JetBrains Mono' }}>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isSelected ? '#ffd700' : 'transparent',
                  border: `2px solid ${isSelected ? '#ffd700' : 'rgba(0,212,255,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isSelected && <span style={{ color: '#050810', fontSize: '0.75rem', fontWeight: 900 }}>✓</span>}
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
    { id: 'faculty',      label: 'Faculty',      icon: Users,          color: '#00d4ff' },
    { id: 'programs',     label: 'Programs',     icon: BookOpen,       color: '#7c3aed' },
    { id: 'achievements', label: 'Achievements', icon: Trophy,         color: '#ffd700' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
            <GraduationCap size={32} style={{ color: '#00d4ff' }} /> CS Department
          </h1>
          <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>
            Manage faculty, programs, and department achievements
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '2rem', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
          {tabs.map(({ id, label, icon: Icon, color }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '10px 22px', background: 'transparent', border: 'none',
              borderBottom: tab === id ? `2px solid ${color}` : '2px solid transparent',
              color: tab === id ? color : '#8892b0',
              cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '1rem',
              display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s',
            }}>
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