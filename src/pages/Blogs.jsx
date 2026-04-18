import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const FALLBACK_BLOGS = [
  { id:'b1', title:'VSpark 2025: What to Expect This Year', content:'This year VSpark brings exciting new categories including Prompt Engineering. Get ready for the biggest CS event at COMSATS Vehari campus yet...', image_url:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', author:'VSpark Team', created_at:'2025-11-15T10:00:00' },
  { id:'b2', title:'How to Prepare for Speed Programming Competitions', content:'Speed programming is all about problem-solving under pressure. Practice data structures, learn common algorithms, and time your sessions...', image_url:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600', author:'CS Department', created_at:'2025-11-10T10:00:00' },
  { id:'b3', title:'COMSATS Vehari Wins 1st Place in E-Gaming', content:'Our students secured first position in E-Gaming at the Byte and Battle competition. Congratulations to all participants who represented our campus!', image_url:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600', author:'Student Affairs', created_at:'2025-10-28T10:00:00' },
  { id:'b4', title:'Introduction to Prompt Engineering: The New Frontier', content:'Prompt Engineering is the newest discipline in AI. VSpark 2025 is proud to introduce this as a new competition category...', image_url:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600', author:'AI Lab', created_at:'2025-10-20T10:00:00' },
];

const SHORT_DATE = new Intl.DateTimeFormat('en-PK', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Blogs() {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        setBlogs(data?.length ? data : FALLBACK_BLOGS);
      } catch { setBlogs(FALLBACK_BLOGS); }
      finally  { setLoading(false); }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 text-center bg-gradient-to-b from-primary-50 to-transparent">
        <span className="badge-premium mb-6">Blog & News</span>
        <h1 className="font-sora font-black text-5xl md:text-6xl text-gray-900 mb-6">News & Insights</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          CS department news, student articles, and tech updates from the VSpark team.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="px-6 pb-32 flex-1">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="font-medium">Loading articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center">
              <BookOpen size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-semibold font-sora">No blogs yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BlogCard({ blog, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/blogs/${blog.id}`} className="block group h-full">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
          {blog.image_url && (
            <div className="h-52 overflow-hidden flex-shrink-0">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-gray-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-primary-500" />
                {blog.author || 'VSpark Team'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-primary-500" />
                {SHORT_DATE.format(new Date(blog.created_at))}
              </span>
            </div>
            <h3 className="font-sora font-bold text-lg text-gray-900 mb-3 leading-snug group-hover:text-primary-700 transition-colors">
              {blog.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
              {blog.content?.substring(0, 140)}...
            </p>
            <span className="inline-flex items-center gap-2 text-primary-600 text-sm font-bold group-hover:gap-3 transition-all">
              Read more <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
