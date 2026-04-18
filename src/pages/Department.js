import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, BookOpen, Users, Trophy, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 text-center bg-gradient-to-b from-primary-50 to-transparent">
        <span className="badge-premium mb-6">COMSATS University Islamabad · Vehari Campus</span>
        <h1 className="font-sora font-black text-5xl md:text-6xl text-gray-900 mb-3">Computer Science</h1>
        <h2 className="font-sora font-bold text-3xl text-primary-600 mb-6">Department</h2>
        <p className="text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
          Shaping the next generation of technology leaders through world-class education, research, and innovation.
        </p>
      </section>

      {/* HOD Card */}
      {hod && (
        <section className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-yellow-200 shadow-sm p-8 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden"
            >
              {/* Gold accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400 rounded-l-3xl" />
              
              <div className="sm:pl-4 flex-shrink-0">
                {hod.image_url ? (
                  <img src={hod.image_url} alt={hod.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-yellow-200 shadow-md" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-yellow-50 border-4 border-yellow-200 flex items-center justify-center shadow-md">
                    <Star size={40} className="text-yellow-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3">
                  Head of Department
                </span>
                <h2 className="font-sora font-black text-2xl text-gray-900 mb-1">{hod.name}</h2>
                <p className="text-primary-600 font-semibold mb-3">{hod.designation} — {hod.specialization}</p>
                {hod.bio && <p className="text-gray-600 leading-relaxed text-sm mb-4">{hod.bio}</p>}
                <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                  {hod.github_url && (
                    <a href={hod.github_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                      <Github size={16} /> GitHub
                    </a>
                  )}
                  {hod.linkedin_url && (
                    <a href={hod.linkedin_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
                      <Linkedin size={16} /> LinkedIn
                    </a>
                  )}
                  {hod.email && (
                    <a href={`mailto:${hod.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
                      <Mail size={16} /> {hod.email}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tabs + Content */}
      <section className="px-6 pb-32 flex-1">
        <div className="max-w-5xl mx-auto">
          {/* Tab Bar */}
          <div className="flex gap-0 border-b border-gray-200 mb-10 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-8 py-4 font-sora font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
                  tab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={16} /> {label}
                {id === 'achievements' && achievements.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded-full">
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
                <p className="text-gray-500 text-sm font-medium">Loading faculty...</p>
              ) : regularFaculty.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Users size={40} className="mx-auto mb-4 opacity-40" />
                  <p className="font-medium">Faculty details coming soon.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularFaculty.map((f, i) => (
                    <motion.div key={f.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {f.image_url ? (
                          <img src={f.image_url} alt={f.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary-100 flex-shrink-0"
                            onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center flex-shrink-0">
                            <Users size={24} className="text-primary-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-sora font-bold text-gray-900">{f.name}</h3>
                          <p className="text-primary-600 text-sm font-medium">{f.designation}</p>
                          <p className="text-gray-500 text-xs">{f.specialization}</p>
                        </div>
                      </div>
                      {f.bio && <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.bio}</p>}
                      <div className="flex gap-4 flex-wrap pt-4 border-t border-gray-100">
                        {f.github_url && (
                          <a href={f.github_url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">
                            <Github size={13} /> GitHub
                          </a>
                        )}
                        {f.linkedin_url && (
                          <a href={f.linkedin_url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 font-medium transition-colors">
                            <Linkedin size={13} /> LinkedIn
                          </a>
                        )}
                        {f.email && (
                          <a href={`mailto:${f.email}`}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 font-medium transition-colors">
                            <Mail size={13} /> Email
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROGRAMS TAB */}
          {tab === 'programs' && (
            <div className="space-y-5">
              {loading ? (
                <p className="text-gray-500 text-sm font-medium">Loading programs...</p>
              ) : programs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
                  <p className="font-medium">Program details coming soon.</p>
                </div>
              ) : programs.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 relative overflow-hidden hover:shadow-soft transition-all"
                >
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-primary-500 rounded-l-2xl" />
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-4">
                    <div>
                      <h3 className="font-sora font-black text-2xl text-gray-900 mb-3">{p.title}</h3>
                      <div className="flex gap-3 flex-wrap">
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-bold">{p.degree}</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">{p.duration}</span>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full text-xs font-bold">{p.total_seats} Seats</span>
                      </div>
                    </div>
                    <Link to="/register" className="btn-primary text-sm whitespace-nowrap">
                      Apply Now
                    </Link>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{p.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {tab === 'achievements' && (
            <div>
              {achievements.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">Achievements coming soon.</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Celebrating the milestones and victories of the COMSATS CS Department community.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {achievements.map((blog, i) => (
                      <motion.div key={blog.id}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <Link to={`/blogs/${blog.id}`} className="block group">
                          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-soft hover:-translate-y-1 transition-all relative overflow-hidden">
                            <div className="absolute left-0 top-0 w-1.5 h-full bg-yellow-400 rounded-l-2xl" />
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
                                <Trophy size={18} className="text-yellow-500" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-sora font-bold text-gray-900 text-sm leading-snug mb-3 group-hover:text-primary-700 transition-colors">
                                  {blog.title}
                                </h3>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-400 font-medium">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                  <span className="text-xs text-primary-600 font-bold flex items-center gap-1">
                                    Read more <ChevronRight size={13} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
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