import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, FileText } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const empty = { title: '', content: '', image_url: '', author: '' };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from('blogs').select('*').order('created_at', { ascending: false }).then(({ data }) => setBlogs(data || []));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (b) => { setForm(b); setEditing(b.id); setModal(true); };

  const save = async () => {
    if (!form.title || !form.content) { toast.error('Title and content required'); return; }
    const payload = { ...form, created_at: editing ? form.created_at : new Date().toISOString() };
    const { error } = editing
      ? await supabase.from('blogs').update(payload).eq('id', editing)
      : await supabase.from('blogs').insert([payload]);
    if (error) { toast.error('Error saving'); return; }
    toast.success(editing ? 'Blog updated!' : 'Blog published!');
    setModal(false); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    await supabase.from('blogs').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const InputField = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="mb-5">
      <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      <input type={type} value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="admin-input" />
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header flex justify-between items-center">
          <div>
            <h1 className="admin-page-title">Blog Posts</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Create and manage your articles and news</p>
          </div>
          <button onClick={openNew} className="btn-primary text-sm">
            <Plus size={16} /> New Post
          </button>
        </div>

        <div className="space-y-4">
          {blogs.length === 0 && (
            <div className="admin-card text-center py-16">
              <FileText size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No blog posts yet.</p>
            </div>
          )}
          {blogs.map(b => (
            <div key={b.id} className="admin-card flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-start gap-4 flex-1">
                {b.image_url && <img src={b.image_url} alt={b.title} className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0" onError={e => e.target.style.display = 'none'} />}
                <div>
                  <h3 className="font-sora font-bold text-gray-900 text-base mb-1">{b.title}</h3>
                  <p className="text-gray-500 text-sm">{new Date(b.created_at).toLocaleDateString()} · {b.content?.substring(0, 80)}...</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEdit(b)} className="btn-outline text-sm py-2 px-4"><Edit2 size={14} /> Edit</button>
                <button onClick={() => del(b.id)} className="btn-danger text-sm py-2 px-4"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-sora font-bold text-xl text-gray-900">{editing ? 'Edit' : 'New'} Blog Post</h2>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>
            <InputField label="Title" field="title" placeholder="VSpark 2025 — What to Expect" />
            <InputField label="Author" field="author" placeholder="VSpark Team" />
            <InputField label="Image URL" field="image_url" placeholder="https://..." />
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Content</label>
              <textarea value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} rows={8}
                className="admin-input resize-y" placeholder="Write your blog content here..." />
            </div>
            <button onClick={save} className="btn-primary w-full justify-center py-3">
              <Save size={16} /> {editing ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
