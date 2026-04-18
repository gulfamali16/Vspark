import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin as LinkedinIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from('blogs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setBlog(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium font-sora">Loading Article...</p>
      </div>
      <Footer />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-sora font-black text-2xl text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs" className="btn-primary">
          <ArrowLeft size={18} /> Back to Blogs
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary-500 z-[100] origin-left"
        initial={{ scaleX: 0 }}
        style={{ scaleX: 0 }} // This would normally be handled by a useScroll hook, for now keeping it static or simple
      />

      <article className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/blogs" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-sm group transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={16} />
              </div>
              Back to News Feed
            </Link>
          </motion.div>

          {/* Header Metadata */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 text-center md:text-left"
          >
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                Latest Update
              </span>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                <Calendar size={14} className="text-primary-400" />
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium border-l border-gray-200 pl-4 hidden sm:flex">
                <Clock size={14} className="text-primary-400" />
                {Math.ceil((blog.content?.length || 0) / 1000)} min read
              </div>
            </div>

            <h1 className="font-sora font-black text-3xl md:text-5xl lg:text-6xl text-gray-900 leading-[1.1] mb-8">
              {blog.title}
            </h1>

            {/* Author / Social mini bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-t border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-blue-400 flex items-center justify-center text-white font-black">
                  V
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">VSpark Editorial</p>
                  <p className="text-gray-400 text-xs">Innovation & Tech Team</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mr-2">Share</p>
                {[Facebook, Twitter, LinkedinIcon].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-200 hover:bg-white hover:shadow-sm transition-all">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          {blog.image_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/5 relative group"
            >
              <img 
                src={blog.image_url} 
                alt={blog.title} 
                className="w-full h-auto object-cover max-h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-body"
          >
            {blog.content.split('\n').map((para, i) => {
              if (!para.trim()) return null;
              return (
                <p key={i} className="mb-6 text-lg md:text-xl leading-relaxed">
                  {para}
                </p>
              );
            })}
          </motion.div>

          {/* Footer of article */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">#VSpark2024</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">#Innovation</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">#CSDepartment</span>
            </div>

            <button className="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
              <Share2 size={18} /> Share this story
            </button>
          </motion.div>
        </div>
      </article>

      {/* Recommended Section (Static placeholder logic) */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-sora font-black text-3xl text-gray-900 mb-12">More Stories You Might Like</h2>
          <div className="flex flex-col items-center">
            <Link to="/blogs" className="btn-outline px-10">
              Explore All News
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
