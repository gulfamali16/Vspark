import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const fallbackEvents = [
  { id: 1, title: 'VSpark 2025 — Main Event', date: '2025-12-10', time: '08:00 AM', venue: 'COMSATS University Islamabad, Vehari Campus', description: 'The flagship national-level competition event featuring 7 categories including speed programming, e-gaming, web development, UI/UX design, prompt engineering, quiz competition, and poster designing.', image_url: '' },
  { id: 2, title: 'Pre-Event Orientation', date: '2025-12-05', time: '10:00 AM', venue: 'CS Department Auditorium', description: 'Orientation session for registered participants. Learn about event rules, schedules, venue layout and meet your coordinators.', image_url: '' },
  { id: 3, title: 'Registration Deadline', date: '2025-12-08', time: '11:59 PM', venue: 'Online (vspark.cuivehari.edu.pk)', description: 'Last date for event registration. Make sure you have registered and received your confirmation email before this deadline.', image_url: '' },
];

export default function Events() {
  const [events, setEvents] = useState(fallbackEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true })
      .then(({ data }) => { if (data && data.length) setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>Schedule</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Upcoming Events</h1>
        <p style={{ color: '#8892b0', maxWidth: 550, margin: '0 auto', lineHeight: 1.7 }}>All important dates and events for VSpark 2025. Mark your calendars and don't miss a thing.</p>
      </section>

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {events.map((evt, i) => (
            <div key={evt.id} className="glass" style={{
              padding: '2.5rem', marginBottom: '1.5rem', borderRadius: 2,
              display: 'flex', gap: '2rem', alignItems: 'flex-start',
              borderLeft: `3px solid ${i === 0 ? '#00d4ff' : i === 1 ? '#7c3aed' : '#ff6b00'}`,
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform='translateX(8px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}>
              {/* Date block */}
              <div style={{ minWidth: 80, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', color: i===0?'#00d4ff':i===1?'#7c3aed':'#ff6b00', lineHeight: 1 }}>
                  {new Date(evt.date).getDate()}
                </div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#8892b0', letterSpacing: 2 }}>
                  {new Date(evt.date).toLocaleString('default',{month:'short'}).toUpperCase()}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#8892b0' }}>
                  {new Date(evt.date).getFullYear()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: 8 }}>{evt.title}</h3>
                <p style={{ color: '#8892b0', lineHeight: 1.7, marginBottom: '1rem' }}>{evt.description}</p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#8892b0', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} style={{ color: '#00d4ff' }} /> {evt.time || '08:00 AM'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} style={{ color: '#00d4ff' }} /> {evt.venue}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/register" className="btn-neon" style={{ textDecoration: 'none' }}>Register for Events</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
