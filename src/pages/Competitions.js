import React, { useState, useEffect } from 'react';
import { Clock, Trophy, ChevronDown, ChevronUp, Megaphone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Competitions() {
  const [comps, setComps] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('competitions').select('*').eq('is_active', true).order('title')
      .then(({ data }) => {
        setComps(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(0,212,255,0.15)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>Loading competitions...</p>
      </div>
      <style>{`@keyframes rotate{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top,rgba(0,212,255,0.08) 0%,transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>All Events</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Competitions</h1>
        <p style={{ color: '#8892b0', maxWidth: 580, margin: '0 auto', lineHeight: 1.7, fontSize: '1.02rem' }}>
          {comps.length} competition{comps.length !== 1 ? 's' : ''} — each with prizes, registration fees, and internship opportunities.
        </p>
      </section>

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem' }}>
          {comps.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
              Competitions will be announced soon. Check back later!
            </div>
          )}
          {comps.map(comp => {
            const isOpen = expanded === comp.id;
            const color = comp.color || '#00d4ff';
            return (
              <div key={comp.id} className="glass" style={{
                padding: '2rem', borderRadius: 2, cursor: 'pointer',
                borderColor: isOpen ? color : 'rgba(0,212,255,0.15)',
                boxShadow: isOpen ? `0 0 40px ${color}20` : 'none',
                transition: 'all 0.3s',
              }} onClick={() => setExpanded(isOpen ? null : comp.id)}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color, letterSpacing: 2 }}>{comp.category}</span>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.45rem', letterSpacing: 2, color: '#e8eaf6', lineHeight: 1, marginTop: 2 }}>{comp.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {comp.is_new && <span style={{ padding: '2px 8px', background: `${color}20`, color, fontSize: '0.65rem', fontFamily: 'JetBrains Mono', border: `1px solid ${color}40` }}>NEW</span>}
                    {isOpen ? <ChevronUp size={16} style={{ color }} /> : <ChevronDown size={16} style={{ color: '#8892b0' }} />}
                  </div>
                </div>

                <p style={{ color: '#8892b0', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{comp.short_desc}</p>

                {/* Fee */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', background: `${color}10`, border: `1px solid ${color}30` }}>
                  <span style={{ color: '#8892b0', fontSize: '0.82rem' }}>Registration Fee</span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', color: '#ffd700', letterSpacing: 1 }}>
                    PKR {comp.fee?.toLocaleString()}
                  </span>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ marginTop: '1.25rem' }}>

                    {/* Date announcement */}
                    <div style={{ padding: '0.75rem 1rem', background: comp.date_announced ? 'rgba(0,212,255,0.07)' : 'rgba(255,107,0,0.07)', border: `1px solid ${comp.date_announced ? 'rgba(0,212,255,0.2)' : 'rgba(255,107,0,0.2)'}`, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {comp.date_announced
                        ? <Calendar size={14} style={{ color: '#00d4ff', flexShrink: 0 }} />
                        : <Megaphone size={14} style={{ color: '#ff6b00', flexShrink: 0 }} />
                      }
                      <span style={{ color: comp.date_announced ? '#00d4ff' : '#ff6b00', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>
                        {comp.date_announced && comp.event_date
                          ? `📅 ${new Date(comp.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                          : '⏳ Date & time to be announced — stay tuned'}
                      </span>
                    </div>

                    {/* Rules */}
                    {comp.rules && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                          <Clock size={13} /> Rules
                        </h4>
                        {comp.rules.split('\n').filter(Boolean).map((r, ri) => (
                          <p key={ri} style={{ color: '#8892b0', fontSize: '0.88rem', marginBottom: 4 }}>• {r}</p>
                        ))}
                      </div>
                    )}

                    {/* Prizes */}
                    {comp.prizes && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#ffd700', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                          <Trophy size={13} /> Prizes
                        </h4>
                        {comp.prizes.split('\n').filter(Boolean).map((p, pi) => (
                          <p key={pi} style={{ color: '#ffd700', fontSize: '0.88rem', marginBottom: 4, opacity: pi === 0 ? 1 : pi === 1 ? 0.8 : 0.6 }}>🏆 {p}</p>
                        ))}
                      </div>
                    )}

                    <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '0.88rem', padding: '10px 22px', display: 'inline-block' }} onClick={e => e.stopPropagation()}>
                      Register — PKR {comp.fee?.toLocaleString()}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}