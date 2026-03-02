import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const fallbackBlogs = [
  {
    id: 'b1',
    title: 'VSpark 2025: What to Expect This Year',
    content: 'This year VSpark brings exciting new categories including Prompt Engineering. Get ready for the biggest CS event at COMSATS Vehari campus yet. With internship opportunities and amazing prizes...',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    author: 'VSpark Team',
    created_at: '2025-11-15T10:00:00',
  },
  {
    id: 'b2',
    title: 'How to Prepare for Speed Programming Competitions',
    content: 'Speed programming is all about problem-solving under pressure. Here are the top strategies to prepare for competitive coding: practice data structures, learn common algorithms, and time your practice sessions...',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    author: 'CS Department',
    created_at: '2025-11-10T10:00:00',
  },
  {
    id: 'b3',
    title: 'COMSATS Vehari Wins 1st Place in E-Gaming',
    content: 'Our students have made us proud once again! The COMSATS Vehari team secured first position in E-Gaming at the Byte and Battle competition. Congratulations to all participants who represented our campus...',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    author: 'Student Affairs',
    created_at: '2025-10-28T10:00:00',
  },
  {
    id: 'b4',
    title: 'Introduction to Prompt Engineering: The New Frontier',
    content: 'Prompt Engineering is the newest discipline in AI. As LLMs become more powerful, the ability to communicate effectively with AI systems has become a valuable skill. VSpark 2025 is proud to introduce this as a new competition category...',
    image_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
    author: 'AI Lab',
    created_at: '2025-10-20T10:00:00',
  },
]

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('blogs').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setBlogs(data?.length ? data : fallbackBlogs)
        setLoading(false)
      })
      .catch(() => {
        setBlogs(fallbackBlogs)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <section style={{ padding: '60px 0 40px', textAlign: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(255,107,53,0.05), transparent 60%)', pointerEvents: 'none' }} />
          <div className="container">
            <div className="badge" style={{ marginBottom: 24 }}>Blog</div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              News & <span className="gradient-text">Insights</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              CS department news, student articles, and tech updates from the VSpark team.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 100px' }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 80 }}>
                <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : blogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                <p>No blogs yet. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                      {blog.image_url && (
                        <div style={{ height: 200, overflow: 'hidden' }}>
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}
                      <div style={{ padding: 28 }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <User size={13} style={{ color: 'var(--primary)' }} /> {blog.author || 'VSpark Team'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <Calendar size={13} style={{ color: 'var(--primary)' }} />
                            {new Date(blog.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, color: 'var(--text)' }}>{blog.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 18 }}>
                          {blog.content?.substring(0, 150)}...
                        </p>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                          Read more <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
