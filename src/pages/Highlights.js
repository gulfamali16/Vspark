import React, { useEffect, useState } from 'react'
import { Image as ImageIcon, X, Trophy, Award, ZoomIn, ZoomOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const fallbackHighlights = [
  { id: 'h1', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', description: 'VSpark 2024 Opening Ceremony' },
  { id: 'h2', image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', description: 'Speed Programming Competition' },
  { id: 'h3', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600', description: 'Web Development Challenge' },
  { id: 'h4', image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600', description: 'E-Gaming Tournament Finals' },
  { id: 'h5', image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600', description: 'Award Ceremony & Prize Distribution' },
  { id: 'h6', image_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600', description: 'Team Networking Session' },
]

const PLACE_CONFIG = [
  { key: 'first',  emoji: '🥇', label: '1st Place', gold: true,   ring: 'ring-yellow-400',  bg: 'bg-yellow-50',  text: 'text-yellow-700',  info: '#D97706' },
  { key: 'second', emoji: '🥈', label: '2nd Place', silver: true, ring: 'ring-gray-300',    bg: 'bg-gray-50',    text: 'text-gray-600',    info: '#6B7280' },
  { key: 'third',  emoji: '🥉', label: '3rd Place', bronze: true, ring: 'ring-orange-300',  bg: 'bg-orange-50',  text: 'text-orange-700',  info: '#C2410C' },
]

export default function Highlights() {
  const [highlights, setHighlights] = useState([])
  const [results, setResults] = useState([])
  const [competitions, setCompetitions] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('highlights')
  const [isZoomed, setIsZoomed] = useState(false)

  // Reset zoom when modal closes
  useEffect(() => { if (!selected) setIsZoomed(false); }, [selected])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const { data: highlightsData } = await supabase
          .from('highlights').select('*').order('created_at', { ascending: false })
        setHighlights(highlightsData?.length ? highlightsData : fallbackHighlights)

        const { data: compsData } = await supabase
          .from('competitions').select('id, title, color').eq('is_active', true)
        const compsLookup = {}
        compsData?.forEach(c => { compsLookup[c.id] = c })
        setCompetitions(compsLookup)

        const { data: resultsData } = await supabase
          .from('competition_results').select('*').eq('is_published', true)
          .order('announced_at', { ascending: false })
        setResults(resultsData || [])
      } catch (err) {
        console.error('Error loading highlights:', err)
        setHighlights(fallbackHighlights)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const tabs = [
    { id: 'highlights', label: 'Photos & Gallery', icon: ImageIcon },
    { id: 'results',    label: 'Competition Results', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center px-4 bg-gradient-to-b from-primary-50/60 to-transparent">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="section-tag">Gallery &amp; Results</span>
          <h1 className="font-sora font-black text-4xl md:text-5xl text-gray-900 mt-4 mb-4 leading-tight">
            Event <span className="text-gradient">Highlights &amp; Results</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Relive the best moments from past VSpark events — the energy, the competition, the winners.
          </p>
        </motion.div>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex gap-2 justify-center flex-wrap">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-sora font-bold text-sm transition-all duration-300 ${
                activeTab === id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── HIGHLIGHTS TAB ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'highlights' && (
          <motion.section key="highlights" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className="max-w-6xl mx-auto px-4 pb-24">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
              </div>
            ) : highlights.length === 0 ? (
              <div className="text-center py-24">
                <ImageIcon size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No highlights yet. Come back after the event!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {highlights.map((h, i) => (
                  <motion.div key={h.id}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(h)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <img src={h.image_url} alt={h.description || 'Event highlight'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/40 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {h.description && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-medium truncate">{h.description}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ── RESULTS TAB ── */}
        {activeTab === 'results' && (
          <motion.section key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className="max-w-5xl mx-auto px-4 pb-24">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-24">
                <Trophy size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No results announced yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.map((result, i) => {
                  const comp = competitions[result.competition_id]
                  return (
                    <motion.div key={result.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      {/* Card header */}
                      <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3"
                        style={{ borderLeftWidth: 4, borderLeftColor: comp?.color || '#4F46E5', borderLeftStyle: 'solid' }}>
                        <div>
                          <h2 className="font-sora font-black text-xl text-gray-900">
                            {comp?.title || `Competition #${result.competition_id}`}
                          </h2>
                          <div className="flex gap-4 mt-1 text-sm text-gray-400 flex-wrap">
                            {result.announced_at && (
                              <span>🏆 {new Date(result.announced_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            )}
                            {result.cash_prize && <span className="font-semibold text-emerald-600">💰 {result.cash_prize}</span>}
                          </div>
                        </div>
                        <Award size={28} className="text-gray-200" />
                      </div>

                      <div className="p-7">
                        {/* Podium */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-6">
                          {PLACE_CONFIG.map(({ key, emoji, label, bg, text, ring }) => {
                            const name = result[`${key}_place`]
                            const uni  = result[`${key}_university`]
                            const info = result[`${key}_place_info`]
                            if (!name) return null
                            return (
                              <div key={key} className={`${bg} rounded-2xl p-5 text-center border-2 ${ring.replace('ring-', 'border-')} shadow-sm`}>
                                <div className="text-4xl mb-2">{emoji}</div>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${text} mb-3`}>{label}</p>
                                <p className="font-sora font-bold text-gray-900 text-base leading-tight">{name}</p>
                                {uni && <p className="text-gray-400 text-xs mt-1">{uni}</p>}
                                {info && <p className="text-gray-400 text-xs mt-0.5 italic">{info}</p>}
                              </div>
                            )
                          })}
                        </div>

                        {/* Result image */}
                        {result.result_image_url && (
                          <div className="mb-5 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
                            onClick={() => setSelected(result)}>
                            <img src={result.result_image_url} alt="Result"
                              className="w-full max-h-72 object-cover hover:scale-102 transition-transform duration-300" />
                          </div>
                        )}

                        {/* Description */}
                        {result.result_description && (
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{result.result_description}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Immersive Split-View Lightbox ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/98 backdrop-blur-2xl z-[9999] flex flex-col lg:flex-row overflow-hidden"
          >
            {/* ── Left: Image Viewer ── */}
            <div className="flex-1 relative flex items-center justify-center bg-black/20 overflow-hidden">
               {/* Image Container with Inner Zoom */}
               <div 
                 className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                 onClick={() => setIsZoomed(!isZoomed)}
               >
                  <motion.img 
                    src={selected.image_url || selected.result_image_url} 
                    alt="Gallery View"
                    animate={{ 
                      scale: isZoomed ? 1.8 : 1,
                      x: isZoomed ? 0 : 0, // In a real pan we'd add drag, but scale is what they asked for
                      y: isZoomed ? 0 : 0 
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
               </div>

               {/* Zoom Indicator/Toggle */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all shadow-2xl"
                  >
                    {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{isZoomed ? 'Fit Screen' : 'Zoom In'}</span>
                  </button>
               </div>
            </div>

            {/* ── Right: Info Sidebar ── */}
            <motion.div 
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="w-full lg:w-[450px] bg-white h-full flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
            >
               {/* Sidebar Header */}
               <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <button 
                    onClick={() => setSelected(null)}
                    className="group flex items-center gap-3 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                       <X size={20} />
                    </div>
                    <span className="font-sora font-bold text-sm">Back to Gallery</span>
                  </button>
                  
                  <a 
                    href={selected.image_url || selected.result_image_url} 
                    download 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                     <ImageIcon size={18} />
                  </a>
               </div>

               {/* Sidebar Content */}
               <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  <span className="badge-premium mb-6">Gallery Detail</span>
                  <h2 className="font-sora font-black text-3xl text-gray-900 mb-8 leading-tight">
                    {activeTab === 'results' ? 'Competition Winning Moment' : 'Event Highlight'}
                  </h2>

                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Description</p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                           {selected.description || selected.result_description || "An incredible moment captured at VSpark 2025, showcasing the talent and innovation of Pakistan's youth."}
                        </p>
                     </div>

                     {activeTab === 'results' && (
                        <div className="pt-8 border-t border-gray-100">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Related Competition</p>
                           <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                             <Trophy className="text-primary-500 mb-3" size={24} />
                             <p className="font-sora font-bold text-primary-700">Check full standings in the Results tab for more details.</p>
                           </div>
                        </div>
                     )}
                     
                     <div className="pt-8 border-t border-gray-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Location</p>
                        <p className="text-gray-500 text-sm font-medium">COMSATS University Islamabad, Vehari Campus</p>
                     </div>
                  </div>
               </div>

               {/* Sidebar Footer */}
               <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                  <button 
                    onClick={() => setSelected(null)}
                    className="btn-primary w-full justify-center"
                  >
                    Back to Highlights
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
