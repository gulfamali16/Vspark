import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{background:'#02040c',borderTop:'1px solid rgba(0,212,255,0.1)',padding:'4rem 2rem 2rem'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'3rem',marginBottom:'3rem'}}>
          <div>
            <div style={{fontFamily:'Bebas Neue,cursive',fontSize:'1.8rem',letterSpacing:3,marginBottom:'1rem'}}>
              V<span style={{color:'#00d4ff'}}>SPARK</span>
            </div>
            <p style={{color:'#8892b0',lineHeight:1.7,marginBottom:'1.5rem',fontSize:'0.93rem'}}>
              COMSATS University Islamabad, Vehari Campus — CS Department's premier national-level innovation event.
            </p>
            <div style={{display:'flex',gap:10}}>
              {[Instagram,Facebook,Twitter].map((Icon,i)=>(
                <a key={i} href="#" style={{width:36,height:36,border:'1px solid rgba(0,212,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00d4ff',textDecoration:'none',transition:'all 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(0,212,255,0.1)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <Icon size={15}/>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{fontFamily:'Bebas Neue,cursive',fontSize:'1.1rem',letterSpacing:2,color:'#00d4ff',marginBottom:'1rem'}}>Quick Links</h4>
            {['/','/competitions','/events','/highlights','/blogs','/department'].map((p,i)=>{
              const labels=['Home','Competitions','Events','Highlights','Blogs','CS Department'];
              return <Link key={i} to={p} style={{display:'block',color:'#8892b0',textDecoration:'none',marginBottom:7,fontSize:'0.93rem',transition:'color 0.2s'}}
                onMouseEnter={e=>e.target.style.color='#00d4ff'}
                onMouseLeave={e=>e.target.style.color='#8892b0'}>→ {labels[i]}</Link>;
            })}
          </div>
          <div>
            <h4 style={{fontFamily:'Bebas Neue,cursive',fontSize:'1.1rem',letterSpacing:2,color:'#00d4ff',marginBottom:'1rem'}}>Contact</h4>
            {[[MapPin,'COMSATS University Islamabad, Vehari Campus'],[Mail,'vspark@cuivehari.edu.pk'],[Phone,'+92-67-XXXXXXX']].map(([Icon,text],i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:14}}>
                <Icon size={15} style={{color:'#00d4ff',marginTop:2,flexShrink:0}}/>
                <span style={{color:'#8892b0',fontSize:'0.88rem'}}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="neon-divider" style={{marginBottom:'1.5rem'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
          <p style={{color:'#8892b0',fontSize:'0.82rem'}}>© VSpark — COMSATS University Islamabad, Vehari Campus. All rights reserved.</p>
          <Link to="/admin/login" style={{color:'rgba(0,212,255,0.35)',fontSize:'0.78rem',textDecoration:'none',fontFamily:'JetBrains Mono,monospace'}}>Admin Panel</Link>
        </div>
      </div>
    </footer>
  );
}
