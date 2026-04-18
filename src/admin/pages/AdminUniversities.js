import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, X, Save,
  Building, User, Phone, Mail, Search,
  GraduationCap
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// ── Shared Sub-component (Moved outside to prevent focus loss) ──
const Field = ({ label, field, value, onChange, type = 'text', placeholder = '', icon: Icon }) => (
  <div className="mb-4">
    <label className="block font-sora font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <Icon 
          size={16} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" 
        />
      )}
      <input 
        type={type} 
        value={value || ''} 
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder} 
        className={`admin-input ${Icon ? 'pl-11' : ''}`} 
      />
    </div>
  </div>
);

export default function AdminUniversities() {
  const [unis, setUnis] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const emptyForm = {
    name: '',
    department: 'Computer Science',
    focal_person: '',
    contact_number: '',
    email: '',
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('universities').select('*').order('name');
    setUnis(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setFiltered(
      unis.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.focal_person.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, unis]);

  // ── Auto-Capitalize Helper ──
  const formatValue = (field, val) => {
    if (field === 'name' || field === 'focal_person' || field === 'department') {
      // Capitalize first letter of each word
      return val.replace(/\b\w/g, l => l.toUpperCase());
    }
    return val;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: formatValue(field, value) 
    }));
  };

  const save = async () => {
    // ── Validation ──
    const nameRegex = /^[A-Za-z\s.]+$/;
    
    if (!form.name || !form.focal_person || !form.contact_number || !form.email) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!nameRegex.test(form.name)) {
      toast.error('University name should only contain letters');
      return;
    }

    if (!nameRegex.test(form.focal_person)) {
      toast.error('Focal person name should only contain letters');
      return;
    }

    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    const { error } = editing
      ? await supabase.from('universities').update(form).eq('id', editing)
      : await supabase.from('universities').insert([form]);

    if (error) {
      toast.error('Save failed: ' + error.message);
      return;
    }

    toast.success(editing ? 'University updated!' : 'University added!');
    setModal(false);
    setEditing(null);
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this university? It might be linked to existing registrations.')) return;
    const { error } = await supabase.from('universities').delete().eq('id', id);
    if (error) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Deleted');
    load();
  };

  return (
    <div className="admin-layout text-gray-900">
      <AdminSidebar />
      <main className="admin-main">
        {/* Header */}
        <div className="admin-page-header flex justify-between items-start flex-wrap gap-4 font-sora">
          <div>
            <h1 className="admin-page-title flex items-center gap-3">
              <Building size={22} className="text-primary-600" /> Universities
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Manage institutions and their focal person details
            </p>
          </div>
          <button className="btn-primary text-sm shadow-lg shadow-primary-200" onClick={() => { setForm(emptyForm); setEditing(null); setModal(true); }}>
            <Plus size={16} /> Add University
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search university or focal person..." 
              className="admin-input pl-11 w-full" 
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin mb-4" />
             <p className="text-gray-400 font-medium">Loading universities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-card text-center py-16">
            <Building size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">No universities found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(u => (
              <div key={u.id} className="admin-card hover:border-primary-200 transition-all group">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-500">
                      <Building size={20} />
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setForm(u); setEditing(u.id); setModal(true); }} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => del(u.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>

                <h3 className="font-sora font-black text-primary-900 text-lg mb-1 uppercase leading-tight tracking-tight">
                  {u.name}
                </h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  {u.department || 'Computer Science'}
                </p>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                   <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors"><User size={16}/></div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Focal Person</p>
                        <p className="text-sm font-bold text-gray-800">{u.focal_person}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors"><Phone size={16}/></div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Contact</p>
                        <p className="text-sm font-bold text-gray-800">{u.contact_number}</p>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] z-[50] flex items-center justify-center p-6" onClick={() => setModal(false)}>
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-100">
                <div>
                  <h3 className="font-sora font-black text-2xl text-gray-900">{editing ? 'Edit' : 'Add'} University</h3>
                  <p className="text-gray-400 text-xs font-medium mt-1">Register institutional focal person and contact info</p>
                </div>
                <button onClick={() => setModal(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"><X size={20} /></button>
              </div>

              <div className="space-y-2">
                <Field label="University Name" field="name" value={form.name} onChange={handleChange} placeholder="e.g. COMSATS University" icon={Building} />
                <Field label="Department" field="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" icon={GraduationCap} />
                <div className="grid sm:grid-cols-2 gap-x-5">
                   <Field label="Focal Person Name" field="focal_person" value={form.focal_person} onChange={handleChange} icon={User} />
                   <Field label="Contact Number" field="contact_number" value={form.contact_number} onChange={handleChange} icon={Phone} />
                </div>
                <Field label="Focal Email / Gmail" field="email" value={form.email} onChange={handleChange} type="email" icon={Mail} />
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                 <button onClick={save} className="btn-primary w-full justify-center py-4 text-base shadow-xl shadow-primary-200">
                   <Save size={18} /> {editing ? 'Update University' : 'Register University'}
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
