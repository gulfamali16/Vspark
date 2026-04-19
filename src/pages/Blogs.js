import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, ArrowRight, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [achievementIds, setAchievementIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const achievements  = blogs.filter(b => achievementIds.includes(b.id));
  const regularBlogs  = blogs.filter(b => !achievementIds.includes(b.id));
  const displayBlogs  = filter === 'achievements' ? achievements : filter === 'posts' ? regularBlogs : blogs;

  const filterTabs = [
    { id: 'all',          label: `All`,           count: blogs.length },
    { id: 'achievements', label: 'Achievements',  count: achievements.length },
    { id: 'posts',        label: 'Blog Posts',    count: regularBlogs.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-primary-50/60 to-transparent">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="section-tag">News &amp; Updates</span>
          <h1 className="font-sora font-black text-3xl md:text-5xl text-gray-900 mt-4 mb-4 leading-tight">
            Blogs &amp; <span className="text-gradient">Achievements</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Latest news, department achievements, event updates, and stories from VSpark.
          </p>
        </motion.div>
      </section>

      {/* Achievements highlight strip */}
      {achievements.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-10">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 border-l-4 border-l-yellow-500 rounded-3xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy size={18} className="text-yellow-600" />
              </div>
              <h2 className="font-sora font-black text-yellow-900 text-lg">Department Achievements</h2>
              <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold">
                {achievements.length}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map(blog => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} className="no-underline">
                  <div className="flex items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-yellow-100 hover:border-yellow-300 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Trophy size={14} className="text-yellow-500 flex-shrink-0" />
                      <span className="font-sora font-semibold text-gray-800 text-sm truncate group-hover:text-yellow-700 transition-colors">
                        {blog.title}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-yellow-400 group-hover:text-yellow-600 flex-shrink-0 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter + Blog grid */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        {/* Filter tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
          {filterTabs.map(({ id, label, count }) => (
            <button key={id} onClick={() => setFilter(id)}
              className={`flex items-center gap-2 px-6 py-3.5 font-sora font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
                filter === id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                filter === id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
              }`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : displayBlogs.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No posts yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={filter}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayBlogs.map((blog, i) => {
                const isAchievement = achievementIds.includes(blog.id);
                const excerpt = blog.content?.replace(/<[^>]*>/g, '').slice(0, 120);
                return (
                  <motion.div key={blog.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/blogs/${blog.id}`} className="no-underline block group h-full">
                      <div className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${
                        isAchievement ? 'border-yellow-200 hover:border-yellow-300' : 'border-gray-100 hover:border-primary-200'
                      }`}>
                        {/* Image */}
                        {blog.image_url && (
                          <div className="h-48 overflow-hidden">
                            <img src={blog.image_url} alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={e => { e.target.parentElement.style.display = 'none'; }} />
                          </div>
                        )}

                        <div className="p-6 flex flex-col flex-1">
                          {/* Badge */}
                          {isAchievement && (
                            <div className="flex items-center gap-2 mb-3">
                              <Trophy size={12} className="text-yellow-500" />
                              <span className="text-yellow-600 text-[10px] font-black uppercase tracking-widest">Achievement</span>
                            </div>
                          )}

                          <h3 className="font-sora font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>

                          {excerpt && (
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                              {excerpt}…
                            </p>
                          )}

                          {/* Footer */}
                          <div className={`flex justify-between items-center pt-4 border-t mt-auto ${
                            isAchievement ? 'border-yellow-100' : 'border-gray-100'
                          }`}>
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <Calendar size={11} />
                              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <span className={`text-xs font-bold flex items-center gap-1 ${
                              isAchievement ? 'text-yellow-600' : 'text-primary-600'
                            }`}>
                              Read <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      <Footer />
    </div>
  );
}