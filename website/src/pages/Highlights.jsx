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
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('gallery')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'gallery' ? 'rgba(170,136,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'gallery' ? '2px solid rgba(170,136,255,0.5)' : '1px solid rgba(170,136,255,0.2)',
                color: activeTab === 'gallery' ? '#aa88ff' : '#8892b0',
                cursor: 'pointer',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-sans)',
                letterSpacing: 0.5,
              }}
            >
              <Image size={16} /> Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab('results')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'results' ? 'rgba(170,136,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'results' ? '2px solid rgba(170,136,255,0.5)' : '1px solid rgba(170,136,255,0.2)',
                color: activeTab === 'results' ? '#aa88ff' : '#8892b0',
                cursor: 'pointer',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-sans)',
                letterSpacing: 0.5,
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                maxWidth: '1000px',
                margin: '0 auto',
              }}>
                {highlights.map((h, i) => (
                  <div
                    key={h.id}
                    onClick={() => openLightbox(h)}
                    style={{
                      position: 'relative', overflow: 'hidden',
                      cursor: 'pointer', aspectRatio: '4/3',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      transition: 'all 0.4s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1.08)'
                      e.currentTarget.style.borderColor = 'rgba(170,136,255,0.4)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(170,136,255,0.15)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <img
                      src={h.image_url}
                      alt="Event highlight"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                    {/* Corner accents */}
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
              <div style={{ display: 'grid', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                {results.map((result) => {
                  const comp = competitions[result.competition_id]
                  return (
                    <div key={result.id} style={{
                      padding: 'clamp(1.5rem, 4vw, 2rem)',
                      background: 'linear-gradient(135deg, rgba(170,136,255,0.08) 0%, rgba(170,136,255,0.03) 100%)',
                      border: '2px solid rgba(170,136,255,0.25)',
                      borderRadius: 'clamp(10px, 2vw, 16px)',
                      borderLeft: '5px solid #aa88ff',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(170,136,255,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(170,136,255,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(170,136,255,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      {/* Header */}
                      <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
                        <h2 style={{
                          fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
                          fontWeight: 700,
                          color: '#aa88ff',
                          marginBottom: 8,
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: 1,
                        }}>
                          {comp?.title || `Competition #${result.competition_id}`}
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.5rem, 2vw, 1rem)', color: '#8892b0', fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)' }}>
                          {result.announced_at && (
                            <span>🏆 Announced: {new Date(result.announced_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          )}
                          {result.cash_prize && (
                            <span>💰 Prize: {result.cash_prize}</span>
                          )}
                        </div>
                      </div>

                      {/* Winners Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 280px), 1fr))',
                        gap: 'clamp(1rem, 2vw, 1.5rem)',
                        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                      }}>
                        {/* 1st Place */}
                        <div style={{
                          padding: 'clamp(1rem, 3vw, 1.5rem)',
                          background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.06) 100%)',
                          border: '2px solid rgba(255,215,0,0.35)',
                          borderRadius: 'clamp(8px, 2vw, 12px)',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,215,0,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: 8 }}>🥇</div>
                          <div style={{ color: '#ffd700', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
                            1ST PLACE
                          </div>
                          <p style={{
                            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                            fontWeight: 600,
                            color: '#e8eaf6',
                            marginBottom: 8,
                          }}>
                            {result.first_place}
                          </p>
                          {result.first_university && (
                            <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#8892b0', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>
                              📚 {result.first_university}
                            </p>
                          )}
                          {result.first_place_info && (
                            <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#8892b0' }}>
                              {result.first_place_info}
                            </p>
                          )}
                        </div>

                        {/* 2nd Place */}
                        {result.second_place && (
                          <div style={{
                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                            background: 'linear-gradient(135deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.05) 100%)',
                            border: '2px solid rgba(192,192,192,0.25)',
                            borderRadius: 'clamp(8px, 2vw, 12px)',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(192,192,192,0.1)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                          >
                            <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: 8 }}>🥈</div>
                            <div style={{ color: '#c0c0c0', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
                              2ND PLACE
                            </div>
                            <p style={{
                              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                              fontWeight: 600,
                              color: '#e8eaf6',
                              marginBottom: 8,
                            }}>
                              {result.second_place}
                            </p>
                            {result.second_university && (
                              <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#8892b0', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>
                                📚 {result.second_university}
                              </p>
                            )}
                            {result.second_place_info && (
                              <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#8892b0' }}>
                                {result.second_place_info}
                              </p>
                            )}
                          </div>
                        )}

                        {/* 3rd Place */}
                        {result.third_place && (
                          <div style={{
                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                            background: 'linear-gradient(135deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.05) 100%)',
                            border: '2px solid rgba(205,127,50,0.25)',
                            borderRadius: 'clamp(8px, 2vw, 12px)',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(205,127,50,0.1)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                          >
                            <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: 8 }}>🥉</div>
                            <div style={{ color: '#cd7f32', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
                              3RD PLACE
                            </div>
                            <p style={{
                              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                              fontWeight: 600,
                              color: '#e8eaf6',
                              marginBottom: 8,
                            }}>
                              {result.third_place}
                            </p>
                            {result.third_university && (
                              <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#8892b0', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>
                                📚 {result.third_university}
                              </p>
                            )}
                            {result.third_place_info && (
                              <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#8892b0' }}>
                                {result.third_place_info}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Result Image */}
                      {result.result_image_url && (
                        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
                          <img
                            src={result.result_image_url}
                            alt="Result"
                            style={{
                              width: '100%',
                              maxHeight: 'clamp(200px, 50vh, 350px)',
                              objectFit: 'cover',
                              borderRadius: 'clamp(8px, 2vw, 12px)',
                              border: '1px solid rgba(170,136,255,0.25)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => setLightbox(result)}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(170,136,255,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                          />
                        </div>
                      )}

                      {/* Description */}
                      {result.result_description && (
                        <div style={{
                          padding: 'clamp(1rem, 2vw, 1.25rem)',
                          background: 'rgba(170,136,255,0.08)',
                          border: '1px solid rgba(170,136,255,0.2)',
                          borderRadius: 'clamp(8px, 2vw, 10px)',
                          lineHeight: 1.7,
                        }}>
                          <p style={{ color: '#e8eaf6', fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', whiteSpace: 'pre-wrap', margin: 0 }}>
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
