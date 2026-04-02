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
  const [activeTab, setActiveTab] = useState('highlights')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const { data: highlightsData } = await supabase
          .from('highlights')
          .select('*')
          .order('created_at', { ascending: false })

        setHighlights(highlightsData?.length ? highlightsData : fallbackHighlights)

        const { data: compsData } = await supabase
          .from('competitions')
          .select('id, title, color')
          .eq('is_active', true)

        const compsLookup = {}
        compsData?.forEach(c => { compsLookup[c.id] = c })
        setCompetitions(compsLookup)

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
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('highlights')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'highlights' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'highlights' ? '2px solid rgba(0,212,255,0.5)' : '1px solid rgba(0,212,255,0.2)',
                color: activeTab === 'highlights' ? '#00d4ff' : '#8892b0',
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
              <ImageIcon size={16} /> Photos & Gallery
            </button>
            <button
              onClick={() => setActiveTab('results')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'results' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'results' ? '2px solid rgba(0,212,255,0.5)' : '1px solid rgba(0,212,255,0.2)',
                color: activeTab === 'results' ? '#00d4ff' : '#8892b0',
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
              <Trophy size={16} /> Competition Results
            </button>
          </div>
        </div>
      </section>

        {/* HIGHLIGHTS TAB */}
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  maxWidth: '1000px',
                  margin: '0 auto',
                }}>
                  {highlights.map((h) => (
                    <div key={h.id}
                      onClick={() => setSelected(h)}
                      style={{
                        position: 'relative', overflow: 'hidden',
                        cursor: 'pointer',
                        aspectRatio: '4/3',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,212,255,0.15)'
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <img src={h.image_url} alt="Event highlight" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                      {/* Corner accents */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' }} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* RESULTS TAB */}
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
                <div style={{ display: 'grid', gap: '24px' }}>
                  {results.map((result) => {
                    const comp = competitions[result.competition_id]
                    return (
                      <div key={result.id} style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(255,107,0,0.03) 100%)',
                        border: '2px solid rgba(0,212,255,0.25)',
                        borderRadius: '12px',
                        borderLeft: '5px solid #00d4ff',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,212,255,0.1)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      >
                        {/* Header */}
                        <div style={{ marginBottom: '16px' }}>
                          <h2 style={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#00d4ff',
                            marginBottom: 8,
                            margin: '0 0 8px 0',
                            fontFamily: 'Bebas Neue',
                            letterSpacing: 1,
                          }}>
                            {comp?.title || `Competition #${result.competition_id}`}
                          </h2>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#8892b0', fontSize: '0.85rem' }}>
                            {result.announced_at && (
                              <span>🏆 {new Date(result.announced_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            )}
                            {result.cash_prize && (
                              <span>💰 {result.cash_prize}</span>
                            )}
                          </div>
                        </div>

                        {/* Winners Grid - 2 columns or flex */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '12px',
                          marginBottom: '16px',
                        }}>
                          {/* 1st Place */}
                          <div style={{
                            padding: '12px',
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.06) 100%)',
                            border: '2px solid rgba(255,215,0,0.35)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,215,0,0.15)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                          >
                            <div style={{ fontSize: '2rem', marginBottom: 6 }}>🥇</div>
                            <div style={{ color: '#ffd700', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>
                              1ST
                            </div>
                            <p style={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: '#e8eaf6',
                              marginBottom: 4,
                              margin: '0 0 4px 0',
                            }}>
                              {result.first_place}
                            </p>
                            {result.first_university && (
                              <p style={{ fontSize: '0.7rem', color: '#8892b0', margin: '0 0 3px 0', fontFamily: 'JetBrains Mono' }}>
                                {result.first_university}
                              </p>
                            )}
                            {result.first_place_info && (
                              <p style={{ fontSize: '0.65rem', color: '#8892b0', margin: 0 }}>
                                {result.first_place_info}
                              </p>
                            )}
                          </div>

                          {/* 2nd Place */}
                          {result.second_place && (
                            <div style={{
                              padding: '12px',
                              background: 'linear-gradient(135deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.05) 100%)',
                              border: '2px solid rgba(192,192,192,0.25)',
                              borderRadius: '8px',
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(192,192,192,0.1)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                            >
                              <div style={{ fontSize: '2rem', marginBottom: 6 }}>🥈</div>
                              <div style={{ color: '#c0c0c0', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>
                                2ND
                              </div>
                              <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#e8eaf6',
                                marginBottom: 4,
                                margin: '0 0 4px 0',
                              }}>
                                {result.second_place}
                              </p>
                              {result.second_university && (
                                <p style={{ fontSize: '0.7rem', color: '#8892b0', margin: '0 0 3px 0', fontFamily: 'JetBrains Mono' }}>
                                  {result.second_university}
                                </p>
                              )}
                              {result.second_place_info && (
                                <p style={{ fontSize: '0.65rem', color: '#8892b0', margin: 0 }}>
                                  {result.second_place_info}
                                </p>
                              )}
                            </div>
                          )}

                          {/* 3rd Place */}
                          {result.third_place && (
                            <div style={{
                              padding: '12px',
                              background: 'linear-gradient(135deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.05) 100%)',
                              border: '2px solid rgba(205,127,50,0.25)',
                              borderRadius: '8px',
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(205,127,50,0.1)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                            >
                              <div style={{ fontSize: '2rem', marginBottom: 6 }}>🥉</div>
                              <div style={{ color: '#cd7f32', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>
                                3RD
                              </div>
                              <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#e8eaf6',
                                marginBottom: 4,
                                margin: '0 0 4px 0',
                              }}>
                                {result.third_place}
                              </p>
                              {result.third_university && (
                                <p style={{ fontSize: '0.7rem', color: '#8892b0', margin: '0 0 3px 0', fontFamily: 'JetBrains Mono' }}>
                                  {result.third_university}
                                </p>
                              )}
                              {result.third_place_info && (
                                <p style={{ fontSize: '0.65rem', color: '#8892b0', margin: 0 }}>
                                  {result.third_place_info}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Result Image */}
                        {result.result_image_url && (
                          <div style={{ marginBottom: '12px' }}>
                            <img
                              src={result.result_image_url}
                              alt="Result"
                              style={{
                                width: '100%',
                                maxHeight: '280px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid rgba(0,212,255,0.25)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                              }}
                              onClick={() => setSelected(result)}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.02)'
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,212,255,0.15)'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            />
                          </div>
                        )}

                        {/* Description */}
                        {result.result_description && (
                          <div style={{
                            padding: '10px',
                            background: 'rgba(0,212,255,0.08)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            borderRadius: '6px',
                            lineHeight: 1.5,
                          }}>
                            <p style={{ color: '#e8eaf6', fontSize: '0.8rem', whiteSpace: 'pre-wrap', margin: 0 }}>
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
