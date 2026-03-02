import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const empty = { title:'', content:'', image_url:'' };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from('blogs').select('*').order('created_at',{ascending:false}).then(({data})=>setBlogs(data||[]));
  useEffect(()=>{ load(); },[]);

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

  const inputSt = { width:'100%', padding:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani,sans-serif', fontSize:'0.95rem', outline:'none', marginBottom:'1rem' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft:240, flex:1, padding:'2.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'Bebas Neue', fontSize:'2.5rem', letterSpacing:3, color:'#e8eaf6' }}>Blog Posts</h1>
          <button className="btn-neon" onClick={openNew} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <Plus size={16}/> New Post
          </button>
        </div>
        <div style={{ display:'grid', gap:'1rem' }}>
          {blogs.length === 0 && <p style={{ color:'#8892b0', fontFamily:'JetBrains Mono', fontSize:'0.85rem' }}>No blog posts yet.</p>}
          {blogs.map(b => (
            <div key={b.id} className="glass" style={{ padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
              <div style={{ flex:1 }}>
                <h3 style={{ fontFamily:'Bebas Neue', fontSize:'1.3rem', letterSpacing:2, color:'#e8eaf6', marginBottom:4 }}>{b.title}</h3>
                <p style={{ color:'#8892b0', fontSize:'0.85rem' }}>{new Date(b.created_at).toLocaleDateString()} • {b.content.substring(0,80)}...</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>openEdit(b)} style={{ padding:'8px 14px', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)', color:'#00d4ff', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'Rajdhani', fontWeight:600, fontSize:'0.85rem' }}>
                  <Edit2 size={13}/> Edit
                </button>
                <button onClick={()=>del(b.id)} style={{ padding:'8px 14px', background:'rgba(255,61,119,0.1)', border:'1px solid rgba(255,61,119,0.3)', color:'#ff3d77', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'Rajdhani', fontWeight:600, fontSize:'0.85rem' }}>
                  <Trash2 size={13}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }} onClick={()=>setModal(false)}>
          <div className="glass" style={{ width:'100%', maxWidth:600, padding:'2.5rem', maxHeight:'90vh', overflowY:'auto', borderColor:'rgba(0,212,255,0.3)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:'Bebas Neue', fontSize:'1.8rem', letterSpacing:2, color:'#e8eaf6' }}>{editing?'Edit':'New'} Blog Post</h2>
              <button onClick={()=>setModal(false)} style={{ background:'none', border:'none', color:'#8892b0', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <label style={{ display:'block', color:'#8892b0', fontFamily:'Bebas Neue', letterSpacing:1, fontSize:'0.85rem', marginBottom:4 }}>Title</label>
            <input value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} style={inputSt}
              onFocus={e=>e.target.style.borderColor='#00d4ff'} onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
            <label style={{ display:'block', color:'#8892b0', fontFamily:'Bebas Neue', letterSpacing:1, fontSize:'0.85rem', marginBottom:4 }}>Image URL</label>
            <input value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})} style={inputSt}
              onFocus={e=>e.target.style.borderColor='#00d4ff'} onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
            <label style={{ display:'block', color:'#8892b0', fontFamily:'Bebas Neue', letterSpacing:1, fontSize:'0.85rem', marginBottom:4 }}>Content</label>
            <textarea value={form.content||''} onChange={e=>setForm({...form,content:e.target.value})} rows={8} style={{...inputSt, resize:'vertical', marginBottom:'1.5rem'}} />
            <button onClick={save} className="btn-neon" style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}>
              <Save size={16}/> {editing?'Update':'Publish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
