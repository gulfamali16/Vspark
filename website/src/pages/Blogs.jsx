import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ChevronRight } from 'lucide-react'
import { getBlogs } from '../lib/supabase'

const fallbackBlogs = [
  {
    id: 1,
    title: 'COMSATS Vehari Wins 1st Position in E-Gaming at Byte and Battle',
    content: 'Our students have made us proud yet again! The COMSATS University Islamabad Vehari Campus team secured the first position in the E-Gaming category at the prestigious Byte and Battle competition. This remarkable achievement underscores the talent and dedication of our CS department students. The team competed against multiple universities and emerged victorious in both FIFA and Tekken categories, demonstrating exceptional skill and teamwork.',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    created_at: '2025-11-15T10:00:00Z',
    author: 'CS Department',
  },
  {
    id: 2,
    title: 'Introducing Prompt Engineering — VSpark 2025\'s Newest Competition',
    content: 'VSpark 2025 is proud to announce the addition of Prompt Engineering as a new competition category. As artificial intelligence becomes increasingly central to software development and innovation, the ability to effectively communicate with AI systems is a crucial skill. This competition will challenge participants to craft precise, creative, and effective prompts to accomplish complex tasks using state-of-the-art AI models like Claude and ChatGPT.',
    image_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    created_at: '2025-11-10T09:00:00Z',
    author: 'VSpark Team',
  },
  {
    id: 3,
    title: 'Internship Opportunities: How VSpark 2025 Connects You to Industry',
    content: 'One of the most exciting aspects of VSpark 2025 is its integrated internship program, which provides top performers with direct pathways to career opportunities. This year, COMSATS has partnered with several leading tech companies to offer internship placements to standout competitors. Top performers across all categories will be considered for paid internship positions, mentorship programs from industry experts, and direct referrals to hiring managers.',
    image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    created_at: '2025-11-05T14:00:00Z',
    author: 'Career Services',
  },
  {
    id: 4,
    title: 'Tips for Speed Programming: How to Prepare for VSpark 2025',
    content: 'Speed programming competitions require both technical knowledge and mental agility. Here are some essential tips to prepare for the VSpark 2025 coding competition. Start by mastering fundamental data structures and algorithms — arrays, linked lists, trees, graphs, and dynamic programming are staples. Practice on platforms like Codeforces, LeetCode, and HackerRank regularly. Focus on solving problems within time constraints to build your competitive programming instinct.',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    created_at: '2025-10-28T11:00:00Z',
    author: 'Dr. CS Faculty',
  },
]

export default function Blogs() {
  const [blogs, setBlogs] = useState(fallbackBlogs)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getBlogs().then(({ data }) => {
      if (data && data.length > 0) setBlogs(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const readTime = (content) => `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min read`

  if (selected) {
    const blog = blogs.find(b => b.id === selected)
    return (
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
        <section style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: 780 }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: 2, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
              ← Back to Blogs
            </button>

            {blog.image_url && (
              <div style={{ height: 360, overflow: 'hidden', marginBottom: 40, position: 'relative' }}>
                <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(1.2)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, var(--bg-primary) 100%)' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <Calendar size={13} /><span>{formatDate(blog.created_at)}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <Clock size={13} /><span>{readTime(blog.content)}</span>
              </div>
              {blog.author && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <User size={13} /><span>{blog.author}</span>
                </div>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: 2, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: 32 }}>
              {blog.title}
            </h1>

            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1rem' }}>
              {blog.content.split('\n').map((para, i) => para.trim() ? <p key={i} style={{ marginBottom: 16 }}>{para}</p> : null)}
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-subtitle">CS Department News</div>
          <h1 className="section-title"><span style={{ color: 'var(--accent-cyan)' }}>Blogs</span> & Updates</h1>
          <div className="section-divider" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Stay up to date with the latest from VSpark, COMSATS CS Department, and the tech world.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 3 }}>Loading...</div>
          ) : (
            <>
              {/* Featured */}
              <div className="card" style={{ marginBottom: 40, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelected(blogs[0].id)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320 }}>
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <img src={blogs[0].image_url} alt={blogs[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(1.3)', transition: 'transform 0.5s ease' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 60%, var(--bg-card) 100%)' }} />
                    <div style={{ position: 'absolute', top: 16, left: 16 }}>
                      <span className="tag" style={{ background: 'rgba(0,212,255,0.9)', color: '#000', borderColor: 'transparent', fontWeight: 700, fontSize: '0.7rem' }}>FEATURED</span>
                    </div>
                  </div>
                  <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <span>{formatDate(blogs[0].created_at)}</span>
                      <span>·</span>
                      <span>{readTime(blogs[0].content)}</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem', letterSpacing: 2, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: 16 }}>
                      {blogs[0].title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 24 }}>
                      {blogs[0].content.slice(0, 180)}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
                      Read More <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {blogs.slice(1).map((blog, i) => (
                  <div key={blog.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => setSelected(blog.id)}>
                    {blog.image_url && (
                      <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                        <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(1.2)' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, var(--bg-card) 100%)' }} />
                      </div>
                    )}
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 12, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <span>{formatDate(blog.created_at)}</span>
                        <span>·</span>
                        <span>{readTime(blog.content)}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: 12 }}>
                        {blog.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>
                        {blog.content.slice(0, 120)}...
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Read More <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .card > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
