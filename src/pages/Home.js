import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Trophy, Code, Gamepad2, Palette, Zap, Brain, Star, ArrowRight, Users, Calendar, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticlesBg from '../components/ParticlesBg';

const stats = [
  {icon:Users,value:'500+',label:'Participants'},
  {icon:Trophy,value:'20+',label:'Awards'},
  {icon:Calendar,value:'1',label:'Epic Day'},
  {icon:Award,value:'7+',label:'Competitions'},
];

export default function Home() {
  const [vis, setVis] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVis(true),100); },[]);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',position:'relative'}}>
      <ParticlesBg/>
      <Navbar/>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',padding:'8rem 2rem 4rem',textAlign:'center',background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,212,255,0.07) 0%,transparent 70%)'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:0,pointerEvents:'none'}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{position:'absolute',top:'50%',left:'50%',width:i*320,height:i*320,border:`1px solid rgba(0,212,255,${0.07-i*0.02})`,borderRadius:'50%',transform:'translate(-50%,-50%)',animation:`rotate ${15+i*5}s linear infinite ${i%2?'reverse':''}`}}/>
          ))}
        </div>
        <div style={{position:'relative',zIndex:1,maxWidth:900}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:'1.5rem',opacity:vis?1:0,transition:'opacity 0.8s'}}>
            <span className="tag">COMSATS University Islamabad • Vehari Campus</span>
          </div>
          <h1 style={{fontFamily:'Bebas Neue,cursive',fontSize:'clamp(5rem,15vw,12rem)',lineHeight:0.9,letterSpacing:'0.02em',marginBottom:'0.5rem',opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(40px)',transition:'all 1s ease 0.2s'}}>
            <span style={{display:'block',background:'linear-gradient(135deg,#fff 30%,#00d4ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>V</span>
            <span style={{display:'block',background:'linear-gradient(135deg,#00d4ff,#7c3aed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>SPARK</span>
          </h1>
          <p style={{color:'#8892b0',maxWidth:600,margin:'1.5rem auto 2.5rem',lineHeight:1.8,fontSize:'clamp(1rem,2vw,1.2rem)',fontWeight:500,opacity:vis?1:0,transition:'all 0.8s ease 0.6s'}}>
            National-level coding competition and innovation showcase — <span style={{color:'#00d4ff'}}>COMSATS Vehari Campus</span>. Speed programming, e-gaming, web dev, AI prompting and more.
          </p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',opacity:vis?1:0,transition:'all 0.8s ease 0.8s'}}>
            <Link to="/register" className="btn-neon" style={{textDecoration:'none',fontSize:'1.1rem',padding:'14px 36px'}}>Register Now</Link>
            <Link to="/competitions" className="btn-neon btn-orange" style={{textDecoration:'none',fontSize:'1.1rem',padding:'14px 36px'}}>Explore Events</Link>
          </div>
          <div style={{marginTop:'4rem',animation:'float 3s ease-in-out infinite'}}>
            <ChevronDown size={30} style={{color:'rgba(0,212,255,0.4)'}}/>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:'4rem 2rem',background:'rgba(0,212,255,0.02)',borderTop:'1px solid rgba(0,212,255,0.08)',borderBottom:'1px solid rgba(0,212,255,0.08)'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'2rem'}}>
          {stats.map(({icon:Icon,value,label},i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <Icon size={26} style={{color:'#00d4ff',marginBottom:8}}/>
              <div style={{fontFamily:'Bebas Neue,cursive',fontSize:'2.8rem',color:'#fff',lineHeight:1,letterSpacing:2}}>{value}</div>
              <div style={{color:'#8892b0',fontWeight:600,letterSpacing:2,textTransform:'uppercase',fontSize:'0.82rem',marginTop:4}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPETITIONS PREVIEW */}
      <section style={{padding:'6rem 2rem',position:'relative',zIndex:1}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <span className="tag" style={{marginBottom:'1rem',display:'inline-block'}}>What to Expect</span>
            <h2 className="section-title" style={{display:'block'}}>Competitions</h2>
            <p style={{color:'#8892b0',maxWidth:500,margin:'1rem auto 0',lineHeight:1.7}}>Seven high-stakes categories — each with prizes, registration fees, and internship opportunities</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem'}}>
            {[
              {icon:Code,title:'Speed Programming',fee:300,color:'#00d4ff'},
              {icon:Gamepad2,title:'E-Gaming',fee:200,color:'#7c3aed'},
              {icon:Code,title:'Web Development',fee:350,color:'#ff6b00'},
              {icon:Palette,title:'UI/UX Design',fee:250,color:'#ffd700'},
              {icon:Brain,title:'Prompt Engineering',fee:200,color:'#00ff88',isNew:true},
              {icon:Star,title:'CS Quiz',fee:150,color:'#ff3d77'},
              {icon:Palette,title:'Poster Design',fee:200,color:'#00d4ff'},
            ].map(({icon:Icon,title,fee,color,isNew},i)=>(
              <div key={i} className="glass" style={{padding:'1.75rem',borderRadius:2,cursor:'pointer',transition:'all 0.3s',position:'relative',overflow:'hidden'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.borderColor=color;e.currentTarget.style.boxShadow=`0 20px 60px ${color}20`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(0,212,255,0.15)';e.currentTarget.style.boxShadow='none';}}>
                <div style={{position:'absolute',top:-20,right:-20,width:90,height:90,borderRadius:'50%',background:`radial-gradient(circle,${color}20 0%,transparent 70%)`}}/>
                <div style={{width:44,height:44,border:`1px solid ${color}40`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem'}}>
                  <Icon size={20} style={{color}}/>
                </div>
                <h3 style={{fontFamily:'Bebas Neue,cursive',fontSize:'1.3rem',letterSpacing:2,color:'#e8eaf6',marginBottom:4}}>{title}</h3>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                  <span style={{fontFamily:'Bebas Neue',fontSize:'1.1rem',color:'#ffd700',letterSpacing:1}}>PKR {fee}</span>
                  {isNew&&<span style={{padding:'2px 8px',background:`${color}20`,color,fontSize:'0.65rem',fontFamily:'JetBrains Mono',border:`1px solid ${color}40`}}>NEW</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'3rem'}}>
            <Link to="/competitions" className="btn-neon" style={{textDecoration:'none'}}>View All Details <ArrowRight size={14} style={{display:'inline',marginLeft:6}}/></Link>
          </div>
        </div>
      </section>

      {/* INTERNSHIP */}
      <section style={{padding:'6rem 2rem',background:'linear-gradient(135deg,rgba(0,212,255,0.04) 0%,rgba(124,58,237,0.04) 100%)',borderTop:'1px solid rgba(0,212,255,0.1)',borderBottom:'1px solid rgba(0,212,255,0.1)'}}>
        <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
          <Zap size={44} style={{color:'#ffd700',marginBottom:'1.5rem'}}/>
          <h2 className="section-title" style={{display:'block',marginBottom:'1rem'}}>Internship Program</h2>
          <p style={{color:'#8892b0',fontSize:'1.05rem',lineHeight:1.8,marginBottom:'2.5rem'}}>
            Top performers unlock <span style={{color:'#ffd700',fontWeight:700}}>exclusive internship opportunities</span> with industry partners. Your performance determines your career tomorrow.
          </p>
          <Link to="/register" className="btn-neon" style={{textDecoration:'none',borderColor:'#ffd700',color:'#ffd700'}}>Register & Compete</Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'6rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,rgba(124,58,237,0.12) 0%,transparent 70%)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <h2 style={{fontFamily:'Bebas Neue,cursive',fontSize:'clamp(2rem,5vw,4rem)',letterSpacing:4,color:'#e8eaf6',marginBottom:'1rem'}}>
            Ready to <span style={{color:'#00d4ff'}}>Ignite</span> Your Potential?
          </h2>
          <p style={{color:'#8892b0',marginBottom:'2.5rem',fontSize:'1.02rem'}}>Register now and secure your spot at VSpark</p>
          <Link to="/register" className="btn-neon" style={{textDecoration:'none',fontSize:'1.15rem',padding:'16px 48px'}}>Register Now</Link>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
