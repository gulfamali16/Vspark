import React, { useEffect, useState } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
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
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('highlights').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setHighlights(data?.length ? data : fallbackHighlights)
        setLoading(false)
      })
      .catch(() => {
        setHighlights(fallbackHighlights)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <section style={{ padding: '60px 0 40px', textAlign: 'center' }}>
          <div className="container">
            <div className="badge" style={{ marginBottom: 24 }}>Gallery</div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              Event <span className="gradient-text">Highlights</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              Relive the best moments from past VSpark events — the energy, the competition, the memories.
            </p>
          </div>
        </section>

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
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={selected.image_url} alt={selected.description} style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }} />
            {selected.description && (
              <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--text-muted)' }}>{selected.description}</div>
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
