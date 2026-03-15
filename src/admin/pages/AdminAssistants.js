import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, UserCog, Shield, Eye } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// All possible permissions
const ALL_PERMISSIONS = [
  { key: 'registrations', label: 'Registrations',  desc: 'View & approve/reject registrations' },
  { key: 'competitions',  label: 'Competitions',   desc: 'Manage competition categories' },
  { key: 'schedule',      label: 'Schedule',       desc: 'Manage rooms, slots, schedule' },
  { key: 'events',        label: 'Events',         desc: 'Add/edit/delete events' },
  { key: 'department',    label: 'CS Department',  desc: 'Manage faculty & programs' },
  { key: 'blogs',         label: 'Blogs',          desc: 'Add/edit/delete blogs' },
  { key: 'highlights',    label: 'Highlights',     desc: 'Manage gallery highlights' },
  { key: 'settings',      label: 'Settings',       desc: 'Change site & payment settings' },
];

const inputSt = {
  width: '100%', padding: '11px 13px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(0,212,255,0.2)',
  color: '#e8eaf6', fontFamily: 'Rajdhani,sans-serif',
  fontSize: '0.93rem', outline: 'none', marginBottom: '0.9rem',
};

export default function AdminAssistants() {
  const [assistants, setAssistants] = useState([]);
  const [modal, setModal] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', permissions: [] });
  const [creating, setCreating] = useState(false);

  const load = () => supabase.from('admin_assistants').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setAssistants(data || []));

  useEffect(() => { load(); }, []);

  const togglePerm = (key) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const create = async () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    if (form.permissions.length === 0) { toast.error('Select at least one permission'); return; }

    setCreating(true);
    try {
      // 1. Create Supabase Auth user for the assistant
      const tempPass = 'VSpark@' + Math.random().toString(36).slice(-6).toUpperCase();

      const authRes = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.REACT_APP_SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          email: form.email,
          password: tempPass,
          email_confirm: true,
        }),
      });

      const authData = await authRes.json();
      const alreadyExists = authData?.code === 'email_exists' || authData?.msg?.includes('already been registered');

      if (!authRes.ok && !alreadyExists) {
        throw new Error('Could not create auth user: ' + (authData?.msg || 'Unknown error'));
      }

      // 2. Save to admin_assistants table
      const { error: dbErr } = await supabase.from('admin_assistants').insert([{
        name: form.name,
        email: form.email,
        permissions: form.permissions,
        is_active: true,
      }]);

      if (dbErr) throw new Error(dbErr.message);

      toast.success('Assistant created!');
      alert(
        `✅ Assistant Account Created!\n\n` +
        `Name:     ${form.name}\n` +
        `Email:    ${form.email}\n` +
        `Password: ${tempPass}\n\n` +
        `Send these credentials to the assistant.\n` +
        `They log in at: ${window.location.origin}/admin/login`
      );

      setModal(false);
      setForm({ name: '', email: '', permissions: [] });
      load();

    } catch (err) {
      toast.error('Error: ' + err.message);
    }
    setCreating(false);
  };

  const toggleActive = async (id, val) => {
    await supabase.from('admin_assistants').update({ is_active: val }).eq('id', id);
    toast.success(val ? 'Assistant activated' : 'Assistant deactivated');
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this assistant account?')) return;
    await supabase.from('admin_assistants').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
              <UserCog size={30} style={{ color: '#7c3aed' }} /> Assistant Accounts
            </h1>
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>
              Create limited-access accounts for team members
            </p>
          </div>
          <button className="btn-neon" onClick={() => { setForm({ name: '', email: '', permissions: [] }); setModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', borderColor: '#7c3aed', color: '#7c3aed' }}>
            <Plus size={15} /> Create Assistant
          </button>
        </div>

        {/* Info box */}
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderLeft: '4px solid #7c3aed', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Shield size={16} style={{ color: '#7c3aed', marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ color: '#7c3aed', fontWeight: 700, marginBottom: 4 }}>How assistants work</p>
              <p style={{ color: '#8892b0', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Each assistant logs in at <code style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>/admin/login</code> with their own credentials.
                They only see the sections you grant them permission to. You can deactivate them anytime instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Assistants list */}
        {assistants.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
            <UserCog size={40} style={{ color: '#8892b0', marginBottom: '1rem' }} />
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>No assistants yet. Create one to delegate access.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {assistants.map(a => (
              <div key={a.id} className="glass" style={{ padding: '1.5rem', borderLeft: `3px solid ${a.is_active ? '#7c3aed' : '#8892b0'}`, opacity: a.is_active ? 1 : 0.55 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: 2, color: '#e8eaf6' }}>{a.name}</h3>
                      <span style={{ padding: '2px 8px', background: a.is_active ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)', color: a.is_active ? '#00ff88' : '#8892b0', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', border: `1px solid ${a.is_active ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                        {a.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 10 }}>{a.email}</p>

                    {/* Permissions badges */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(a.permissions || []).map(p => {
                        const perm = ALL_PERMISSIONS.find(x => x.key === p);
                        return (
                          <span key={p} style={{ padding: '2px 10px', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', fontSize: '0.68rem', fontFamily: 'JetBrains Mono', border: '1px solid rgba(124,58,237,0.25)' }}>
                            {perm?.label || p}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => toggleActive(a.id, !a.is_active)}
                      style={{ padding: '7px 14px', background: a.is_active ? 'rgba(255,107,0,0.08)' : 'rgba(0,255,136,0.08)', border: `1px solid ${a.is_active ? 'rgba(255,107,0,0.3)' : 'rgba(0,255,136,0.3)'}`, color: a.is_active ? '#ff6b00' : '#00ff88', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600 }}
                    >
                      {a.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => del(a.id)} style={{ padding: '7px 12px', background: 'rgba(255,61,119,0.08)', border: '1px solid rgba(255,61,119,0.2)', color: '#ff3d77', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600 }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: 540, padding: '2.5rem', borderColor: 'rgba(124,58,237,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: 2, color: '#e8eaf6' }}>Create Assistant</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ali Hassan" style={inputSt} />

            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="assistant@email.com" style={inputSt} />

            {/* Permissions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                Permissions — Select what they can access
              </label>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {ALL_PERMISSIONS.map(({ key, label, desc }) => {
                  const checked = form.permissions.includes(key);
                  return (
                    <div
                      key={key}
                      onClick={() => togglePerm(key)}
                      style={{
                        padding: '0.75rem 1rem', cursor: 'pointer',
                        background: checked ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${checked ? 'rgba(124,58,237,0.4)' : 'rgba(0,212,255,0.1)'}`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div>
                        <span style={{ color: checked ? '#7c3aed' : '#e8eaf6', fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
                        <span style={{ color: '#8892b0', fontSize: '0.78rem', marginLeft: 10 }}>{desc}</span>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: 3, background: checked ? '#7c3aed' : 'transparent', border: `2px solid ${checked ? '#7c3aed' : 'rgba(0,212,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {checked && <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 900 }}>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={create} disabled={creating} className="btn-neon" style={{ width: '100%', borderColor: '#7c3aed', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.6 : 1, fontSize: '1rem' }}>
              <Shield size={16} /> {creating ? 'Creating...' : 'Create Assistant Account'}
            </button>

            <p style={{ color: '#8892b0', fontSize: '0.78rem', textAlign: 'center', marginTop: '0.75rem', fontFamily: 'JetBrains Mono' }}>
              A random password will be generated and shown to you
            </p>
          </div>
        </div>
      )}
    </div>
  );
}