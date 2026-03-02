import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Zap, ChevronRight } from 'lucide-react'
import { getEvents } from '../lib/supabase'

const fallbackEvents = [
  {
    id: 1,
    title: 'VSpark 2025 — Grand Opening',
    date: '2025-12-10T09:00:00',
    venue: 'Main Auditorium, COMSATS Vehari Campus',
    description: 'The official kickoff ceremony of VSpark 2025. Join us for opening speeches, event briefings, and the grand reveal of competition categories and schedules.',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: 2,
    title: 'Speed Programming Championship',
    date: '2025-12-10T10:00:00',
    venue: 'Computer Lab A, Block CS',
    description: 'The flagship coding competition of VSpark. Solve algorithmic challenges within the time limit and prove your programming supremacy.',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  {
    id: 3,
    title: 'E-Gaming Tournament',
    date: '2025-12-10T11:00:00',
    venue: 'Games Arena, Student Center',
    description: 'FIFA and Tekken knockout tournaments running throughout the day. Register your spots early — brackets fill up fast!',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
  },
  {
    id: 4,
    title: 'Web Dev & UI/UX Hackathon',
    date: '2025-12-10T10:30:00',
    venue: 'Innovation Lab, CS Block',
    description: 'Build a fully functional website or UI prototype from scratch based on the given brief. Teams of 2-3 compete for top honors.',
    image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
  },
  {
    id: 5,
    title: 'Prompt Engineering Challenge',
    date: '2025-12-10T14:00:00',
    venue: 'Seminar Hall, Block B',
    description: 'NEW for 2025! Master AI prompting in this unique competition. Craft the most effective prompts to achieve given tasks using AI tools.',
    image_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  },
  {
    id: 6,
    title: 'Awards & Closing Ceremony',
    date: '2025-12-10T17:00:00',
    venue: 'Main Auditorium, COMSATS Vehari Campus',
    description: 'Grand closing with prize distribution, internship opportunity announcements, and networking session with industry professionals.',
    image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80',
  },
]

export default function Events() {
  const [events, setEvents] = useState(fallbackEvents)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents().then(({ data }) => {
      if (data && data.length > 0) setEvents(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-subtitle">Schedule</div>
          <h1 className="section-title"><span style={{ color: 'var(--accent-cyan)' }}>Upcoming</span> Events</h1>
          <div className="section-divider" style={{ marginBottom: 24 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.8 }}>
            All events take place on <strong style={{ color: 'var(--accent-gold)' }}>December 10, 2025</strong> at COMSATS University Islamabad, Vehari Campus.
          </p>
          <Link to="/register" className="btn-primary"><Zap size={16} />Register Now</Link>
        </div>
      </section>

      {/* Timeline Events */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', letterSpacing: 3 }}>Loading events...</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 28 }}>
              {events.map((event, i) => {
                const { day, time } = formatDate(event.date)
                return (
                  <div key={event.id} className="card" style={{ overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
                    {/* Image */}
                    {event.image_url && (
                      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                        <img src={event.image_url} alt={event.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(1.2)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, var(--bg-card) 100%)' }} />
                        <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <span className="tag" style={{ background: 'rgba(0,212,255,0.9)', color: '#000', borderColor: 'transparent', fontWeight: 700 }}>
                            #{String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={{ padding: '24px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 16 }}>
                        {event.title}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <Calendar size={14} color="var(--accent-cyan)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{day}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Clock size={14} color="var(--accent-gold)" />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{time}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <MapPin size={14} color="var(--accent-green)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{event.venue}</span>
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 20 }}>
                        {event.description}
                      </p>

                      <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.85rem' }}>
                        <Zap size={14} />
                        Register
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
