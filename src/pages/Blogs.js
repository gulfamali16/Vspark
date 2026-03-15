import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [achievementIds, setAchievementIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | achievements | posts

  useEffect(() => {
    Promise.all([
      supabase.from('blogs').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('value').eq('key', 'achievement_blog_ids').single(),
    ]).then(([blogsRes, settRes]) => {
      setBlogs(blogsRes.data || []);
      if (settRes.data?.value) {
        try { setAchievementIds(JSON.parse(settRes.data.value)); } catch (e) {}
      }
      setLoading(false);
    });
  }, []);

  const achievements = blogs.filter(b => achievementIds.includes(b.id));
  const regularBlogs = blogs.filter(b => !achievementIds.includes(b.id));
  const displayBlogs = filter === 'achievements' ? achievements : filter === 'posts' ? regularBlogs : blogs;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top,rgba(0,212,255,0.07) 0%,transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>News & Updates</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Blogs & Achievements</h1>
        <p style={{ color: '#8892b0', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Latest news, department achievements, event updates, and stories from VSpark.
        </p>
      </section>

      {/* Achievements highlight strip */}
      {achievements.length > 0 && (
        <section style={{ padding: '0 2rem 3rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ padding: '2rem', background: 'linear-gradient(135deg,rgba(255,215,0,0.06) 0%,rgba(255,215,0,0.02) 100%)', border: '1px solid rgba(255,215,0,0.2)', borderLeft: '4px solid #ffd700' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <Trophy size={20} style={{ color: '#ffd700' }} />
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: 3, color: '#ffd700' }}>Department Achievements</h2>
                <span style={{ padding: '1px 8px', background: 'rgba(255,215,0,0.1)', color: '#ffd700', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', border: '1px solid rgba(255,215,0,0.3)' }}>{achievements.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.75rem' }}>
                {achievements.map(blog => (
                  <Link key={blog.id} to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '0.9rem 1.1rem', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', gap: 10 }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.15)'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, overflow: 'hidden' }}>
                        <Trophy size={13} style={{ color: '#ffd700', flexShrink: 0 }} />
                        <span style={{ color: '#e8eaf6', fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{blog.title}</span>
                      </div>
                      <ArrowRight size={13} style={{ color: '#ffd700', flexShrink: 0 }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter tabs */}
      <section style={{ padding: '0 2rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: '2rem', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
            {[
              { id: 'all', label: `All (${blogs.length})` },
              { id: 'achievements', label: `Achievements (${achievements.length})` },
              { id: 'posts', label: `Blog Posts (${regularBlogs.length})` },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                padding: '10px 20px', background: 'transparent', border: 'none',
                borderBottom: filter === id ? '2px solid #00d4ff' : '2px solid transparent',
                color: filter === id ? '#00d4ff' : '#8892b0',
                cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 1.5, fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Loading...</p>
          ) : displayBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#8892b0' }}>
              <BookOpen size={40} style={{ marginBottom: '1rem' }} />
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>No posts yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
              {displayBlogs.map(blog => {
                const isAchievement = achievementIds.includes(blog.id);
                return (
                  <Link key={blog.id} to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                    <div className="glass" style={{ height: '100%', overflow: 'hidden', transition: 'all 0.3s', borderColor: isAchievement ? 'rgba(255,215,0,0.2)' : 'rgba(0,212,255,0.15)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${isAchievement ? 'rgba(255,215,0,0.12)' : 'rgba(0,212,255,0.1)'}`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                      {blog.image_url && (
                        <div style={{ height: 180, overflow: 'hidden' }}>
                          <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            onError={e => e.target.parentElement.style.display = 'none'} />
                        </div>
                      )}

                      <div style={{ padding: '1.5rem' }}>
                        {isAchievement && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <Trophy size={12} style={{ color: '#ffd700' }} />
                            <span style={{ color: '#ffd700', fontSize: '0.68rem', fontFamily: 'JetBrains Mono', letterSpacing: 2 }}>ACHIEVEMENT</span>
                          </div>
                        )}
                        <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: 8, lineHeight: 1.3 }}>{blog.title}</h3>
                        {blog.content && (
                          <p style={{ color: '#8892b0', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                            {blog.content.replace(/<[^>]*>/g, '').slice(0, 120)}...
                          </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                          <span style={{ color: '#8892b0', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Calendar size={11} />
                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span style={{ color: isAchievement ? '#ffd700' : '#00d4ff', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            Read <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}