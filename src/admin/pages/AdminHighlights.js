import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ image_url:'' });

  const load = () => supabase.from('highlights').select('*').then(({data})=>setHighlights(data||[]));
  useEffect(()=>{ load(); },[]);

  const save = async () => {
    if (!form.image_url) { toast.error('Image URL required'); return; }
    const { error } = await supabase.from('highlights').insert([form]);
    if (error) { toast.error('Error adding'); return; }
    toast.success('Highlight added!'); setModal(false); setForm({image_url:''}); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this highlight?')) return;
    await supabase.from('highlights').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const inputSt = { width:'100%', padding:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani,sans-serif', fontSize:'0.95rem', outline:'none', marginBottom:'1rem' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft:240, flex:1, padding:'2.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'Bebas Neue', fontSize:'2.5rem', letterSpacing:3, color:'#e8eaf6' }}>Highlights</h1>
          <button className="btn-neon" onClick={()=>setModal(true)} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <Plus size={16}/> Add Highlight
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' }}>
          {highlights.length === 0 && <p style={{ color:'#8892b0', fontFamily:'JetBrains Mono', fontSize:'0.85rem' }}>No highlights yet. Add image URLs to create your gallery.</p>}
          {highlights.map(h=>(
            <div key={h.id} style={{ position:'relative', border:'1px solid rgba(0,212,255,0.15)' }}>
              <img src={h.image_url} alt="Highlight" style={{ width:'100%', height:180, objectFit:'cover', display:'block' }} />
              <div style={{ padding:'0.75rem', background:'rgba(5,8,16,0.9)', display:'flex', justifyContent:'flex-end' }}>
                <button onClick={()=>del(h.id)} style={{ background:'rgba(255,61,119,0.1)', border:'1px solid rgba(255,61,119,0.3)', color:'#ff3d77', cursor:'pointer', padding:'6px 12px', display:'flex', alignItems:'center', gap:6, fontFamily:'Rajdhani', fontWeight:600, fontSize:'0.8rem' }}>
                  <Trash2 size={12}/> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }} onClick={()=>setModal(false)}>
          <div className="glass" style={{ width:'100%', maxWidth:480, padding:'2.5rem', borderColor:'rgba(0,212,255,0.3)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:'Bebas Neue', fontSize:'1.8rem', letterSpacing:2, color:'#e8eaf6' }}>Add Highlight</h2>
              <button onClick={()=>setModal(false)} style={{ background:'none', border:'none', color:'#8892b0', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <label style={{ display:'block', color:'#8892b0', fontFamily:'Bebas Neue', letterSpacing:1, fontSize:'0.85rem', marginBottom:4 }}>Image URL (GitHub or CDN)</label>
            <input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="https://..." style={inputSt}
              onFocus={e=>e.target.style.borderColor='#00d4ff'} onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
            {form.image_url && <img src={form.image_url} alt="" style={{ width:'100%', maxHeight:160, objectFit:'cover', marginBottom:'1rem', border:'1px solid rgba(0,212,255,0.15)' }} onError={e=>e.target.style.display='none'} />}
            <button onClick={save} className="btn-neon" style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}>
              <Save size={16}/> Add Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
