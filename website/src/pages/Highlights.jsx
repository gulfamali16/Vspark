import { useState, useEffect } from 'react'
import { Image, X } from 'lucide-react'
import { getHighlights } from '../lib/supabase'

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
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    getHighlights().then(({ data }) => {
      if (data && data.length > 0) setHighlights(data)
      setLoading(false)
    }).catch(() => setLoading(false))
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
          <div className="section-subtitle" style={{ color: '#aa88ff' }}>Memories & Moments</div>
          <h1 className="section-title"><span style={{ color: '#aa88ff' }}>Event</span> Highlights</h1>
          <div className="section-divider" style={{ background: 'linear-gradient(90deg, transparent, #aa88ff, transparent)', marginBottom: 16 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Relive the excitement of past VSpark events. Browse through moments of innovation, competition, and achievement.
          </p>
        </div>
      </section>

      {/* Gallery */}
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
                      <Image size={14} color="var(--accent-cyan)" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: 2, textTransform: 'uppercase' }}>View Full</span>
                    </div>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{h.description}</p>
                  </div>
                  {/* Corner accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid var(--accent-cyan)', borderLeft: '2px solid var(--accent-cyan)' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
            <img src={lightbox.image_url} alt={lightbox.description}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', border: '1px solid var(--border)' }} />
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: 2, textAlign: 'center' }}>
              {lightbox.description}
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
