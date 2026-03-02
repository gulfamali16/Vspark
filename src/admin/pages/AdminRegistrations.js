import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, Filter } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  const load = () => supabase.from('registrations').select('*').order('id',{ascending:false}).then(({data})=>{setRegs(data||[]); setFiltered(data||[]);});
  useEffect(()=>{ load(); },[]);

  const doSearch = (s, ef) => {
    const f = regs.filter(r =>
      (r.student_name?.toLowerCase().includes(s.toLowerCase()) || r.email?.toLowerCase().includes(s.toLowerCase())) &&
      (ef ? String(r.event_id) === ef : true)
    );
    setFiltered(f);
  };

  const handleSearch = (e) => { setSearch(e.target.value); doSearch(e.target.value, eventFilter); };
  const handleFilter = (e) => { setEventFilter(e.target.value); doSearch(search, e.target.value); };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      Name: r.student_name, Email: r.email, 'Reg #': r.reg_number,
      Department: r.department, 'Event ID': r.event_id
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, 'VSpark_2025_Registrations.xlsx');
  };

  const del = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    await supabase.from('registrations').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft:240, flex:1, padding:'2.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <h1 style={{ fontFamily:'Bebas Neue', fontSize:'2.5rem', letterSpacing:3, color:'#e8eaf6' }}>Registrations</h1>
          <button onClick={exportExcel} className="btn-neon btn-orange" style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <Download size={16}/> Export Excel
          </button>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#00d4ff' }} />
            <input value={search} onChange={handleSearch} placeholder="Search by name or email..." style={{
              width:'100%', padding:'10px 16px 10px 38px', background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani', fontSize:'0.9rem', outline:'none'
            }} />
          </div>
          <div style={{ position:'relative' }}>
            <Filter size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#00d4ff' }} />
            <select value={eventFilter} onChange={handleFilter} style={{
              padding:'10px 16px 10px 36px', background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(0,212,255,0.2)', color:'#e8eaf6', fontFamily:'Rajdhani', fontSize:'0.9rem', outline:'none', cursor:'pointer'
            }}>
              <option value="">All Events</option>
              {[...new Set(regs.map(r=>r.event_id))].map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="glass" style={{ padding:'1.5rem', borderRadius:2 }}>
          <p style={{ color:'#8892b0', fontFamily:'JetBrains Mono', fontSize:'0.8rem', marginBottom:'1rem' }}>
            Showing {filtered.length} of {regs.length} registrations
          </p>
          {filtered.length === 0 ? (
            <p style={{ color:'#8892b0', fontFamily:'JetBrains Mono', fontSize:'0.85rem' }}>No registrations found. Students will appear here after they register.</p>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(0,212,255,0.15)' }}>
                    {['#','Name','Email','Reg Number','Department','Event','Action'].map(h=>(
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontFamily:'Bebas Neue', letterSpacing:1.5, color:'#00d4ff', fontSize:'0.8rem', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r,i)=>(
                    <tr key={r.id} style={{ borderBottom:'1px solid rgba(0,212,255,0.05)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(0,212,255,0.03)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'10px 12px', color:'#8892b0', fontSize:'0.8rem' }}>{i+1}</td>
                      <td style={{ padding:'10px 12px', color:'#e8eaf6', fontWeight:600, fontSize:'0.9rem' }}>{r.student_name}</td>
                      <td style={{ padding:'10px 12px', color:'#8892b0', fontSize:'0.85rem' }}>{r.email}</td>
                      <td style={{ padding:'10px 12px', color:'#8892b0', fontSize:'0.85rem', fontFamily:'JetBrains Mono' }}>{r.reg_number}</td>
                      <td style={{ padding:'10px 12px', color:'#8892b0', fontSize:'0.85rem' }}>{r.department}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ padding:'3px 10px', background:'rgba(0,212,255,0.1)', color:'#00d4ff', fontSize:'0.75rem', fontFamily:'JetBrains Mono' }}>{r.event_id}</span>
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <button onClick={()=>del(r.id)} style={{ background:'none', border:'none', color:'#ff3d77', cursor:'pointer' }}><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
