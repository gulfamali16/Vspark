import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, UserCog, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

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

export default function AdminAssistants() {
  const [assistants, setAssistants] = useState([]);
  const [modal, setModal] = useState(false);
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
      const tempPass = 'VSpark@' + Math.random().toString(36).slice(-6).toUpperCase();

      const authRes = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.REACT_APP_SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ email: form.email, password: tempPass, email_confirm: true }),
      });

      const authData = await authRes.json();
      const alreadyExists = authData?.code === 'email_exists' || authData?.msg?.includes('already been registered');

      if (!authRes.ok && !alreadyExists) {
        throw new Error('Could not create auth user: ' + (authData?.msg || 'Unknown error'));
      }

      const { error: dbErr } = await supabase.from('admin_assistants').insert([{
        name: form.name, email: form.email, permissions: form.permissions, is_active: true,
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
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="admin-page-title flex items-center gap-3">
              <UserCog size={22} className="text-indigo-600" /> Assistant Accounts
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Create limited-access accounts for team members
            </p>
          </div>
          <button onClick={() => { setForm({ name: '', email: '', permissions: [] }); setModal(true); }} className="btn-primary text-sm">
            <Plus size={16} /> Create Assistant
          </button>
        </div>

        {/* Info box */}
        <div className="bg-indigo-50 border border-indigo-200 border-l-4 border-l-indigo-500 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <Shield size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-sora font-bold text-indigo-700 mb-1">How assistants work</p>
            <p className="text-indigo-600 text-sm leading-relaxed">
              Each assistant logs in at <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-700 font-mono text-xs">/admin/login</code> with their own credentials.
              They only see the sections you grant them permission to. You can deactivate them anytime instantly.
            </p>
          </div>
        </div>

        {/* Assistants list */}
        {assistants.length === 0 ? (
          <div className="admin-card text-center py-16">
            <UserCog size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No assistants yet. Create one to delegate access.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assistants.map(a => (
              <div key={a.id} className={`admin-card flex justify-between items-start flex-wrap gap-4 relative overflow-hidden ${!a.is_active ? 'opacity-60' : ''}`}>
                <div className="absolute left-0 top-0 w-1.5 h-full rounded-l-2xl" style={{ background: a.is_active ? '#7C3AED' : '#9CA3AF' }} />
                <div className="flex-1 pl-3">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-sora font-bold text-gray-900 text-base">{a.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      a.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {a.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{a.email}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(a.permissions || []).map(p => {
                      const perm = ALL_PERMISSIONS.find(x => x.key === p);
                      return (
                        <span key={p} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[11px] font-bold">
                          {perm?.label || p}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => toggleActive(a.id, !a.is_active)}
                    className={`flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-xl border transition-colors ${
                      a.is_active
                        ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {a.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {a.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => del(a.id)} className="btn-danger text-sm py-2 px-4">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-sora font-bold text-xl text-gray-900">Create Assistant</h3>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"><X size={18} /></button>
            </div>

            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ali Hassan" className="admin-input" />
            </div>
            <div className="mb-6">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="assistant@email.com" className="admin-input" />
            </div>

            {/* Permissions */}
            <div className="mb-6">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-3">
                Permissions — Select what they can access
              </label>
              <div className="space-y-2">
                {ALL_PERMISSIONS.map(({ key, label, desc }) => {
                  const checked = form.permissions.includes(key);
                  return (
                    <div key={key} onClick={() => togglePerm(key)}
                      className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? 'bg-indigo-50 border-indigo-300'
                          : 'bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div>
                        <span className={`font-sora font-bold text-sm ${checked ? 'text-indigo-700' : 'text-gray-700'}`}>{label}</span>
                        <span className="text-gray-400 text-xs ml-2">{desc}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                      }`}>
                        {checked && <span className="text-white text-[10px] font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={create} disabled={creating}
              className={`w-full btn-primary justify-center py-4 text-base ${creating ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{ background: creating ? '#6D28D9' : undefined }}
            >
              <Shield size={16} /> {creating ? 'Creating...' : 'Create Assistant Account'}
            </button>
            <p className="text-gray-400 text-xs text-center mt-3">A random password will be generated and shown to you</p>
          </div>
        </div>
      )}
    </div>
  );
}