import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('*').order('date'),
      supabase.from('site_settings').select('*'),
    ]).then(([ev, set]) => {
      setEvents(ev.data || []);
      const s = {};
      (set.data || []).forEach(r => { s[r.key] = r.value; });
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const statusColors = {
    upcoming: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.25)', color: '#00d4ff', label: 'UPCOMING' },
    registration_open: { bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', color: '#00ff88', label: 'REGISTRATION OPEN' },
    registration_closed: { bg: 'rgba(255,107,0,0.08)', border: 'rgba(255,107,0,0.25)', color: '#ff6b00', label: 'REGISTRATION CLOSED' },
    ongoing: { bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.25)', color: '#ffd700', label: 'ONGOING' },
    completed: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', color: '#8892b0', label: 'COMPLETED' },
  };

  const status = statusColors[settings.event_status] || statusColors.upcoming;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top,rgba(0,212,255,0.07) 0%,transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>Event Schedule</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Events</h1>

        {/* Event Status Banner */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: status.bg, border: `1px solid ${status.border}`, marginBottom: '1.5rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, animation: settings.event_status === 'registration_open' ? 'pulse-glow 2s infinite' : 'none' }} />
          <span style={{ color: status.color, fontFamily: 'JetBrains Mono', fontSize: '0.78rem', letterSpacing: 2 }}>{status.label}</span>
        </div>

        {settings.event_date && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={15} style={{ color: '#00d4ff' }} />
              <span style={{ color: '#e8eaf6', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>{settings.event_date}</span>
            </div>
            {settings.event_venue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} style={{ color: '#00d4ff' }} />
                <span style={{ color: '#e8eaf6', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>{settings.event_venue}</span>
              </div>
            )}
          </div>
        )}
      </section>

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
          {loading ? (
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Loading events...</p>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#8892b0' }}>
              <Calendar size={48} style={{ color: '#8892b0', marginBottom: '1rem' }} />
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Events will be announced soon.</p>
            </div>
          ) : events.map((ev, i) => {
            const isPast = ev.date && new Date(ev.date) < new Date();
            return (
              <div key={ev.id} className="glass" style={{ padding: '2rem', borderLeft: `3px solid ${isPast ? '#8892b0' : '#00d4ff'}`, opacity: isPast ? 0.6 : 1, display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Date block */}
                <div style={{ textAlign: 'center', minWidth: 70, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', lineHeight: 1, color: isPast ? '#8892b0' : '#00d4ff', letterSpacing: 2 }}>
                    {ev.date ? new Date(ev.date).getDate() : '—'}
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: '0.85rem', letterSpacing: 2, color: '#8892b0' }}>
                    {ev.date ? new Date(ev.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : ''}
                  </div>
                  {ev.date && <div style={{ color: '#8892b0', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>{new Date(ev.date).getFullYear()}</div>}
                </div>

                <div className="neon-divider" style={{ width: 1, height: 'auto', alignSelf: 'stretch', background: 'rgba(0,212,255,0.1)', flexShrink: 0 }} />

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: 8 }}>{ev.title}</h3>
                  <p style={{ color: '#8892b0', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1rem' }}>{ev.description}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {ev.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={13} style={{ color: '#8892b0' }} />
                        <span style={{ color: '#8892b0', fontSize: '0.82rem' }}>{ev.time}</span>
                      </div>
                    )}
                    {ev.venue && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} style={{ color: '#8892b0' }} />
                        <span style={{ color: '#8892b0', fontSize: '0.82rem' }}>{ev.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}