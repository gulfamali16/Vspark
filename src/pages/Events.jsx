/**
 * Events.jsx — Premium light-theme events page
 */
import React, { useEffect, useState } from 'react'
import { Calendar, MapPin, Clock, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const FALLBACK_EVENTS = [
  { id:'f1', title:'VSpark 2025 — Main Event', description:'The flagship national-level coding competition and innovation showcase. Features Speed Programming, Web Dev, UI/UX, E-Gaming, Prompt Engineering, Quiz, and Poster Designing.', date:'2025-12-10T09:00:00', venue:'COMSATS University Islamabad, Vehari Campus — Main Auditorium', category:'Main Event', image_url:null },
  { id:'f2', title:'Registration Deadline', description:'Last day to register for VSpark 2025. Submit your registration forms, team details, and event preferences before the deadline.', date:'2025-12-05T23:59:00', venue:'Online / CS Department Office', category:'Deadline', image_url:null },
  { id:'f3', title:'Orientation & Briefing Session', description:'Pre-event orientation for all registered participants. Rules, schedules, and venue details will be shared. Mandatory for all team leads.', date:'2025-12-09T14:00:00', venue:'COMSATS Vehari Campus — Lecture Hall 1', category:'Orientation', image_url:null },
]

const CATEGORY_STYLES = {
  'Main Event':  { color:'#4F46E5', bg:'#EEF2FF' },
  'Deadline':    { color:'#DC2626', bg:'#FEF2F2' },
  'Orientation': { color:'#7C3AED', bg:'#F5F3FF' },
  'Workshop':    { color:'#059669', bg:'#ECFDF5' },
  'default':     { color:'#6B7280', bg:'#F3F4F6' },
}

function formatDate(d) { return new Date(d).toLocaleDateString('en-PK',{ weekday:'long', year:'numeric', month:'long', day:'numeric' }) }
function formatTime(d) { return new Date(d).toLocaleTimeString('en-PK',{ hour:'2-digit', minute:'2-digit' }) }
function isUpcoming(d) { return new Date(d) > new Date() }

export default function Events() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await supabase.from('events').select('*').order('date',{ ascending:true })
        setEvents(data?.length ? data : FALLBACK_EVENTS)
      } catch { setEvents(FALLBACK_EVENTS) }
      finally  { setLoading(false) }
    }
    fetchEvents()
  }, [])

  const upcoming = events.filter(e => isUpcoming(e.date))
  const past      = events.filter(e => !isUpcoming(e.date))

  return (
    <div style={{ background:'#F9F7F4', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:68 }}>
        {/* Header */}
        <section style={{ padding:'80px 0 48px', textAlign:'center', background:'linear-gradient(160deg, #F9F7F4, #EEF2FF)' }}>
          <div className="container">
            <span className="section-eyebrow">Schedule</span>
            <h1 className="section-title" style={{ marginBottom:16 }}>Upcoming <span className="gradient-text">Events</span></h1>
            <p className="section-subtitle" style={{ margin:'0 auto' }}>Stay up to date with all VSpark 2025 activities, deadlines, and competitions.</p>
          </div>
        </section>

        {/* Events */}
        <section style={{ padding:'48px 0 100px' }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign:'center', padding:80 }}>
                <div style={{ width:40, height:40, border:'3px solid #E5E7EB', borderTop:'3px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} />
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <div style={{ marginBottom:56 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 0 3px rgba(34,197,94,0.2)', display:'inline-block' }} />
                      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'#0F172A' }}>Upcoming Events</h2>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                      {upcoming.map(ev => <EventCard key={ev.id} event={ev} upcoming />)}
                    </div>
                  </div>
                )}
                {past.length > 0 && (
                  <div>
                    <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'#9CA3AF', marginBottom:28 }}>Past Events</h2>
                    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                      {past.map(ev => <EventCard key={ev.id} event={ev} />)}
                    </div>
                  </div>
                )}
                {events.length === 0 && (
                  <div style={{ textAlign:'center', padding:'80px 0', color:'#9CA3AF' }}>
                    <Calendar size={48} style={{ margin:'0 auto 16px', opacity:0.4 }} />
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
  const style  = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.default
  return (
    <div style={{
      background:'#fff', border:`1.5px solid ${upcoming ? style.color+'40' : '#E5E7EB'}`,
      borderRadius:20, padding:'28px 32px',
      display:'grid', gridTemplateColumns:'1fr auto', gap:24, alignItems:'center',
      opacity: upcoming ? 1 : 0.6,
      boxShadow: upcoming ? `0 2px 12px ${style.color}10` : 'none',
      transition:'all 0.2s',
    }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:10, marginBottom:12 }}>
          <span style={{ background:style.bg, color:style.color, padding:'4px 12px', borderRadius:100, fontSize:12, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>
            {event.category || 'Event'}
          </span>
          {upcoming && (
            <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#22C55E', fontWeight:600 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#22C55E' }} /> UPCOMING
            </span>
          )}
        </div>
        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.2rem', color:'#0F172A', marginBottom:8 }}>{event.title}</h3>
        <p style={{ color:'#6B7280', fontSize:'0.9rem', lineHeight:1.65, marginBottom:16, maxWidth:700 }}>{event.description}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:20 }}>
          {[{Icon:Calendar,text:formatDate(event.date)},{Icon:Clock,text:formatTime(event.date)},{Icon:MapPin,text:event.venue}].map(({Icon,text})=>(
            <div key={text} style={{ display:'flex', alignItems:'center', gap:6, color:'#9CA3AF', fontSize:'0.84rem' }}>
              <Icon size={14} style={{ color:style.color }} /> {text}
            </div>
          ))}
        </div>
      </div>
      {upcoming && (
        <div style={{ flexShrink:0 }}>
          <Link to="/register" className="btn-primary" style={{ whiteSpace:'nowrap', padding:'10px 20px', fontSize:'14px' }}>
            <Zap size={14} /> Register
          </Link>
        </div>
      )}
    </div>
  )
}
