import React, { useState, useEffect } from 'react';
import { Clock, Trophy, ChevronDown, ChevronUp, Megaphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const defaultComps = [
  {id:1,title:'Speed Programming',category:'Technical',short_desc:'Race against time solving algorithmic challenges',fee:300,color:'#00d4ff',is_active:true,date_announced:false,rules:'Solo or teams of 2\nIDEs are allowed\nNo internet access\n3 problems in 2 hours',prizes:'1st: PKR 10,000\n2nd: PKR 6,000\n3rd: PKR 3,000'},
  {id:2,title:'E-Gaming: FIFA & Tekken',category:'Gaming',short_desc:'Battle in FIFA and Tekken tournaments',fee:200,color:'#7c3aed',is_active:true,date_announced:false,rules:'Single elimination bracket\nDefault console settings\nFIFA: 6-minute halves\nBest of 3 for Tekken',prizes:'1st: PKR 8,000\n2nd: PKR 5,000\n3rd: PKR 2,500'},
  {id:3,title:'Web Development',category:'Technical',short_desc:'Build a stunning website under pressure',fee:350,color:'#ff6b00',is_active:true,date_announced:false,rules:'Teams of up to 3\n4-hour time limit\nHTML/CSS/JS only\nTheme given on day',prizes:'1st: PKR 12,000\n2nd: PKR 7,000\n3rd: PKR 4,000'},
  {id:4,title:'UI/UX Design',category:'Creative',short_desc:'Design beautiful interfaces in Figma',fee:250,color:'#ffd700',is_active:true,date_announced:false,rules:'Solo competition\nFigma or Adobe XD\n3-hour design sprint\nPresent to judges',prizes:'1st: PKR 9,000\n2nd: PKR 5,500\n3rd: PKR 3,000'},
  {id:5,title:'Prompt Engineering',category:'AI — NEW',short_desc:'Master AI communication and prompting',fee:200,color:'#00ff88',is_active:true,date_announced:false,is_new:true,rules:'Solo or pair\nChatGPT/Claude provided\n5 challenge rounds\nScored on output quality',prizes:'1st: PKR 8,000\n2nd: PKR 5,000\n3rd: PKR 2,500'},
  {id:6,title:'CS Quiz',category:'Knowledge',short_desc:'Test your CS knowledge vs the best',fee:150,color:'#ff3d77',is_active:true,date_announced:false,rules:'Teams of 2\nMCQ + Rapid fire rounds\nBuzzer system\n45-minute session',prizes:'1st: PKR 6,000\n2nd: PKR 4,000\n3rd: PKR 2,000'},
  {id:7,title:'Poster Designing',category:'Creative',short_desc:'Create compelling visual art on a CS theme',fee:200,color:'#00d4ff',is_active:true,date_announced:false,rules:'Solo\nAny design tool\n3-hour limit\nA3 size output',prizes:'1st: PKR 5,000\n2nd: PKR 3,000\n3rd: PKR 1,500'},
];

export default function Competitions() {
  const [comps, setComps] = useState(defaultComps);
  const [expanded, setExpanded] = useState(null);

  useEffect(()=>{
    supabase.from('competitions').select('*').eq('is_active',true).order('title')
      .then(({data})=>{ if(data&&data.length) setComps(data); });
  },[]);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar/>
      <section style={{padding:'10rem 2rem 5rem',textAlign:'center',background:'radial-gradient(ellipse at top,rgba(0,212,255,0.08) 0%,transparent 60%)'}}>
        <span className="tag" style={{display:'inline-block',marginBottom:'1rem'}}>All Events</span>
        <h1 className="section-title" style={{display:'block',marginBottom:'1rem'}}>Competitions</h1>
        <p style={{color:'#8892b0',maxWidth:580,margin:'0 auto',lineHeight:1.7,fontSize:'1.02rem'}}>
          Seven categories. Compete, prove your skills, and win prizes plus internship opportunities. Registration fee required per event.
        </p>
      </section>

      <section style={{padding:'2rem 2rem 6rem'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'1.5rem'}}>
          {comps.map((comp,i)=>{
            const isOpen = expanded===comp.id;
            const color = comp.color||'#00d4ff';
            return (
              <div key={comp.id} className="glass" style={{
                padding:'2rem',borderRadius:2,cursor:'pointer',
                borderColor:isOpen?color:'rgba(0,212,255,0.15)',
                boxShadow:isOpen?`0 0 40px ${color}20`:'none',
                transition:'all 0.3s',
              }} onClick={()=>setExpanded(isOpen?null:comp.id)}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                  <div>
                    <span style={{fontFamily:'JetBrains Mono',fontSize:'0.68rem',color,letterSpacing:2}}>{comp.category}</span>
                    <h3 style={{fontFamily:'Bebas Neue',fontSize:'1.45rem',letterSpacing:2,color:'#e8eaf6',lineHeight:1,marginTop:2}}>{comp.title}</h3>
                  </div>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    {comp.is_new&&<span style={{padding:'2px 8px',background:`${color}20`,color,fontSize:'0.65rem',fontFamily:'JetBrains Mono',border:`1px solid ${color}40`}}>NEW</span>}
                    {isOpen?<ChevronUp size={16} style={{color}}/>:<ChevronDown size={16} style={{color:'#8892b0'}}/>}
                  </div>
                </div>

                <p style={{color:'#8892b0',fontSize:'0.9rem',lineHeight:1.6,marginBottom:'1rem'}}>{comp.short_desc}</p>

                {/* Fee badge */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.6rem 1rem',background:`${color}10`,border:`1px solid ${color}30`}}>
                  <span style={{color:'#8892b0',fontSize:'0.82rem'}}>Registration Fee</span>
                  <span style={{fontFamily:'Bebas Neue',fontSize:'1.3rem',color:'#ffd700',letterSpacing:1}}>PKR {comp.fee?.toLocaleString()}</span>
                </div>

                {/* Date/Time announcement */}
                {isOpen && (
                  <div style={{marginTop:'1.25rem'}}>
                    <div style={{padding:'0.75rem 1rem',background:'rgba(255,107,0,0.07)',border:'1px solid rgba(255,107,0,0.2)',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:8}}>
                      <Megaphone size={14} style={{color:'#ff6b00',flexShrink:0}}/>
                      <span style={{color:'#ff6b00',fontSize:'0.82rem',fontFamily:'JetBrains Mono'}}>
                        {comp.date_announced && comp.event_date
                          ? `Event Date: ${new Date(comp.event_date).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}`
                          : 'Date & time to be announced — check back soon'}
                      </span>
                    </div>
                    {comp.rules&&(
                      <div style={{marginBottom:'1rem'}}>
                        <h4 style={{fontFamily:'Bebas Neue',letterSpacing:2,color,marginBottom:8,display:'flex',alignItems:'center',gap:8,fontSize:'0.95rem'}}><Clock size={13}/> Rules</h4>
                        {comp.rules.split('\n').map((r,ri)=><p key={ri} style={{color:'#8892b0',fontSize:'0.88rem',marginBottom:3}}>• {r}</p>)}
                      </div>
                    )}
                    {comp.prizes&&(
                      <div style={{marginBottom:'1.25rem'}}>
                        <h4 style={{fontFamily:'Bebas Neue',letterSpacing:2,color:'#ffd700',marginBottom:8,display:'flex',alignItems:'center',gap:8,fontSize:'0.95rem'}}><Trophy size={13}/> Prizes</h4>
                        {comp.prizes.split('\n').map((p,pi)=><p key={pi} style={{color:'#ffd700',fontSize:'0.88rem',marginBottom:3,opacity:pi===0?1:pi===1?0.8:0.6}}>🏆 {p}</p>)}
                      </div>
                    )}
                    <Link to="/register" className="btn-neon" style={{textDecoration:'none',fontSize:'0.88rem',padding:'10px 22px'}} onClick={e=>e.stopPropagation()}>
                      Register — PKR {comp.fee?.toLocaleString()}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <Footer/>
    </div>
  );
}
