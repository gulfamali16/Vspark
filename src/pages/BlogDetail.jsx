import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

export default function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('blogs').select('*').eq('id', id).single()
      .then(({ data }) => { setBlog(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <section style={{ padding: '60px 0 100px' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <Link to="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--primary)', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.875rem', marginBottom: 40 }}>
              <ArrowLeft size={16} /> Back to Blogs
            </Link>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 80 }}>
                <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : !blog ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                <p>Blog not found.</p>
              </div>
            ) : (
              <div>
                {blog.image_url && (
                  <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 20, marginBottom: 40 }} />
                )}
                <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <User size={14} style={{ color: 'var(--primary)' }} /> {blog.author || 'VSpark Team'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    {new Date(blog.created_at).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 32, lineHeight: 1.2 }}>{blog.title}</h1>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{blog.content}</div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
