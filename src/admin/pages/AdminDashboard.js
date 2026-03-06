import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Image, TrendingUp, Clock, CheckCircle, XCircle, Swords } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({events:0,pending:0,approved:0,rejected:0,blogs:0,competitions:0});
  const [recent, setRecent] = useState([]);

  useEffect(()=>{
    Promise.all([
      supabase.from('events').select('id',{count:'exact'}),
      supabase.from('registration_requests').select('id',{count:'exact'}).eq('status','pending'),
      supabase.from('registration_requests').select('id',{count:'exact'}).eq('status','approved'),
      supabase.from('registration_requests').select('id',{count:'exact'}).eq('status','rejected'),
      supabase.from('blogs').select('id',{count:'exact'}),
      supabase.from('competitions').select('id',{count:'exact'}),
      supabase.from('registration_requests').select('*').order('id',{ascending:false}).limit(6),
    ]).then(([ev,pend,appr,rej,bl,comp,rec])=>{
      setStats({events:ev.count||0,pending:pend.count||0,approved:appr.count||0,rejected:rej.count||0,blogs:bl.count||0,competitions:comp.count||0});
      setRecent(rec.data||[]);
    });
  },[]);

  const cards = [
    {icon:Clock,label:'Pending Requests',value:stats.pending,color:'#ff6b00',urgent:stats.pending>0},
    {icon:CheckCircle,label:'Approved',value:stats.approved,color:'#00ff88'},
    {icon:XCircle,label:'Rejected',value:stats.rejected,color:'#ff3d77'},
    {icon:Swords,label:'Competitions',value:stats.competitions,color:'#7c3aed'},
    {icon:Calendar,label:'Events',value:stats.events,color:'#00d4ff'},
    {icon:FileText,label:'Blogs',value:stats.blogs,color:'#ffd700'},
  ];

  const statusColor = s => s==='approved'?'#00ff88':s==='rejected'?'#ff3d77':'#ff6b00';

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)'}}>
      <AdminSidebar/>
      <main style={{marginLeft:240,flex:1,padding:'2.5rem'}}>
        <div style={{marginBottom:'2.5rem'}}>
          <h1 style={{fontFamily:'Bebas Neue',fontSize:'2.5rem',letterSpacing:3,color:'#e8eaf6',marginBottom:4}}>Dashboard</h1>
          <p style={{color:'#8892b0',fontFamily:'JetBrains Mono',fontSize:'0.78rem'}}>VSpark Admin Overview</p>
        </div>

        {stats.pending>0&&(
          <div style={{marginBottom:'2rem',padding:'1rem 1.5rem',background:'rgba(255,107,0,0.07)',border:'1px solid rgba(255,107,0,0.3)',borderLeft:'4px solid #ff6b00',display:'flex',alignItems:'center',gap:12}}>
            <Clock size={20} style={{color:'#ff6b00'}}/>
            <p style={{color:'#ff6b00',fontWeight:600}}>You have <strong>{stats.pending}</strong> pending registration request{stats.pending>1?'s':''} waiting for approval.</p>
            <a href="/admin/registrations" style={{marginLeft:'auto',color:'#ff6b00',fontFamily:'JetBrains Mono',fontSize:'0.82rem',textDecoration:'underline'}}>Review now →</a>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:'1.25rem',marginBottom:'3rem'}}>
          {cards.map(({icon:Icon,label,value,color,urgent})=>(
            <div key={label} className="glass" style={{padding:'1.5rem',borderRadius:2,borderLeft:`3px solid ${color}`,transition:'all 0.3s',animation:urgent?'pulse-glow 2s infinite':''}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 0 30px ${color}20`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.75rem'}}>
                <Icon size={22} style={{color}}/>
                <TrendingUp size={14} style={{color:'#00ff88'}}/>
              </div>
              <div style={{fontFamily:'Bebas Neue',fontSize:'2.8rem',color:'#e8eaf6',lineHeight:1,letterSpacing:2}}>{value}</div>
              <div style={{color:'#8892b0',fontSize:'0.8rem',fontWeight:600,letterSpacing:1,textTransform:'uppercase',marginTop:4}}>{label}</div>
            </div>
          ))}
        </div>

        <div className="glass" style={{padding:'2rem',borderRadius:2}}>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'1.4rem',letterSpacing:2,color:'#e8eaf6',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:10}}>
            <Users size={17} style={{color:'#00d4ff'}}/> Recent Registration Requests
          </h2>
          {recent.length===0?<p style={{color:'#8892b0',fontFamily:'JetBrains Mono',fontSize:'0.82rem'}}>No requests yet.</p>:(
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(0,212,255,0.15)'}}>
                    {['Name','Email','Institute','Competition','Fee','Status'].map(h=>(
                      <th key={h} style={{padding:'9px 12px',textAlign:'left',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#00d4ff',fontSize:'0.8rem'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r,i)=>(
                    <tr key={r.id} style={{borderBottom:'1px solid rgba(0,212,255,0.05)'}}>
                      <td style={{padding:'9px 12px',color:'#e8eaf6',fontWeight:600,fontSize:'0.88rem'}}>{r.student_name}</td>
                      <td style={{padding:'9px 12px',color:'#8892b0',fontSize:'0.83rem'}}>{r.email}</td>
                      <td style={{padding:'9px 12px',color:'#8892b0',fontSize:'0.83rem'}}>{r.institute}</td>
                      <td style={{padding:'9px 12px',color:'#8892b0',fontSize:'0.83rem'}}>{r.competition_id}</td>
                      <td style={{padding:'9px 12px',color:'#ffd700',fontFamily:'JetBrains Mono',fontSize:'0.83rem'}}>PKR {r.fee_amount}</td>
                      <td style={{padding:'9px 12px'}}>
                        <span style={{padding:'3px 10px',background:`${statusColor(r.status)}20`,color:statusColor(r.status),fontSize:'0.72rem',fontFamily:'JetBrains Mono',border:`1px solid ${statusColor(r.status)}40`}}>{r.status?.toUpperCase()}</span>
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
