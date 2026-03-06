import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Users, Award, Code, Cpu, Globe } from 'lucide-react';

const faculty = [
  { name: 'Dr. [HOD Name]', role: 'Head of Department', specialization: 'Machine Learning & AI' },
  { name: 'Dr. [Faculty Name]', role: 'Associate Professor', specialization: 'Data Structures & Algorithms' },
  { name: 'Mr. [Faculty Name]', role: 'Lecturer', specialization: 'Web Technologies' },
  { name: 'Ms. [Faculty Name]', role: 'Lecturer', specialization: 'Database Systems' },
];

const achievements = [
  '1st Place — E-Gaming, Byte & Battle Regional Competition',
  'Top-ranked CS Department in Vehari Region',
  'Active research in AI and Machine Learning',
  'Industry partnerships for student internships',
  'National-level hackathon participation',
];

const programs = [
  { icon: Code, name: 'BS Computer Science', desc: '4-year flagship program covering algorithms, AI, and software engineering' },
  { icon: Globe, name: 'BS Software Engineering', desc: 'Industry-focused SE curriculum with capstone projects' },
  { icon: Cpu, name: 'BS Information Technology', desc: 'Broad IT foundation with specialization tracks' },
  { icon: BookOpen, name: 'BS Artificial Intelligence', desc: 'Cutting-edge AI, ML, and data science curriculum' },
];

export default function Department() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      
      {/* Hero */}
      <section style={{ padding:'10rem 2rem 5rem', textAlign:'center', background:'radial-gradient(ellipse at top, rgba(0,212,255,0.08) 0%, transparent 60%)' }}>
        <span className="tag" style={{ display:'inline-block', marginBottom:'1rem' }}>COMSATS Vehari</span>
        <h1 className="section-title" style={{ display:'block', marginBottom:'1rem' }}>CS Department</h1>
        <p style={{ color:'#8892b0', maxWidth:600, margin:'0 auto', lineHeight:1.8, fontSize:'1.05rem' }}>
          The Department of Computer Science at COMSATS University Islamabad, Vehari Campus — nurturing the technology leaders of tomorrow through world-class education and innovation.
        </p>
      </section>

      {/* Programs */}
      <section style={{ padding:'4rem 2rem 5rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:'2rem', letterSpacing:3, color:'#e8eaf6', marginBottom:'2.5rem', textAlign:'center' }}>Academic Programs</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'1.5rem' }}>
            {programs.map(({ icon: Icon, name, desc }, i) => (
              <div key={i} className="glass" style={{ padding:'2rem', borderRadius:2, transition:'all 0.3s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,212,255,0.4)';e.currentTarget.style.transform='translateY(-4px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,212,255,0.15)';e.currentTarget.style.transform='translateY(0)';}}>
                <Icon size={32} style={{ color:'#00d4ff', marginBottom:'1rem' }} />
                <h3 style={{ fontFamily:'Bebas Neue', fontSize:'1.2rem', letterSpacing:2, color:'#e8eaf6', marginBottom:8 }}>{name}</h3>
                <p style={{ color:'#8892b0', fontSize:'0.9rem', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section style={{ padding:'4rem 2rem 5rem', borderTop:'1px solid rgba(0,212,255,0.08)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:'2rem', letterSpacing:3, color:'#e8eaf6', marginBottom:'2rem', textAlign:'center' }}>Department Achievements</h2>
          {achievements.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.5rem', marginBottom:'0.75rem', background:'rgba(255,215,0,0.03)', border:'1px solid rgba(255,215,0,0.1)', borderRadius:2 }}>
              <Award size={18} style={{ color:'#ffd700', flexShrink:0 }} />
              <span style={{ color:'#8892b0', fontWeight:500 }}>{a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty */}
      <section style={{ padding:'4rem 2rem 6rem', borderTop:'1px solid rgba(0,212,255,0.08)' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:'2rem', letterSpacing:3, color:'#e8eaf6', marginBottom:'2.5rem', textAlign:'center' }}>Faculty</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem' }}>
            {faculty.map((f, i) => (
              <div key={i} className="glass" style={{ padding:'2rem', textAlign:'center', borderRadius:2 }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))`, border:'2px solid rgba(0,212,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.5rem' }}>
                  <Users size={28} style={{ color:'#00d4ff' }} />
                </div>
                <h3 style={{ fontFamily:'Bebas Neue', letterSpacing:1, color:'#e8eaf6', marginBottom:4 }}>{f.name}</h3>
                <p style={{ color:'#00d4ff', fontSize:'0.85rem', marginBottom:8, fontWeight:600 }}>{f.role}</p>
                <p style={{ color:'#8892b0', fontSize:'0.8rem' }}>{f.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
