/**
 * BlogDetail.jsx — Premium light-theme blog post
 */
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const DATE_FORMAT = new Intl.DateTimeFormat('en-PK',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })

export default function BlogDetail() {
  const { id } = useParams()
  const [blog,    setBlog]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await supabase.from('blogs').select('*').eq('id',id).single()
        setBlog(data)
      } catch {}
      finally { setLoading(false) }
    }
    fetchBlog()
  }, [id])

  return (
    <div style={{ background:'#F9F7F4', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:68 }}>
        <section style={{ padding:'64px 0 100px' }}>
          <div className="container" style={{ maxWidth:760 }}>
            <Link to="/blogs" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#4F46E5', textDecoration:'none', fontWeight:600, fontSize:'0.875rem', marginBottom:40, padding:'8px 14px', background:'#EEF2FF', borderRadius:8 }}>
              <ArrowLeft size={15} /> Back to Blogs
            </Link>
            {loading ? (
              <div style={{ textAlign:'center', padding:80 }}>
                <div style={{ width:40, height:40, border:'3px solid #E5E7EB', borderTop:'3px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} />
              </div>
            ) : !blog ? (
              <div style={{ textAlign:'center', padding:80, color:'#9CA3AF' }}><p>Blog not found.</p></div>
            ) : (
              <article>
                {blog.image_url && (
                  <img src={blog.image_url} alt={blog.title} style={{ width:'100%', height:400, objectFit:'cover', borderRadius:20, marginBottom:36, boxShadow:'0 8px 32px rgba(0,0,0,0.10)' }} />
                )}
                <div style={{ display:'flex', gap:20, marginBottom:20, flexWrap:'wrap' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6, color:'#9CA3AF', fontSize:'0.84rem' }}>
                    <User size={13} style={{ color:'#4F46E5' }} /> {blog.author || 'VSpark Team'}
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:6, color:'#9CA3AF', fontSize:'0.84rem' }}>
                    <Calendar size={13} style={{ color:'#4F46E5' }} /> {DATE_FORMAT.format(new Date(blog.created_at))}
                  </span>
                </div>
                <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.75rem, 4vw, 2.5rem)', fontWeight:900, letterSpacing:'-0.03em', color:'#0F172A', marginBottom:28, lineHeight:1.15 }}>{blog.title}</h1>
                <div style={{ color:'#374151', lineHeight:1.85, fontSize:'1.0625rem', whiteSpace:'pre-wrap' }}>{blog.content}</div>
              </article>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
