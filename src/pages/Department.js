import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, BookOpen, Users, Trophy, Star, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Department() {
  const [faculty, setFaculty] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [tab, setTab] = useState('faculty');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [facRes, progRes, settRes] = await Promise.all([
        supabase.from('faculty').select('*').eq('is_active', true).order('display_order'),
        supabase.from('programs').select('*').eq('is_active', true).order('title'),
        supabase.from('site_settings').select('value').eq('key', 'achievement_blog_ids').single(),
      ]);

      setFaculty(facRes.data || []);
      setPrograms(progRes.data || []);

      // Load achievement blogs
      if (settRes.data?.value) {
        try {
          const ids = JSON.parse(settRes.data.value);
          if (ids.length > 0) {
            const { data: blogs } = await supabase.from('blogs').select('id,title,created_at,image_url').in('id', ids);
            setAchievements(blogs || []);
          }
        } catch (e) {}
      }

      setLoading(false);
    };
    load();
  }, []);

  const hod = faculty.find(f => f.is_hod);
  const regularFaculty = faculty.filter(f => !f.is_hod);

  const tabs = [
    { id: 'faculty',      label: 'Faculty',      icon: Users },
    { id: 'programs',     label: 'Programs',     icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top,rgba(124,58,237,0.1) 0%,transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>COMSATS University Islamabad • Vehari Campus</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '0.75rem' }}>Computer Science</h1>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(1.5rem,4vw,2.5rem)', letterSpacing: 3, color: '#8892b0', marginBottom: '1.5rem' }}>Department</h2>
        <p style={{ color: '#8892b0', maxWidth: 580, margin: '0 auto', lineHeight: 1.8, fontSize: '1rem' }}>
          Shaping the next generation of technology leaders through world-class education, research, and innovation.
        </p>
      </section>

      {/* HOD Card */}
      {hod && (
        <section style={{ padding: '0 2rem 4rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="glass" style={{ padding: '2.5rem', borderColor: 'rgba(255,215,0,0.2)', background: 'linear-gradient(135deg,rgba(255,215,0,0.03) 0%,transparent 100%)', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {hod.image_url ? (
                <img src={hod.image_url} alt={hod.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,215,0,0.4)', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,215,0,0.08)', border: '3px solid rgba(255,215,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Star size={36} style={{ color: '#ffd700' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ padding: '2px 10px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', letterSpacing: 2 }}>HEAD OF DEPARTMENT</span>
                </div>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 4 }}>{hod.name}</h2>
                <p style={{ color: '#ffd700', fontSize: '0.9rem', marginBottom: 8 }}>{hod.designation} — {hod.specialization}</p>
                {hod.bio && <p style={{ color: '#8892b0', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1rem' }}>{hod.bio}</p>}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {hod.github_url && <a href={hod.github_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8892b0', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#e8eaf6'} onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}><Github size={15} /> GitHub</a>}
                  {hod.linkedin_url && <a href={hod.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8892b0', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'} onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}><Linkedin size={15} /> LinkedIn</a>}
                  {hod.email && <a href={`mailto:${hod.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8892b0', textDecoration: 'none', fontSize: '0.85rem' }}><Mail size={15} /> {hod.email}</a>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section style={{ padding: '0 2rem 6rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: '2.5rem', borderBottom: '1px solid rgba(0,212,255,0.1)', overflowX: 'auto' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '12px 28px', background: 'transparent', border: 'none',
                borderBottom: tab === id ? '2px solid #00d4ff' : '2px solid transparent',
                color: tab === id ? '#00d4ff' : '#8892b0',
                cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '1rem',
                display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}>
                <Icon size={15} /> {label}
                {id === 'achievements' && achievements.length > 0 && (
                  <span style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', fontSize: '0.65rem', padding: '1px 7px', fontFamily: 'JetBrains Mono', border: '1px solid rgba(255,215,0,0.3)' }}>
                    {achievements.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* FACULTY TAB */}
          {tab === 'faculty' && (
            <div>
              {loading ? (
                <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Loading faculty...</p>
              ) : regularFaculty.length === 0 ? (
                <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Faculty details coming soon.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
                  {regularFaculty.map(f => (
                    <div key={f.id} className="glass" style={{ padding: '2rem', transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; }}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                        {f.image_url ? (
                          <img src={f.image_url} alt={f.name} style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.25)', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(0,212,255,0.06)', border: '2px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Users size={26} style={{ color: '#00d4ff' }} />
                          </div>
                        )}
                        <div>
                          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.15rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: 3 }}>{f.name}</h3>
                          <p style={{ color: '#00d4ff', fontSize: '0.8rem', marginBottom: 2 }}>{f.designation}</p>
                          <p style={{ color: '#8892b0', fontSize: '0.75rem' }}>{f.specialization}</p>
                        </div>
                      </div>
                      {f.bio && <p style={{ color: '#8892b0', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>{f.bio}</p>}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                        {f.github_url && (
                          <a href={f.github_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8892b0', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#e8eaf6'}
                            onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}>
                            <Github size={14} /> GitHub
                          </a>
                        )}
                        {f.linkedin_url && (
                          <a href={f.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8892b0', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}>
                            <Linkedin size={14} /> LinkedIn
                          </a>
                        )}
                        {f.email && (
                          <a href={`mailto:${f.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8892b0', textDecoration: 'none', fontSize: '0.82rem' }}>
                            <Mail size={14} /> Email
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROGRAMS TAB */}
          {tab === 'programs' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {loading ? (
                <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Loading programs...</p>
              ) : programs.length === 0 ? (
                <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Program details coming soon.</p>
              ) : programs.map(p => (
                <div key={p.id} className="glass" style={{ padding: '2rem', borderLeft: '3px solid #7c3aed', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 6 }}>{p.title}</h3>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 10px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#7c3aed', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>{p.degree}</span>
                        <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>{p.duration}</span>
                        <span style={{ padding: '3px 10px', background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)', color: '#ffd700', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>{p.total_seats} Seats</span>
                      </div>
                    </div>
                    <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '10px 20px' }}>
                      Apply Now
                    </Link>
                  </div>
                  <p style={{ color: '#8892b0', lineHeight: 1.8, fontSize: '0.92rem' }}>{p.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {tab === 'achievements' && (
            <div>
              {achievements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <Trophy size={48} style={{ color: '#8892b0', marginBottom: '1rem' }} />
                  <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Achievements coming soon.</p>
                </div>
              ) : (
                <>
                  <p style={{ color: '#8892b0', marginBottom: '2rem', lineHeight: 1.7 }}>
                    Celebrating the milestones and victories of the COMSATS CS Department community.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.25rem' }}>
                    {achievements.map((blog, i) => (
                      <Link key={blog.id} to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                        <div className="glass" style={{ padding: '1.75rem', borderLeft: '3px solid #ffd700', cursor: 'pointer', transition: 'all 0.3s', height: '100%' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(255,215,0,0.12)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ width: 36, height: 36, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Trophy size={16} style={{ color: '#ffd700' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ color: '#e8eaf6', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 8 }}>{blog.title}</h3>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#8892b0', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>
                                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span style={{ color: '#ffd700', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  Read more <ChevronRight size={12} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}