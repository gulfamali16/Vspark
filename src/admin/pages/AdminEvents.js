import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, CalendarDays } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const empty = { title: '', description: '', date: '', venue: '', image_url: '' };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from('events').select('*').order('date').then(({ data }) => setEvents(data || []));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (evt) => { setForm(evt); setEditing(evt.id); setModal(true); };

  const save = async () => {
    if (!form.title || !form.date) { toast.error('Title and date required'); return; }
    const { error } = editing
      ? await supabase.from('events').update(form).eq('id', editing)
      : await supabase.from('events').insert([form]);
    if (error) { toast.error('Error saving'); return; }
    toast.success(editing ? 'Event updated!' : 'Event added!');
    setModal(false); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header flex justify-between items-center">
          <div>
            <h1 className="admin-page-title">Events</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Manage your event schedule and details</p>
          </div>
          <button onClick={openNew} className="btn-primary text-sm">
            <Plus size={16} /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {events.length === 0 && (
            <div className="admin-card text-center py-16">
              <CalendarDays size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No events yet. Click "Add Event" to create one.</p>
            </div>
          )}
          {events.map(evt => (
            <div key={evt.id} className="admin-card flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex flex-col items-center justify-center text-primary-600 flex-shrink-0">
                  <span className="font-sora font-black text-xl leading-none">{evt.date ? new Date(evt.date).getDate() : '—'}</span>
                  <span className="text-[9px] font-bold tracking-wider uppercase">{evt.date ? new Date(evt.date).toLocaleString('en-US', { month: 'short' }) : ''}</span>
                </div>
                <div>
                  <h3 className="font-sora font-bold text-gray-900 text-base mb-1">{evt.title}</h3>
                  <p className="text-gray-500 text-sm">{evt.date} · {evt.venue}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEdit(evt)} className="btn-outline text-sm py-2 px-4"><Edit2 size={14} /> Edit</button>
                <button onClick={() => del(evt.id)} className="btn-danger text-sm py-2 px-4"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-sora font-bold text-xl text-gray-900">{editing ? 'Edit' : 'Add'} Event</h2>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>
            {[['title', 'Title', 'text', 'e.g. Speed Programming'], ['date', 'Date', 'date', ''], ['venue', 'Venue', 'text', 'COMSATS Hall A'], ['image_url', 'Image URL', 'url', 'https://...']].map(([name, label, type, placeholder]) => (
              <div key={name} className="mb-5">
                <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</label>
                <input 
                  type={type} 
                  min={type === 'date' ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] : ''}
                  value={form[name] || ''} 
                  onChange={e => setForm({ ...form, [name]: e.target.value })}
                  placeholder={placeholder} 
                  className="admin-input" 
                />
              </div>
            ))}
            <div className="mb-6">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
                className="admin-input resize-y" />
            </div>
            <button onClick={save} className="btn-primary w-full justify-center py-3">
              <Save size={16} /> {editing ? 'Update' : 'Create'} Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
