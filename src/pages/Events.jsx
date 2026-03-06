import React, { useEffect, useState } from 'react'
import { Calendar, MapPin, Clock, ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const fallbackEvents = [
  {
    id: 'f1',
    title: 'VSpark 2025 — Main Event',
    description: 'The flagship national-level coding competition and innovation showcase. Features Speed Programming, Web Dev, UI/UX, E-Gaming, Prompt Engineering, Quiz, and Poster Designing competitions.',
    date: '2025-12-10T09:00:00',
    venue: 'COMSATS University Islamabad, Vehari Campus — Main Auditorium',
    category: 'Main Event',
    image_url: null,
  },
  {
    id: 'f2',
    title: 'Registration Deadline',
    description: 'Last day to register for VSpark 2025. Submit your registration forms, team details, and event preferences before the deadline.',
    date: '2025-12-05T23:59:00',
    venue: 'Online / CS Department Office',
    category: 'Deadline',
    image_url: null,
  },
  {
    id: 'f3',
    title: 'Orientation & Briefing Session',
    description: 'Pre-event orientation for all registered participants. Rules, schedules, and venue details will be shared. Mandatory for all team leads.',
    date: '2025-12-09T14:00:00',
    venue: 'COMSATS Vehari Campus — Lecture Hall 1',
    category: 'Orientation',
    image_url: null,
  },
]

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
}

function isUpcoming(dateStr) {
  return new Date(dateStr) > new Date()
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true })
      .then(({ data }) => {
        setEvents(data?.length ? data : fallbackEvents)
        setLoading(false)
      })
      .catch(() => {
        setEvents(fallbackEvents)
        setLoading(false)
      })
  }, [])

  const upcoming = events.filter(e => isUpcoming(e.date))
  const past = events.filter(e => !isUpcoming(e.date))

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <section style={{ padding: '60px 0 40px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(0,212,255,0.06), transparent 60%)', pointerEvents: 'none' }} />
          <div className="container">
            <div className="badge" style={{ marginBottom: 24 }}>Schedule</div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              Upcoming <span className="gradient-text">Events</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              Stay up to date with all VSpark 2025 activities, deadlines, and competitions.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 100px' }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto 16px' }} />
                Loading events...
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <div style={{ marginBottom: 64 }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 12px #22c55e' }} />
                      Upcoming Events
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {upcoming.map((ev) => (
                        <EventCard key={ev.id} event={ev} upcoming />
                      ))}
                    </div>
                  </div>
                )}

                {past.length > 0 && (
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 32, color: 'var(--text-muted)' }}>
                      Past Events
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {past.map((ev) => (
                        <EventCard key={ev.id} event={ev} />
                      ))}
                    </div>
                  </div>
                )}

                {events.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                    <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                    <p>No events found. Check back soon!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

function EventCard({ event, upcoming }) {
  const categoryColors = {
    'Main Event': '#00D4FF',
    'Deadline': '#FF6B35',
    'Orientation': '#7C3AED',
    'Workshop': '#10B981',
    'default': '#8899AA',
  }
  const color = categoryColors[event.category] || categoryColors.default

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${upcoming ? color + '40' : 'var(--border)'}`,
      borderRadius: 20,
      padding: 32,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 24,
      alignItems: 'center',
      transition: 'all 0.3s',
      opacity: upcoming ? 1 : 0.6,
    }}
      onMouseEnter={e => { if (upcoming) { e.currentTarget.style.borderColor = color + '80'; e.currentTarget.style.boxShadow = `0 0 30px ${color}15` } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = upcoming ? color + '40' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <span style={{
            background: `${color}15`, color, padding: '4px 14px', borderRadius: 100,
            fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {event.category || 'Event'}
          </span>
          {upcoming && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#22c55e', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse-glow 2s infinite' }} />
              UPCOMING
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: 10 }}>{event.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16, maxWidth: 700 }}>{event.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Calendar size={15} style={{ color }} /> {formatDate(event.date)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Clock size={15} style={{ color }} /> {formatTime(event.date)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <MapPin size={15} style={{ color }} /> {event.venue}
          </div>
        </div>
      </div>
      {upcoming && (
        <div style={{ flexShrink: 0 }}>
          <Link to="/register" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Zap size={15} />
            Register
          </Link>
        </div>
      )}
    </div>
  )
}
