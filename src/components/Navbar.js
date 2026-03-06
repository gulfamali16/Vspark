import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  {to:'/',label:'Home'},{to:'/competitions',label:'Competitions'},
  {to:'/events',label:'Events'},{to:'/highlights',label:'Highlights'},
  {to:'/blogs',label:'Blogs'},{to:'/department',label:'CS Dept'},
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:1000,
      background:scrolled?'rgba(5,8,16,0.97)':'transparent',
      backdropFilter:scrolled?'blur(20px)':'none',
      borderBottom:scrolled?'1px solid rgba(0,212,255,0.15)':'none',
      transition:'all 0.3s',padding:'0 2rem',
    }}>
      <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:70}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none'}}>
          <div style={{
            width:40,height:40,borderRadius:'50%',
            background:'linear-gradient(135deg,#00d4ff,#7c3aed)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'Bebas Neue,cursive',fontSize:'1rem',color:'#fff',letterSpacing:1
          }}>VS</div>
          <span style={{fontFamily:'Bebas Neue,cursive',fontSize:'1.5rem',letterSpacing:3,color:'#e8eaf6'}}>
            V<span style={{color:'#00d4ff'}}>SPARK</span>
          </span>
        </Link>

        <div className="desktop-nav" style={{display:'flex',gap:4,alignItems:'center'}}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding:'8px 14px',textDecoration:'none',
              fontFamily:'Rajdhani,sans-serif',fontWeight:600,fontSize:'0.92rem',letterSpacing:1,
              color:loc.pathname===l.to?'#00d4ff':'#8892b0',
              borderBottom:loc.pathname===l.to?'2px solid #00d4ff':'2px solid transparent',
              transition:'all 0.2s',
            }}
            onMouseEnter={e=>{if(loc.pathname!==l.to)e.target.style.color='#e8eaf6'}}
            onMouseLeave={e=>{if(loc.pathname!==l.to)e.target.style.color='#8892b0'}}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="btn-neon" style={{marginLeft:8,fontSize:'0.88rem',padding:'8px 18px',textDecoration:'none'}}>Login</Link>
          <Link to="/register" className="btn-neon btn-orange" style={{marginLeft:4,fontSize:'0.88rem',padding:'8px 18px',textDecoration:'none'}}>Register</Link>
        </div>

        <button onClick={()=>setOpen(!open)} className="mobile-toggle" style={{background:'none',border:'none',color:'#00d4ff',cursor:'pointer',display:'none'}}>
          {open?<X size={24}/>:<Menu size={24}/>}
        </button>
      </div>

      {open && (
        <div style={{background:'rgba(5,8,16,0.98)',borderTop:'1px solid rgba(0,212,255,0.1)',padding:'1rem 2rem 2rem'}}>
          {links.map(l=>(
            <Link key={l.to} to={l.to} onClick={()=>setOpen(false)} style={{
              display:'block',padding:'11px 0',textDecoration:'none',
              color:loc.pathname===l.to?'#00d4ff':'#8892b0',fontWeight:600,
              borderBottom:'1px solid rgba(0,212,255,0.07)'
            }}>{l.label}</Link>
          ))}
          <div style={{display:'flex',gap:12,marginTop:16}}>
            <Link to="/login" onClick={()=>setOpen(false)} className="btn-neon" style={{textDecoration:'none',fontSize:'0.9rem',padding:'10px 20px'}}>Login</Link>
            <Link to="/register" onClick={()=>setOpen(false)} className="btn-neon btn-orange" style={{textDecoration:'none',fontSize:'0.9rem',padding:'10px 20px'}}>Register</Link>
          </div>
        </div>
      )}
      <style>{`@media(max-width:900px){.desktop-nav{display:none!important}.mobile-toggle{display:block!important}}`}</style>
    </nav>
  );
}
