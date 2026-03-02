import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const fallbackHighlights = [
  { id:1, image_url:'https://via.placeholder.com/600x400/050810/00d4ff?text=Speed+Programming', description:'Speed Programming Competition 2024' },
  { id:2, image_url:'https://via.placeholder.com/600x400/050810/7c3aed?text=E-Gaming+Finals', description:'E-Gaming Championship Finals' },
  { id:3, image_url:'https://via.placeholder.com/600x400/050810/ff6b00?text=Web+Dev', description:'Web Development Winners' },
  { id:4, image_url:'https://via.placeholder.com/600x400/050810/ffd700?text=Awards+Ceremony', description:'Awards Ceremony 2024' },
  { id:5, image_url:'https://via.placeholder.com/600x400/050810/00ff88?text=CS+Department', description:'CS Department Showcase' },
  { id:6, image_url:'https://via.placeholder.com/600x400/050810/ff3d77?text=Innovation+Expo', description:'Innovation Exhibition' },
];

export default function Highlights() {
  const [highlights, setHighlights] = useState(fallbackHighlights);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    supabase.from('highlights').select('*').then(({data})=>{ if(data&&data.length) setHighlights(data); });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(255,107,0,0.08) 0%, transparent 60%)' }}>
        <span className="tag" style={{ display:'inline-block', marginBottom:'1rem' }}>Event Memories</span>
        <h1 className="section-title" style={{ display:'block', marginBottom:'1rem' }}>Highlights</h1>
        <p style={{ color:'#8892b0', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>Relive the energy, innovation, and excitement of past VSpark events.</p>
      </section>

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', columns: '3 300px', gap: '1rem' }}>
          {highlights.map((h, i) => (
            <div key={h.id} style={{ breakInside: 'avoid', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setSelected(h)}>
              <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,212,255,0.15)' }}
                onMouseEnter={e => { e.currentTarget.querySelector('.overlay').style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('.overlay').style.opacity = '0'; }}>
                <img src={h.image_url} alt={h.description} style={{ width:'100%', display:'block', transition:'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'} />
                <div className="overlay" style={{
                  position:'absolute', inset:0, background:'rgba(0,212,255,0.1)', display:'flex', alignItems:'flex-end',
                  padding:'1rem', opacity:0, transition:'opacity 0.3s',
                }}>
                  <p style={{ color:'#fff', fontWeight:600, fontSize:'0.9rem' }}>{h.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9999,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem',
        }}>
          <div onClick={e=>e.stopPropagation()}>
            <img src={selected.image_url} alt={selected.description} style={{ maxWidth:'90vw', maxHeight:'80vh', objectFit:'contain' }} />
            <p style={{ color:'#e8eaf6', textAlign:'center', marginTop:'1rem', fontWeight:600 }}>{selected.description}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
