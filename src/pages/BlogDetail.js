import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    supabase.from('blogs').select('*').eq('id', id).single().then(({ data }) => setBlog(data));
  }, [id]);

  if (!blog) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <div style={{ color: '#8892b0', fontFamily: 'JetBrains Mono' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ padding: '10rem 2rem 6rem', maxWidth: 800, margin: '0 auto' }}>
        <Link to="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#00d4ff', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Blogs
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
          <Calendar size={14} style={{ color: '#00d4ff' }} />
          <span style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: 3, color: '#e8eaf6', lineHeight: 1.1, marginBottom: '2rem' }}>{blog.title}</h1>
        {blog.image_url && <img src={blog.image_url} alt="" style={{ width: '100%', marginBottom: '2rem', borderRadius: 2 }} />}
        <div style={{ color: '#8892b0', lineHeight: 1.9, fontSize: '1.05rem' }}>
          {blog.content.split('\n').map((para, i) => <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>)}
        </div>
      </section>
      <Footer />
    </div>
  );
}
