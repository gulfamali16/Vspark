import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const empty = { title:'', category:'Technical', short_desc:'', fee:0, color:'#00d4ff', rules:'', prizes:'', is_active:true, is_new:false, date_announced:false, event_date:'' };

export default function AdminCompetitions() {
  const [comps, setComps] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from('competitions').select('*').order('title').then(({data})=>setComps(data||[]));
  useEffect(()=>{ load(); },[]);

  const openNew = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = c => { setForm(c); setEditing(c.id); setModal(true); };

  const save = async () => {
    if(!form.title||!form.fee){ toast.error('Title and fee required'); return; }
    const payload = {...form, fee: parseInt(form.fee)||0};
    const {error} = editing
      ? await supabase.from('competitions').update(payload).eq('id',editing)
      : await supabase.from('competitions').insert([payload]);
    if(error){ toast.error('Error saving'); return; }
    toast.success(editing?'Competition updated!':'Competition added!');
    setModal(false); load();
  };

  const del = async id => {
    if(!window.confirm('Delete this competition?')) return;
    await supabase.from('competitions').delete().eq('id',id);
    toast.success('Deleted'); load();
  };

  const toggleActive = async (id, val) => {
    await supabase.from('competitions').update({is_active:val}).eq('id',id);
    load();
  };

  const inputSt = { width:'100%', padding:'11px 13px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani,sans-serif', fontSize:'0.93rem', outline:'none', marginBottom:'0.9rem' };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)'}}>
      <AdminSidebar/>
      <main style={{marginLeft:240,flex:1,padding:'2.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
          <div>
            <h1 style={{fontFamily:'Bebas Neue',fontSize:'2.5rem',letterSpacing:3,color:'#e8eaf6',marginBottom:2}}>Competitions</h1>
            <p style={{color:'#8892b0',fontFamily:'JetBrains Mono',fontSize:'0.76rem'}}>Manage competition categories, fees, rules, and date announcements</p>
          </div>
          <button className="btn-neon" onClick={openNew} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.88rem'}}>
            <Plus size={15}/> Add Competition
          </button>
        </div>

        <div style={{display:'grid',gap:'1rem'}}>
          {comps.length===0&&<p style={{color:'#8892b0',fontFamily:'JetBrains Mono',fontSize:'0.82rem'}}>No competitions yet.</p>}
          {comps.map(comp=>(
            <div key={comp.id} className="glass" style={{padding:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',borderLeft:`3px solid ${comp.color||'#00d4ff'}`,opacity:comp.is_active?1:0.5}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                  <h3 style={{fontFamily:'Bebas Neue',fontSize:'1.3rem',letterSpacing:2,color:'#e8eaf6'}}>{comp.title}</h3>
                  {comp.is_new&&<span style={{padding:'1px 7px',background:'rgba(0,255,136,0.1)',color:'#00ff88',fontSize:'0.65rem',fontFamily:'JetBrains Mono',border:'1px solid rgba(0,255,136,0.3)'}}>NEW</span>}
                  <span style={{padding:'1px 7px',background:'rgba(0,212,255,0.08)',color:'#00d4ff',fontSize:'0.65rem',fontFamily:'JetBrains Mono'}}>{comp.category}</span>
                </div>
                <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
                  <span style={{color:'#ffd700',fontFamily:'Bebas Neue',fontSize:'1.15rem'}}>PKR {comp.fee?.toLocaleString()}</span>
                  <span style={{color:comp.date_announced?'#00ff88':'#8892b0',fontSize:'0.83rem',fontFamily:'JetBrains Mono'}}>
                    {comp.date_announced&&comp.event_date?`📅 ${comp.event_date}`:'📅 Date not announced'}
                  </span>
                </div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <button onClick={()=>toggleActive(comp.id,!comp.is_active)} style={{background:'none',border:'none',cursor:'pointer',color:comp.is_active?'#00ff88':'#8892b0',display:'flex',alignItems:'center',gap:5,fontFamily:'Rajdhani',fontWeight:600,fontSize:'0.85rem'}}>
                  {comp.is_active?<ToggleRight size={22}/>:<ToggleLeft size={22}/>}
                  {comp.is_active?'Active':'Hidden'}
                </button>
                <button onClick={()=>openEdit(comp)} style={{padding:'7px 14px',background:'rgba(0,212,255,0.08)',border:'1px solid rgba(0,212,255,0.25)',color:'#00d4ff',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontFamily:'Rajdhani',fontWeight:600,fontSize:'0.83rem'}}>
                  <Edit2 size={13}/> Edit
                </button>
                <button onClick={()=>del(comp.id)} style={{padding:'7px 14px',background:'rgba(255,61,119,0.08)',border:'1px solid rgba(255,61,119,0.25)',color:'#ff3d77',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontFamily:'Rajdhani',fontWeight:600,fontSize:'0.83rem'}}>
                  <Trash2 size={13}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}} onClick={()=>setModal(false)}>
          <div className="glass" style={{width:'100%',maxWidth:600,padding:'2.5rem',maxHeight:'90vh',overflowY:'auto',borderColor:'rgba(0,212,255,0.3)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1.5rem'}}>
              <h2 style={{fontFamily:'Bebas Neue',fontSize:'1.8rem',letterSpacing:2,color:'#e8eaf6'}}>{editing?'Edit':'Add'} Competition</h2>
              <button onClick={()=>setModal(false)} style={{background:'none',border:'none',color:'#8892b0',cursor:'pointer'}}><X size={20}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 1rem'}}>
              {[['title','Title','text'],['category','Category','text'],['fee','Registration Fee (PKR)','number'],['color','Color (#hex)','text']].map(([n,l,t])=>(
                <div key={n}>
                  <label style={{display:'block',color:'#8892b0',fontFamily:'Bebas Neue',letterSpacing:1,fontSize:'0.82rem',marginBottom:4}}>{l}</label>
                  <input type={t} value={form[n]||''} onChange={e=>setForm({...form,[n]:e.target.value})} style={inputSt}
                    onFocus={e=>e.target.style.borderColor='#00d4ff'} onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
                </div>
              ))}
            </div>
            <label style={{display:'block',color:'#8892b0',fontFamily:'Bebas Neue',letterSpacing:1,fontSize:'0.82rem',marginBottom:4}}>Short Description</label>
            <input value={form.short_desc||''} onChange={e=>setForm({...form,short_desc:e.target.value})} style={inputSt}
              onFocus={e=>e.target.style.borderColor='#00d4ff'} onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
            <label style={{display:'block',color:'#8892b0',fontFamily:'Bebas Neue',letterSpacing:1,fontSize:'0.82rem',marginBottom:4}}>Rules (one per line)</label>
            <textarea value={form.rules||''} onChange={e=>setForm({...form,rules:e.target.value})} rows={4} style={{...inputSt,resize:'vertical'}}/>
            <label style={{display:'block',color:'#8892b0',fontFamily:'Bebas Neue',letterSpacing:1,fontSize:'0.82rem',marginBottom:4}}>Prizes (one per line)</label>
            <textarea value={form.prizes||''} onChange={e=>setForm({...form,prizes:e.target.value})} rows={3} style={{...inputSt,resize:'vertical'}}/>

            {/* Date announcement section */}
            <div style={{padding:'1rem',background:'rgba(255,215,0,0.04)',border:'1px solid rgba(255,215,0,0.15)',marginBottom:'1rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'0.75rem'}}>
                <input type="checkbox" id="dateAnn" checked={form.date_announced||false} onChange={e=>setForm({...form,date_announced:e.target.checked})} style={{width:'auto'}}/>
                <label htmlFor="dateAnn" style={{color:'#ffd700',fontFamily:'Bebas Neue',letterSpacing:1.5,fontSize:'0.9rem',cursor:'pointer'}}>Announce Event Date</label>
              </div>
              {form.date_announced&&(
                <>
                  <label style={{display:'block',color:'#8892b0',fontFamily:'Bebas Neue',letterSpacing:1,fontSize:'0.82rem',marginBottom:4}}>Event Date & Time</label>
                  <input type="datetime-local" value={form.event_date||''} onChange={e=>setForm({...form,event_date:e.target.value})} style={inputSt}/>
                </>
              )}
              {!form.date_announced&&<p style={{color:'#8892b0',fontSize:'0.78rem',fontFamily:'JetBrains Mono'}}>Date will show as "To be announced" on the website</p>}
            </div>

            <div style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
              {[['is_active','Show on Website'],['is_new','Mark as NEW']].map(([k,l])=>(
                <label key={k} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'#8892b0',fontSize:'0.88rem'}}>
                  <input type="checkbox" checked={form[k]||false} onChange={e=>setForm({...form,[k]:e.target.checked})} style={{width:'auto'}}/>
                  {l}
                </label>
              ))}
            </div>
            <button onClick={save} className="btn-neon" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',fontSize:'0.95rem'}}>
              <Save size={15}/> {editing?'Update':'Add'} Competition
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
