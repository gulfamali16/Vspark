import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, LogOut, Calendar, MapPin, Clock, User, Hash, Building, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function StudentCard() {
  const [user, setUser] = useState(null);
  const [reg, setReg] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setUser(session.user);

      // Get registration
      const { data: regData } = await supabase
        .from('registration_requests')
        .select('*, competitions(title, category, color, fee)')
        .eq('email', session.user.email)
        .eq('status', 'approved')
        .single();

      if (regData) {
        setReg(regData);

        // Get schedule for their competition
        if (regData.competition_id) {
          const { data: schedData } = await supabase
            .from('schedules')
            .select('*, rooms(name, location), time_slots(label, start_time, end_time, event_date)')
            .eq('competition_id', regData.competition_id)
            .single();
          setSchedule(schedData);
        }

        // Generate QR code using free API
        const qrData = JSON.stringify({
          id: regData.id,
          name: regData.student_name,
          email: regData.email,
          competition: regData.competitions?.title,
          reg_no: regData.reg_number,
        });
        const encoded = encodeURIComponent(qrData);
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&bgcolor=050810&color=00d4ff&margin=10`);
      }

      setLoading(false);
    };
    init();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const downloadCard = () => {
    if (!cardRef.current) return;
    // Simple print-based download
    const printContent = cardRef.current.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>VSpark Card</title>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
      <style>
        body{background:#050810;color:#e8eaf6;font-family:Rajdhani,sans-serif;margin:0;padding:20px;display:flex;justify-content:center}
        *{box-sizing:border-box}
      </style>
      </head><body>${printContent}</body></html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>Loading your card...</p>
      </div>
    </div>
  );

  if (!reg) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem' }}>
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: 480 }}>
          <QrCode size={48} style={{ color: '#8892b0', marginBottom: '1.5rem' }} />
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: '1rem' }}>No Approved Registration</h2>
          <p style={{ color: '#8892b0', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Your registration is either pending review or not yet submitted. Once admin approves it, your digital card will appear here.
          </p>
          <a href="/register" className="btn-neon" style={{ textDecoration: 'none', display: 'inline-block' }}>Register Now</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  const color = reg.competitions?.color || '#00d4ff';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <section style={{ flex: 1, padding: '9rem 2rem 5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="tag" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>Your Participation Pass</span>
          <h1 className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>Digital Card</h1>
          <p style={{ color: '#8892b0' }}>Show this card at the event entrance for verification</p>
        </div>

        {/* THE CARD */}
        <div ref={cardRef} style={{
          width: '100%', maxWidth: 520,
          background: 'linear-gradient(135deg, #0a0f1e 0%, #0f1628 100%)',
          border: `1px solid ${color}40`,
          boxShadow: `0 0 60px ${color}20, 0 0 120px ${color}10`,
          position: 'relative', overflow: 'hidden',
          marginBottom: '2rem',
        }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)` }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />

          {/* Header */}
          <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: `1px solid ${color}25`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: 4, color: '#fff' }}>
                V<span style={{ color }}>SPARK</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#8892b0', letterSpacing: 2 }}>
                COMSATS UNIVERSITY ISLAMABAD • VEHARI
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ padding: '3px 10px', background: `${color}20`, border: `1px solid ${color}50`, color, fontSize: '0.65rem', fontFamily: 'JetBrains Mono', letterSpacing: 2 }}>
                PARTICIPANT
              </div>
              <div style={{ color: '#8892b0', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                #{String(reg.id).padStart(4, '0')}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.5rem', position: 'relative' }}>
            {/* Left - Details */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: '#8892b0', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', letterSpacing: 2, marginBottom: 3 }}>PARTICIPANT</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6', lineHeight: 1 }}>{reg.student_name}</div>
              </div>

              {[
                [Hash, 'REG NUMBER', reg.reg_number],
                [Building, 'INSTITUTE', reg.institute],
                [User, 'DEPARTMENT', reg.department],
                [Award, 'COMPETITION', reg.competitions?.title],
              ].map(([Icon, label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <Icon size={12} style={{ color: '#8892b0', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#8892b0', fontSize: '0.58rem', fontFamily: 'JetBrains Mono', letterSpacing: 1.5 }}>{label}</div>
                    <div style={{ color: '#e8eaf6', fontSize: '0.85rem', fontWeight: 600 }}>{value || '—'}</div>
                  </div>
                </div>
              ))}

              {/* Schedule info */}
              {schedule && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: `${color}08`, border: `1px solid ${color}25` }}>
                  <div style={{ color, fontSize: '0.6rem', fontFamily: 'JetBrains Mono', letterSpacing: 2, marginBottom: 6 }}>VENUE & TIME</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <MapPin size={11} style={{ color: '#8892b0' }} />
                    <span style={{ color: '#e8eaf6', fontSize: '0.82rem' }}>{schedule.rooms?.name}</span>
                    <span style={{ color: '#8892b0', fontSize: '0.72rem' }}>{schedule.rooms?.location}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <Clock size={11} style={{ color: '#8892b0' }} />
                    <span style={{ color: '#e8eaf6', fontSize: '0.82rem' }}>{schedule.time_slots?.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Calendar size={11} style={{ color: '#8892b0' }} />
                    <span style={{ color: '#ffd700', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>
                      {schedule.time_slots?.event_date} · {schedule.time_slots?.start_time} – {schedule.time_slots?.end_time}
                    </span>
                  </div>
                </div>
              )}

              {!schedule && (
                <div style={{ marginTop: '1rem', padding: '0.6rem 0.75rem', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.2)' }}>
                  <p style={{ color: '#ff6b00', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>⏳ Schedule not yet announced</p>
                </div>
              )}
            </div>

            {/* Right - QR */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
              <div style={{ padding: 8, background: '#050810', border: `1px solid ${color}40` }}>
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" width={120} height={120} style={{ display: 'block' }} />
                ) : (
                  <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={40} style={{ color: '#8892b0' }} />
                  </div>
                )}
              </div>
              <div style={{ color: '#8892b0', fontSize: '0.58rem', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginTop: 6, textAlign: 'center' }}>
                SCAN TO VERIFY
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div style={{ padding: '0.75rem 2rem', background: `${color}10`, borderTop: `1px solid ${color}25`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8892b0', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', letterSpacing: 1 }}>VALID FOR EVENT DAY ONLY</span>
            <span style={{ color, fontSize: '0.65rem', fontFamily: 'JetBrains Mono', letterSpacing: 1 }}>✓ VERIFIED</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          <button onClick={downloadCard} className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
            <Download size={15} /> Download / Print Card
          </button>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,61,119,0.4)', color: '#ff3d77', cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,119,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Instructions */}
        <div className="glass" style={{ maxWidth: 520, width: '100%', padding: '1.5rem 2rem' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#ffd700', marginBottom: '0.75rem', fontSize: '1rem' }}>On Event Day</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              ['1', 'Show this digital card or print it'],
              ['2', 'Admin will scan your QR code at entrance'],
              ['3', 'Go to your assigned room at the listed time'],
              ['4', 'Bring your student ID for additional verification'],
            ].map(([n, t]) => (
              <div key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 20, height: 20, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', fontFamily: 'JetBrains Mono', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
                <span style={{ color: '#8892b0', fontSize: '0.88rem', lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}