import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Info } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    payment_account:'', payment_account_name:'', payment_account_title:'',
    site_email:'', event_date:'', event_venue:'', event_status:'upcoming',
  });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    supabase.from('site_settings').select('*').then(({data})=>{
      if(data){ const s={}; data.forEach(r=>{ s[r.key]=r.value; }); setSettings(prev=>({...prev,...s})); }
    });
  },[]);

  const upsert = async (key, value) => {
    await supabase.from('site_settings').upsert([{key,value}],{onConflict:'key'});
  };

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all(Object.entries(settings).map(([k,v])=>upsert(k,v)));
      toast.success('Settings saved!');
    } catch(e) { toast.error('Save failed'); }
    setSaving(false);
  };

  const inputSt = { width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani,sans-serif', fontSize:'0.95rem', outline:'none' };

  const Field = ({label, k, type='text', placeholder=''}) => (
    <div style={{marginBottom:'1.25rem'}}>
      <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.82rem'}}>{label}</label>
      <input type={type} value={settings[k]||''} onChange={e=>setSettings({...settings,[k]:e.target.value})} placeholder={placeholder} style={inputSt}
        onFocus={e=>e.target.style.borderColor='#00d4ff'} onBlur={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'}/>
    </div>
  );

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)'}}>
      <AdminSidebar/>
      <main style={{marginLeft:240,flex:1,padding:'2.5rem',maxWidth:900}}>
        <div style={{marginBottom:'2.5rem'}}>
          <h1 style={{fontFamily:'Bebas Neue',fontSize:'2.5rem',letterSpacing:3,color:'#e8eaf6',marginBottom:2}}>Site Settings</h1>
          <p style={{color:'#8892b0',fontFamily:'JetBrains Mono',fontSize:'0.76rem'}}>Manage payment account, event details, and site configuration</p>
        </div>

        {/* Payment Settings */}
        <div className="glass" style={{padding:'2rem',marginBottom:'2rem',borderLeft:'3px solid #ffd700'}}>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'1.4rem',letterSpacing:2,color:'#ffd700',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:10}}>
            <CreditCard size={18}/> Payment Account Settings
          </h2>
          <div style={{background:'rgba(255,215,0,0.04)',border:'1px solid rgba(255,215,0,0.15)',padding:'0.75rem 1rem',marginBottom:'1.5rem',display:'flex',gap:8,alignItems:'flex-start'}}>
            <Info size={14} style={{color:'#ffd700',marginTop:2,flexShrink:0}}/>
            <p style={{color:'#ffd700',fontSize:'0.82rem',lineHeight:1.6}}>
              This account number is shown to students on the registration page. Students will transfer the fee here and provide the transaction ID. Update whenever your payment account changes.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 1.5rem'}}>
            <Field label="Account Number / JazzCash / EasyPaisa" k="payment_account" placeholder="03XX-XXXXXXX or IBAN"/>
            <Field label="Bank / Service Name" k="payment_account_name" placeholder="JazzCash / HBL / Meezan Bank"/>
            <Field label="Account Title (Name)" k="payment_account_title" placeholder="Muhammad Ali Khan"/>
          </div>
        </div>

        {/* Event Settings */}
        <div className="glass" style={{padding:'2rem',marginBottom:'2rem',borderLeft:'3px solid #00d4ff'}}>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'1.4rem',letterSpacing:2,color:'#00d4ff',marginBottom:'1.5rem'}}>Event Configuration</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 1.5rem'}}>
            <Field label="Event Date" k="event_date" type="date"/>
            <Field label="Event Venue" k="event_venue" placeholder="COMSATS Vehari Campus, Hall A"/>
            <div style={{marginBottom:'1.25rem'}}>
              <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.82rem'}}>Event Status</label>
              <select value={settings.event_status||'upcoming'} onChange={e=>setSettings({...settings,event_status:e.target.value})} style={{...inputSt,cursor:'pointer'}}>
                <option value="upcoming">Upcoming</option>
                <option value="registration_open">Registration Open</option>
                <option value="registration_closed">Registration Closed</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Field label="Contact Email" k="site_email" type="email" placeholder="vspark@cuivehari.edu.pk"/>
          </div>
        </div>

        <button onClick={save} className="btn-neon" disabled={saving} style={{fontSize:'1rem',padding:'14px 36px',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,display:'flex',alignItems:'center',gap:8}}>
          <Save size={16}/> {saving?'Saving...':'Save All Settings'}
        </button>
      </main>
    </div>
  );
}
