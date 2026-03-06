import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const empty = { title:'', description:'', date:'', venue:'', image_url:'' };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from('events').select('*').order('date').then(({data})=>setEvents(data||[]));
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

  const inputSt = { width:'100%', padding:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani,sans-serif', fontSize:'0.95rem', outline:'none', marginBottom:'1rem' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft:240, flex:1, padding:'2.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'Bebas Neue', fontSize:'2.5rem', letterSpacing:3, color:'#e8eaf6' }}>Events</h1>
          <button className="btn-neon" onClick={openNew} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', border:'none' }}>
            <Plus size={16}/> Add Event
          </button>
        </div>

        <div style={{ display:'grid', gap:'1rem' }}>
          {events.length === 0 && <p style={{ color:'#8892b0', fontFamily:'JetBrains Mono', fontSize:'0.85rem' }}>No events yet. Click "Add Event" to create one.</p>}
          {events.map(evt => (
            <div key={evt.id} className="glass" style={{ padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
              <div>
                <h3 style={{ fontFamily:'Bebas Neue', fontSize:'1.3rem', letterSpacing:2, color:'#e8eaf6', marginBottom:4 }}>{evt.title}</h3>
                <p style={{ color:'#8892b0', fontSize:'0.85rem' }}>{evt.date} • {evt.venue}</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openEdit(evt)} style={{ padding:'8px 16px', background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)', color:'#00d4ff', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'Rajdhani', fontWeight:600 }}>
                  <Edit2 size={14}/> Edit
                </button>
                <button onClick={() => del(evt.id)} style={{ padding:'8px 16px', background:'rgba(255,61,119,0.1)', border:'1px solid rgba(255,61,119,0.3)', color:'#ff3d77', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'Rajdhani', fontWeight:600 }}>
                  <Trash2 size={14}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width:'100%', maxWidth:550, padding:'2.5rem', borderColor:'rgba(0,212,255,0.3)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
              <h2 style={{ fontFamily:'Bebas Neue', fontSize:'1.8rem', letterSpacing:2, color:'#e8eaf6' }}>{editing?'Edit':'Add'} Event</h2>
              <button onClick={() => setModal(false)} style={{ background:'none', border:'none', color:'#8892b0', cursor:'pointer' }}><X size={20}/></button>
            </div>
            {[['title','Title','text'],['date','Date','date'],['venue','Venue','text'],['image_url','Image URL','url']].map(([name,label,type]) => (
              <div key={name}>
                <label style={{ display:'block', color:'#8892b0', fontFamily:'Bebas Neue', letterSpacing:1, fontSize:'0.85rem', marginBottom:4 }}>{label}</label>
                <input type={type} value={form[name]||''} onChange={e => setForm({...form,[name]:e.target.value})} style={inputSt}
                  onFocus={e=>e.target.style.borderColor='#00d4ff'}
                  onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
              </div>
            ))}
            <label style={{ display:'block', color:'#8892b0', fontFamily:'Bebas Neue', letterSpacing:1, fontSize:'0.85rem', marginBottom:4 }}>Description</label>
            <textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...inputSt, resize:'vertical', marginBottom:'1.5rem'}} />
            <button onClick={save} className="btn-neon" style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', border:'none' }}>
              <Save size={16}/> {editing?'Update':'Create'} Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
