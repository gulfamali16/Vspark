import { useState, useEffect } from 'react'
import { Image, X, Trophy } from 'lucide-react'
import { getHighlights, getCompetitions, getResultsPublished } from '../lib/supabase'

const fallbackHighlights = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', description: 'VSpark 2024 Opening Ceremony' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', description: 'Speed Programming Competition' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', description: 'E-Gaming Tournament Finals' },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80', description: 'Prize Distribution Ceremony' },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', description: 'Web Development Workshop' },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', description: 'Team Collaboration Session' },
  { id: 7, image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', description: 'Panel Discussion with Industry Experts' },
  { id: 8, image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', description: 'Networking & Celebration' },
]

export default function Highlights() {
  const [highlights, setHighlights] = useState(fallbackHighlights)
  const [results, setResults] = useState([])
  const [competitions, setCompetitions] = useState({})
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [activeTab, setActiveTab] = useState('gallery')

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: highlightsData } = await getHighlights()
        if (highlightsData && highlightsData.length > 0) setHighlights(highlightsData)

        const { data: compsData } = await getCompetitions()
        const compsLookup = {}
        compsData?.forEach(c => { compsLookup[c.id] = c })
        setCompetitions(compsLookup)

        const { data: resultsData } = await getResultsPublished()
        if (resultsData) setResults(resultsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const openLightbox = (h) => setLightbox(h)
  const closeLightbox = () => setLightbox(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(170,136,255,0.05) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-subtitle" style={{ color: '#aa88ff' }}>Memories, Moments & Results</div>
          <h1 className="section-title"><span style={{ color: '#aa88ff' }}>Event</span> Highlights</h1>
          <div className="section-divider" style={{ background: 'linear-gradient(90deg, transparent, #aa88ff, transparent)', marginBottom: 16 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Relive the excitement of past VSpark events and discover the champions. Browse through moments of innovation, competition, and achievement.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('gallery')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'gallery' ? 'rgba(170,136,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'gallery' ? '2px solid rgba(170,136,255,0.4)' : '1px solid rgba(170,136,255,0.15)',
                color: activeTab === 'gallery' ? '#aa88ff' : '#8892b0',
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
              <Image size={16} /> Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab('results')}
              style={{
                padding: '10px 20px',
                background: activeTab === 'results' ? 'rgba(170,136,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'results' ? '2px solid rgba(170,136,255,0.4)' : '1px solid rgba(170,136,255,0.15)',
                color: activeTab === 'results' ? '#aa88ff' : '#8892b0',
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
              <Trophy size={16} /> Results & Winners
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <section className="section">
          <div className="container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 3 }}>Loading...</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}>
                {highlights.map((h, i) => (
                  <div
                    key={h.id}
                    onClick={() => openLightbox(h)}
                    style={{
                      position: 'relative', overflow: 'hidden',
                      cursor: 'pointer', aspectRatio: i % 5 === 0 ? '16/9' : '4/3',
                      gridColumn: i % 5 === 0 ? 'span 2' : 'span 1',
                      border: '1px solid var(--border)',
                      transition: 'all 0.4s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1.08)'
                      e.currentTarget.querySelector('.overlay').style.opacity = '1'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1)'
                      e.currentTarget.querySelector('.overlay').style.opacity = '0'
                    }}
                  >
                    <img
                      src={h.image_url}
                      alt={h.description}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(1.2)', transition: 'transform 0.5s ease' }}
                    />
                    <div className="overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.8) 100%)',
                      opacity: 0, transition: 'opacity 0.3s ease',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: 20,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Image size={14} color="#aa88ff" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#aa88ff', letterSpacing: 2, textTransform: 'uppercase' }}>View Full</span>
                      </div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{h.description}</p>
                    </div>
                    {/* Corner accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid #aa88ff', borderLeft: '2px solid #aa88ff' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid #aa88ff', borderRight: '2px solid #aa88ff' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <section className="section">
          <div className="container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 3 }}>Loading...</div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <Trophy size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                <p>No results announced yet. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '2rem' }}>
                {results.map((result) => {
                  const comp = competitions[result.competition_id]
                  return (
                    <div key={result.id} style={{
                      padding: '2rem',
                      background: 'rgba(170,136,255,0.05)',
                      border: '2px solid rgba(170,136,255,0.2)',
                      borderRadius: 12,
                      borderLeft: '5px solid #aa88ff',
                    }}>
                      {/* Header */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{
                          fontSize: '1.6rem',
                          fontWeight: 700,
                          color: '#e8eaf6',
                          marginBottom: 4,
                          fontFamily: 'var(--font-sans)',
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.5rem',
                      }}>
                        {/* 1st Place */}
                        <div style={{
                          padding: '1.5rem',
                          background: 'rgba(255,215,0,0.1)',
                          border: '2px solid rgba(255,215,0,0.3)',
                          borderRadius: 10,
                          textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🥇</div>
                          <div style={{ color: '#ffd700', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1.5, marginBottom: 8 }}>
                            1ST PLACE
                          </div>
                          <p style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#e8eaf6',
                            marginBottom: 8,
                          }}>
                            {result.first_place}
                          </p>
                          {result.first_place_info && (
                            <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>
                              {result.first_place_info}
                            </p>
                          )}
                        </div>

                        {/* 2nd Place */}
                        {result.second_place && (
                          <div style={{
                            padding: '1.5rem',
                            background: 'rgba(192,192,192,0.08)',
                            border: '2px solid rgba(192,192,192,0.2)',
                            borderRadius: 10,
                            textAlign: 'center',
                          }}>
                            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🥈</div>
                            <div style={{ color: '#c0c0c0', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1.5, marginBottom: 8 }}>
                              2ND PLACE
                            </div>
                            <p style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#e8eaf6',
                              marginBottom: 8,
                            }}>
                              {result.second_place}
                            </p>
                            {result.second_place_info && (
                              <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>
                                {result.second_place_info}
                              </p>
                            )}
                          </div>
                        )}

                        {/* 3rd Place */}
                        {result.third_place && (
                          <div style={{
                            padding: '1.5rem',
                            background: 'rgba(205,127,50,0.08)',
                            border: '2px solid rgba(205,127,50,0.2)',
                            borderRadius: 10,
                            textAlign: 'center',
                          }}>
                            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🥉</div>
                            <div style={{ color: '#cd7f32', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1.5, marginBottom: 8 }}>
                              3RD PLACE
                            </div>
                            <p style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#e8eaf6',
                              marginBottom: 8,
                            }}>
                              {result.third_place}
                            </p>
                            {result.third_place_info && (
                              <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>
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
                              border: '1px solid rgba(170,136,255,0.2)',
                              cursor: 'pointer',
                            }}
                            onClick={() => setLightbox(result)}
                          />
                        </div>
                      )}

                      {/* Description */}
                      {result.result_description && (
                        <div style={{
                          padding: '1rem',
                          background: 'rgba(170,136,255,0.08)',
                          border: '1px solid rgba(170,136,255,0.15)',
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

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <button
            onClick={closeLightbox}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', padding: 10, borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <img src={lightbox.image_url || lightbox.result_image_url} alt={lightbox.description || lightbox.result_description}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', border: '1px solid var(--border)' }} />
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: 2, textAlign: 'center' }}>
              {lightbox.description || lightbox.result_description}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          div[style*="gridColumn: span 2"] { grid-column: span 1 !important; }
        }
      `}</style>
    </main>
  )
}
