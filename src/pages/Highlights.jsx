import React, { useEffect, useState } from 'react'
import { Image as ImageIcon, X, Trophy, Award } from 'lucide-react'
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

export default function Highlights() {
  const [highlights, setHighlights] = useState([])
  const [results, setResults] = useState([])
  const [competitions, setCompetitions] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('highlights') // 'highlights' or 'results'

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load highlights
        const { data: highlightsData } = await supabase
          .from('highlights')
          .select('*')
          .order('created_at', { ascending: false })

        setHighlights(highlightsData?.length ? highlightsData : fallbackHighlights)

        // Load competitions for reference
        const { data: compsData } = await supabase
          .from('competitions')
          .select('id, title, color')
          .eq('is_active', true)

        const compsLookup = {}
        compsData?.forEach(c => { compsLookup[c.id] = c })
        setCompetitions(compsLookup)

        // Load published results
        const { data: resultsData, error: resultsError } = await supabase
          .from('competition_results')
          .select('*')
          .eq('is_published', true)
          .order('announced_at', { ascending: false })

        console.log('Results loaded:', resultsData, 'Error:', resultsError)
        setResults(resultsData || [])
        setLoading(false)
      } catch (err) {
        console.error('Error loading highlights:', err)
        setHighlights(fallbackHighlights)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <section style={{ padding: '60px 0 40px', textAlign: 'center' }}>
          <div className="container">
            <div className="badge" style={{ marginBottom: 24 }}>Gallery & Results</div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              Event <span className="gradient-text">Highlights & Results</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              Relive the best moments from past VSpark events — the energy, the competition, the winners.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section style={{ padding: '20px 0 40px' }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('highlights')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'highlights' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: activeTab === 'highlights' ? '2px solid rgba(0,212,255,0.4)' : '1px solid rgba(0,212,255,0.15)',
                  color: activeTab === 'highlights' ? '#00d4ff' : '#8892b0',
                  cursor: 'pointer',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ImageIcon size={16} /> Photos & Gallery
              </button>
              <button
                onClick={() => setActiveTab('results')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'results' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: activeTab === 'results' ? '2px solid rgba(255,215,0,0.4)' : '1px solid rgba(0,212,255,0.15)',
                  color: activeTab === 'results' ? '#ffd700' : '#8892b0',
                  cursor: 'pointer',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Trophy size={16} /> Competition Results
              </button>
            </div>
          </div>
        </section>

        {/* ── HIGHLIGHTS TAB ── */}
        {activeTab === 'highlights' && (
          <section style={{ padding: '0 0 100px' }}>
            <div className="container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                  <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : highlights.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                  <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                  <p>No highlights yet. Come back after the event!</p>
                </div>
              ) : (
                <div style={{ columns: '3 300px', gap: 16 }}>
                  {highlights.map((h) => (
                    <div key={h.id} style={{ breakInside: 'avoid', marginBottom: 16, cursor: 'pointer', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.3s' }}
                      onClick={() => setSelected(h)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; e.currentTarget.style.boxShadow = 'var(--glow)'; e.currentTarget.style.transform = 'scale(1.02)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      <img src={h.image_url} alt={h.description} style={{ width: '100%', display: 'block' }} />
                      {h.description && (
                        <div style={{ padding: '12px 16px', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {h.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── RESULTS TAB ── */}
        {activeTab === 'results' && (
          <section style={{ padding: '0 0 100px' }}>
            <div className="container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                  <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                  <Trophy size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                  <p>No results announced yet. Check back soon!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '2rem' }}>
                  {results.map((result) => {
                    const comp = competitions[result.competition_id]
                    const borderColor = comp?.color || '#00d4ff'
                    return (
                      <div key={result.id} style={{
                        padding: '2rem',
                        background: 'rgba(255,215,0,0.03)',
                        border: `2px solid ${borderColor}40`,
                        borderRadius: 12,
                        borderLeft: `5px solid ${borderColor}`,
                      }}>
                        {/* Header */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h2 style={{
                            fontSize: '1.6rem',
                            fontWeight: 700,
                            color: '#e8eaf6',
                            marginBottom: 4,
                            fontFamily: 'Bebas Neue',
                            letterSpacing: 1,
                          }}>
                            {comp?.title || `Competition #${result.competition_id}`}
                          </h2>
                          {result.announced_at && (
                            <p style={{ color: '#8892b0', fontSize: '0.85rem' }}>
                              🏆 Results announced on {new Date(result.announced_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Winners Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '1.5rem',
                          marginBottom: '1.5rem',
                        }}>
                          {/* 1st Place */}
                          <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                            border: '2px solid rgba(255,215,0,0.3)',
                            borderRadius: 10,
                            textAlign: 'center',
                          }}>
                            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🥇</div>
                            <div style={{ color: '#ffd700', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, marginBottom: 4 }}>
                              1ST PLACE
                            </div>
                            <p style={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: '#e8eaf6',
                              marginBottom: 8,
                            }}>
                              {result.first_place || '—'}
                            </p>
                            {result.first_place_info && (
                              <p style={{ fontSize: '0.82rem', color: '#8892b0' }}>
                                {result.first_place_info}
                              </p>
                            )}
                          </div>

                          {/* 2nd Place */}
                          {result.second_place && (
                            <div style={{
                              padding: '1.5rem',
                              background: 'linear-gradient(135deg, rgba(192,192,192,0.1), rgba(192,192,192,0.03))',
                              border: '2px solid rgba(192,192,192,0.25)',
                              borderRadius: 10,
                              textAlign: 'center',
                            }}>
                              <div style={{ fontSize: '3rem', marginBottom: 8 }}>🥈</div>
                              <div style={{ color: '#c0c0c0', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, marginBottom: 4 }}>
                                2ND PLACE
                              </div>
                              <p style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#e8eaf6',
                                marginBottom: 8,
                              }}>
                                {result.second_place}
                              </p>
                              {result.second_place_info && (
                                <p style={{ fontSize: '0.82rem', color: '#8892b0' }}>
                                  {result.second_place_info}
                                </p>
                              )}
                            </div>
                          )}

                          {/* 3rd Place */}
                          {result.third_place && (
                            <div style={{
                              padding: '1.5rem',
                              background: 'linear-gradient(135deg, rgba(205,127,50,0.1), rgba(205,127,50,0.03))',
                              border: '2px solid rgba(205,127,50,0.25)',
                              borderRadius: 10,
                              textAlign: 'center',
                            }}>
                              <div style={{ fontSize: '3rem', marginBottom: 8 }}>🥉</div>
                              <div style={{ color: '#cd7f32', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, marginBottom: 4 }}>
                                3RD PLACE
                              </div>
                              <p style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#e8eaf6',
                                marginBottom: 8,
                              }}>
                                {result.third_place}
                              </p>
                              {result.third_place_info && (
                                <p style={{ fontSize: '0.82rem', color: '#8892b0' }}>
                                  {result.third_place_info}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Result Image */}
                        {result.result_image_url && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <img
                              src={result.result_image_url}
                              alt="Result"
                              style={{
                                width: '100%',
                                maxHeight: 300,
                                objectFit: 'cover',
                                borderRadius: 10,
                                border: '1px solid rgba(0,212,255,0.2)',
                                cursor: 'pointer',
                              }}
                              onClick={() => setSelected(result)}
                            />
                          </div>
                        )}

                        {/* Description */}
                        {result.result_description && (
                          <div style={{
                            padding: '1rem',
                            background: 'rgba(0,212,255,0.05)',
                            border: '1px solid rgba(0,212,255,0.15)',
                            borderRadius: 8,
                            lineHeight: 1.6,
                          }}>
                            <p style={{ color: '#e8eaf6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                              {result.result_description}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={selected.image_url || selected.result_image_url} alt={selected.description} style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }} />
            {(selected.description || selected.result_description) && (
              <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--text-muted)' }}>
                {selected.description || selected.result_description}
              </div>
            )}
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: -16, right: -16, width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
