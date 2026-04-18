import React, { useState, useEffect } from 'react';
import { Clock, Trophy, ChevronDown, ChevronUp, Megaphone, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Competitions() {
  const [comps, setComps] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('competitions').select('*').eq('is_active', true).order('title')
      .then(({ data }) => {
        setComps(data || []);
        setLoading(false);
      });
  }, []);

  // Navigate to register with this competition pre-selected
  const handleRegister = (e, comp) => {
    e.stopPropagation();
    navigate(`/register?comp=${comp.id}&compName=${encodeURIComponent(comp.title)}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading competitions...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="pt-40 pb-20 px-6 text-center bg-gradient-to-b from-primary-50 to-transparent">
        <span className="badge-premium mb-6">All Competitions</span>
        <h1 className="font-sora font-black text-5xl md:text-6xl text-gray-900 mb-6">Competitions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
          {comps.length} competition{comps.length !== 1 ? 's' : ''} — each with prizes, registration fees, and internship opportunities.
          You can register for multiple competitions.
        </p>
      </section>

      {/* ── COMPETITIONS LIST ── */}
      <section className="px-6 pb-32 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {comps.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
              Competitions will be announced soon. Check back later!
            </div>
          )}
          {comps.map(comp => {
            const isOpen = expanded === comp.id;

            return (
              <motion.div
                key={comp.id}
                layout
                onClick={() => setExpanded(isOpen ? null : comp.id)}
                className={`bg-white p-8 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${isOpen ? 'border-primary-300 shadow-glow ring-1 ring-primary-100' : 'border-gray-200 shadow-sm hover:shadow-soft hover:-translate-y-1 hover:border-primary-200'
                  }`}
              >
                <motion.div layout className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                      {comp.category}
                    </span>
                    <h3 className="font-sora font-bold text-2xl text-gray-900 leading-tight">
                      {comp.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {comp.is_new && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200">
                        NEW
                      </span>
                    )}
                    {isOpen ? <ChevronUp className="w-5 h-5 text-primary-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </motion.div>

                <motion.p layout className="text-gray-600 mb-6 leading-relaxed">
                  {comp.short_desc}
                </motion.p>

                {/* Fee */}
                <motion.div layout className="flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <span className="text-gray-600 font-medium text-sm">Registration Fee</span>
                  <span className="font-bold text-lg text-gray-900">
                    PKR {comp.fee?.toLocaleString()}
                  </span>
                </motion.div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-100 overflow-hidden"
                    >
                      {/* Date announcement */}
                      <div className={`p-4 rounded-lg border mb-6 flex items-center gap-3 ${comp.date_announced ? 'bg-primary-50 border-primary-100 text-primary-700' : 'bg-orange-50 border-orange-100 text-orange-700'
                        }`}>
                        {comp.date_announced ? <Calendar className="w-5 h-5 flex-shrink-0" /> : <Megaphone className="w-5 h-5 flex-shrink-0" />}
                        <span className="text-sm font-medium">
                          {comp.date_announced && comp.event_date
                            ? `📅 ${new Date(comp.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                            : '⏳ Date & time to be announced — stay tuned'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Rules */}
                        {comp.rules && (
                          <div>
                            <h4 className="flex items-center gap-2 font-sora font-bold text-gray-900 mb-3 text-sm tracking-wider uppercase">
                              <Clock className="w-4 h-4 text-primary-500" /> Rules
                            </h4>
                            <ul className="space-y-2">
                              {comp.rules.split('\n').filter(Boolean).map((r, ri) => (
                                <li key={ri} className="flex items-start text-sm text-gray-600">
                                  <span className="mr-2 text-primary-400 font-bold">•</span>
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Prizes */}
                        {comp.prizes && (
                          <div>
                            <h4 className="flex items-center gap-2 font-sora font-bold text-gray-900 mb-3 text-sm tracking-wider uppercase">
                              <Trophy className="w-4 h-4 text-yellow-500" /> Prizes
                            </h4>
                            <ul className="space-y-3">
                              {comp.prizes.split('\n').filter(Boolean).map((p, pi) => (
                                <li key={pi} className="flex items-center gap-3 text-sm font-medium text-gray-800 bg-white border border-gray-100 shadow-sm rounded-lg p-3">
                                  <span className="text-xl">{pi === 0 ? '🥇' : pi === 1 ? '🥈' : '🥉'}</span>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Register button */}
                      <button
                        onClick={(e) => handleRegister(e, comp)}
                        className="btn-primary w-full shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                      >
                        Register for PKR {comp.fee?.toLocaleString()}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}