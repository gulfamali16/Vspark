import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ToggleLeft, ToggleRight, Swords } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const empty = { title:'', category:'Technical', short_desc:'', fee:0, color:'#4F46E5', rules:'', prizes:'', is_active:true, is_new:false, date_announced:false, event_date:'' };

export default function AdminCompetitions() {
  const [comps, setComps] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from('competitions').select('*').order('title').then(({ data }) => setComps(data || []));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = c => { setForm(c); setEditing(c.id); setModal(true); };

  const save = async () => {
    const nameRegex = /^[A-Za-z\s.]+$/;
    if (!form.title || !form.fee) { toast.error('Title and fee required'); return; }
    if (!nameRegex.test(form.title)) { toast.error('Title should only contain letters'); return; }
    const payload = { ...form, fee: parseInt(form.fee) || 0 };
    const { error } = editing
      ? await supabase.from('competitions').update(payload).eq('id', editing)
      : await supabase.from('competitions').insert([payload]);
    if (error) { toast.error('Error saving'); return; }
    toast.success(editing ? 'Competition updated!' : 'Competition added!');
    setModal(false); load();
  };

  const del = async id => {
    if (!window.confirm('Delete this competition?')) return;
    await supabase.from('competitions').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const toggleActive = async (id, val) => {
    await supabase.from('competitions').update({ is_active: val }).eq('id', id);
    load();
  };

  const InputField = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="mb-4">
      <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      <input type={type} value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })}
        placeholder={placeholder} className="admin-input" />
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="admin-page-title flex items-center gap-3">
              <Swords size={20} className="text-primary-600" /> Competitions
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Manage competition categories, fees, rules, and date announcements
            </p>
          </div>
          <button onClick={openNew} className="btn-primary text-sm">
            <Plus size={16} /> Add Competition
          </button>
        </div>

        <div className="space-y-4">
          {comps.length === 0 && (
            <div className="admin-card text-center py-16">
              <Swords size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No competitions yet.</p>
            </div>
          )}
          {comps.map(comp => (
            <div key={comp.id}
              className={`admin-card flex justify-between items-center flex-wrap gap-4 relative overflow-hidden ${!comp.is_active ? 'opacity-60' : ''}`}
            >
              <div className="absolute left-0 top-0 w-1.5 h-full rounded-l-2xl" style={{ background: comp.color || '#4F46E5' }} />
              <div className="flex-1 pl-3">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="font-sora font-black text-lg text-gray-900">{comp.title}</h3>
                  {comp.is_new && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold tracking-wider">NEW</span>
                  )}
                  <span className="px-2 py-0.5 bg-primary-50 text-primary-600 border border-primary-100 rounded-full text-[10px] font-bold">{comp.category}</span>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <span className="font-sora font-bold text-gray-900">PKR {comp.fee?.toLocaleString()}</span>
                  <span className={`text-sm font-medium ${comp.date_announced && comp.event_date ? 'text-emerald-600' : 'text-gray-400'}`}>
                    📅 {comp.date_announced && comp.event_date ? comp.event_date : 'Date not announced'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(comp.id, !comp.is_active)}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${comp.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {comp.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  {comp.is_active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(comp)} className="btn-outline text-xs py-1.5 px-3"><Edit2 size={13} /> Edit</button>
                <button onClick={() => del(comp.id)} className="btn-danger text-xs py-1.5 px-3"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-sora font-bold text-xl text-gray-900">{editing ? 'Edit' : 'Add'} Competition</h2>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-x-5">
              <InputField label="Title" field="title" placeholder="Speed Programming" />
              <InputField label="Category" field="category" placeholder="Technical / Creative" />
              <InputField label="Registration Fee (PKR)" field="fee" type="number" placeholder="500" />
              <InputField label="Color (hex)" field="color" placeholder="#4F46E5" />
            </div>
            <InputField label="Short Description" field="short_desc" placeholder="A short tagline for the competition..." />

            <div className="mb-4">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Rules (one per line)</label>
              <textarea value={form.rules || ''} onChange={e => setForm({ ...form, rules: e.target.value })} rows={4} className="admin-input resize-y" />
            </div>
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Prizes (one per line)</label>
              <textarea value={form.prizes || ''} onChange={e => setForm({ ...form, prizes: e.target.value })} rows={3} className="admin-input resize-y" />
            </div>

            {/* Date announcement */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-5">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" className="w-4 h-4" id="dateAnn" checked={form.date_announced || false}
                  onChange={e => setForm({ ...form, date_announced: e.target.checked })} />
                <span className="font-sora font-bold text-yellow-800 text-sm">Announce Event Date</span>
              </label>
              {form.date_announced ? (
                <div>
                  <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Event Date & Time</label>
                  <input 
                    type="datetime-local" 
                    min={new Date().toISOString().slice(0, 16)}
                    value={form.event_date || ''} 
                    onChange={e => setForm({ ...form, event_date: e.target.value })} 
                    className="admin-input" 
                  />
                </div>
              ) : (
                <p className="text-yellow-700 text-xs font-medium">Date will show as "To be announced" on the website</p>
              )}
            </div>

            <div className="flex gap-6 mb-6">
              {[['is_active', 'Show on Website'], ['is_new', 'Mark as NEW']].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input type="checkbox" className="w-4 h-4" checked={form[k] || false} onChange={e => setForm({ ...form, [k]: e.target.checked })} />
                  {l}
                </label>
              ))}
            </div>

            <button onClick={save} className="btn-primary w-full justify-center py-3">
              <Save size={16} /> {editing ? 'Update' : 'Add'} Competition
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
