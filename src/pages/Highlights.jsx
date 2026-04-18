import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  { id:'h1', image_url:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', description:'VSpark 2024 Opening Ceremony' },
  { id:'h2', image_url:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', description:'Speed Programming Competition' },
  { id:'h3', image_url:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600', description:'Web Development Challenge' },
  { id:'h4', image_url:'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600', description:'E-Gaming Tournament Finals' },
  { id:'h5', image_url:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600', description:'Award Ceremony & Prize Distribution' },
  { id:'h6', image_url:'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600', description:'Team Networking Session' },
];

export default function Highlights() {
  const [highlights,    setHighlights]    = useState([]);
  const [results,       setResults]       = useState([]);
  const [competitions,  setCompetitions]  = useState({});
  const [loading,       setLoading]       = useState(true);
  const [selected,      setSelected]      = useState(null);
  const [activeTab,     setActiveTab]     = useState('highlights');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: hData } = await supabase.from('highlights').select('*').order('created_at',{ ascending:false });
        setHighlights(hData?.length ? hData : FALLBACK);

        const { data: comps } = await supabase.from('competitions').select('id,title,color').eq('is_active',true);
        const lookup = {}; comps?.forEach(c => { lookup[c.id] = c; }); setCompetitions(lookup);

        const { data: rData } = await supabase.from('competition_results').select('*').eq('is_published',true).order('announced_at',{ ascending:false });
        setResults(rData||[]);
      } catch { setHighlights(FALLBACK); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Header */}
        <section className="pt-40 pb-16 px-6 text-center bg-gradient-to-b from-primary-50 to-transparent">
          <span className="badge-premium mb-6">Gallery & Results</span>
          <h1 className="font-sora font-black text-5xl md:text-6xl text-gray-900 mb-6">Event Highlights</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Relive the best moments from past VSpark events — the energy, competition, and champions.
          </p>
        </section>

        {/* Tabs */}
        <section className="px-6 mb-12">
          <div className="max-w-md mx-auto bg-gray-100 p-1.5 rounded-2xl flex relative shadow-inner">
            <div className="flex-1 relative z-10 flex text-center">
              <button 
                onClick={() => setActiveTab('highlights')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sora font-bold text-sm transition-all duration-300 ${
                  activeTab === 'highlights' ? 'text-primary-600 bg-white shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ImageIcon size={16} /> Photos & Gallery
              </button>
              <button 
                onClick={() => setActiveTab('results')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sora font-bold text-sm transition-all duration-300 ${
                  activeTab === 'results' ? 'text-yellow-600 bg-white shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Trophy size={16} /> Results
              </button>
            </div>
          </div>
        </section>

        {/* GALLERY TAB */}
        {activeTab === 'highlights' && (
          <section className="px-6 max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin"></div>
              </div>
            ) : highlights.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium font-sora">No highlights yet. Come back after the event!</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {highlights.map((h, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={h.id}
                    className="break-inside-avoid relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-glow cursor-zoom-in group"
                    onClick={() => setSelected(h)}
                  >
                    <img 
                      src={h.image_url} 
                      alt={h.description} 
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {h.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                        <p className="text-white text-sm font-medium leading-tight">
                          {h.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <section className="px-6 max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-yellow-500 animate-spin"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium font-sora">No results announced yet. Check back soon!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {results.map((result, i) => {
                  const comp = competitions[result.competition_id];
                  // using a fallback primary color
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      key={result.id} 
                      className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div className="bg-gradient-to-br from-gray-50 to-white px-8 py-6 border-b border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="font-sora font-black text-2xl text-gray-900 mb-2">
                            {comp?.title || `Competition #${result.competition_id}`}
                          </h2>
                          {result.announced_at && (
                            <p className="text-gray-500 text-sm font-medium">
                              Announced on {new Date(result.announced_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center border border-yellow-200 shrink-0">
                          <Trophy size={28} />
                        </div>
                      </div>

                      <div className="px-8 pb-8">
                        <div className={`grid grid-cols-1 ${result.third_place ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-6`}>
                          {[
                            { place:'1st', emoji:'🥇', color:'text-yellow-600', bg:'bg-yellow-50', border:'border-yellow-200', name:result.first_place, info:result.first_place_info },
                            result.second_place && { place:'2nd', emoji:'🥈', color:'text-gray-600', bg:'bg-gray-50', border:'border-gray-200', name:result.second_place, info:result.second_place_info },
                            result.third_place  && { place:'3rd', emoji:'🥉', color:'text-orange-600', bg:'bg-orange-50', border:'border-orange-200', name:result.third_place,  info:result.third_place_info },
                          ].filter(Boolean).map((p, idx) => (
                            <div key={p.place} className={`${p.bg} border ${p.border} rounded-2xl p-6 text-center transform transition-transform hover:-translate-y-1`}>
                              <div className="text-4xl mb-4">{p.emoji}</div>
                              <div className={`${p.color} font-bold text-[10px] tracking-widest uppercase mb-3`}>{p.place} Place</div>
                              <p className="font-sora font-bold text-xl text-gray-900 mb-2">{p.name || '—'}</p>
                              {p.info && <p className="text-sm text-gray-600 font-medium">{p.info}</p>}
                            </div>
                          ))}
                        </div>
                        {result.result_description && (
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                              {result.result_description}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} 
              className="relative max-w-5xl w-full"
            >
              <button 
                onClick={() => setSelected(null)} 
                className="absolute -top-12 right-0 md:-right-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              <img 
                src={selected.image_url || selected.result_image_url} 
                alt={selected.description} 
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" 
              />
              {(selected.description || selected.result_description) && (
                <div className="text-center mt-6 text-white text-lg font-medium">
                  {selected.description || selected.result_description}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
