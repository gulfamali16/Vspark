import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const fallbackBlogs = [
  { id:1, title:'Why Prompt Engineering is the Skill of 2025', content:'Artificial intelligence has transformed how developers work...', created_at:'2025-11-01', image_url:'' },
  { id:2, title:'CUI Vehari Wins 1st Place in E-Gaming at Byte & Battle', content:'In a thrilling display of skill and teamwork, students from COMSATS Vehari...', created_at:'2025-10-15', image_url:'' },
  { id:3, title:'How to Ace Speed Programming Competitions', content:'Speed programming requires more than just knowing algorithms...', created_at:'2025-10-01', image_url:'' },
  { id:4, title:'UI/UX Design: Creating Experiences That Matter', content:'Great design is invisible. Users shouldnt think about the interface...', created_at:'2025-09-20', image_url:'' },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  useEffect(() => {
    supabase.from('blogs').select('*').order('created_at',{ascending:false}).then(({data})=>{ if(data&&data.length) setBlogs(data); });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, transparent 60%)' }}>
        <span className="tag" style={{ display:'inline-block', marginBottom:'1rem' }}>Articles & Updates</span>
        <h1 className="section-title" style={{ display:'block', marginBottom:'1rem' }}>CS Blog</h1>
        <p style={{ color:'#8892b0', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>Tech insights, department news, student achievements, and more.</p>
      </section>

      <section style={{ padding:'2rem 2rem 6rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'2rem' }}>
          {blogs.map((blog, i) => (
            <Link key={blog.id} to={`/blogs/${blog.id}`} style={{ textDecoration:'none' }}>
              <div className="glass" style={{
                padding:'2rem', borderRadius:2, height:'100%',
                transition:'all 0.3s', cursor:'pointer',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.4)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.15)'; }}>
                {/* Placeholder image */}
                <div style={{
                  height:160, marginBottom:'1.5rem',
                  background:`linear-gradient(135deg, ${['rgba(0,212,255,0.1)','rgba(124,58,237,0.1)','rgba(255,107,0,0.1)','rgba(255,215,0,0.1)'][i%4]} 0%, rgba(0,0,0,0.3) 100%)`,
                  border:'1px solid rgba(0,212,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {blog.image_url ? <img src={blog.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontFamily:'Bebas Neue', fontSize:'2rem', color:'rgba(0,212,255,0.2)', letterSpacing:4 }}>VSPARK</span>}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Calendar size={12} style={{ color:'#00d4ff' }} />
                  <span style={{ color:'#8892b0', fontSize:'0.8rem', fontFamily:'JetBrains Mono' }}>
                    {new Date(blog.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                  </span>
                </div>
                <h3 style={{ fontFamily:'Bebas Neue', fontSize:'1.4rem', letterSpacing:2, color:'#e8eaf6', marginBottom:12, lineHeight:1.2 }}>{blog.title}</h3>
                <p style={{ color:'#8892b0', fontSize:'0.9rem', lineHeight:1.6, marginBottom:'1rem' }}>{blog.content.substring(0,120)}...</p>
                <span style={{ color:'#00d4ff', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:6 }}>Read More <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
