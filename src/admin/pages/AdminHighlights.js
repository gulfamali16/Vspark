import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, Image } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ image_url: '', description: '' });

  const load = () => supabase.from('highlights').select('*').order('created_at', { ascending: false }).then(({ data }) => setHighlights(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.image_url) { toast.error('Image URL required'); return; }
    const { error } = await supabase.from('highlights').insert([form]);
    if (error) { toast.error('Error adding'); return; }
    toast.success('Highlight added!'); setModal(false); setForm({ image_url: '', description: '' }); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this highlight?')) return;
    await supabase.from('highlights').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header flex justify-between items-center">
          <div>
            <h1 className="admin-page-title">Highlights</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Manage your event photo gallery</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary text-sm">
            <Plus size={16} /> Add Highlight
          </button>
        </div>

        {highlights.length === 0 ? (
          <div className="admin-card text-center py-16">
            <Image size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No highlights yet. Add image URLs to create your gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {highlights.map(h => (
              <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img src={h.image_url} alt="Highlight" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                {h.description && (
                  <div className="px-4 py-2">
                    <p className="text-gray-600 text-sm font-medium truncate">{h.description}</p>
                  </div>
                )}
                <div className="px-4 pb-4 flex justify-end">
                  <button onClick={() => del(h.id)} className="btn-danger text-xs py-1.5 px-3">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-sora font-bold text-xl text-gray-900">Add Highlight</h2>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Image URL (GitHub or CDN)</label>
              <input
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="admin-input"
              />
            </div>
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Description (optional)</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Opening Ceremony 2025"
                className="admin-input"
              />
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="" className="w-full max-h-40 object-cover rounded-xl border border-gray-200 mb-5" onError={e => e.target.style.display = 'none'} />
            )}
            <button onClick={save} className="btn-primary w-full justify-center py-3">
              <Save size={16} /> Add Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
