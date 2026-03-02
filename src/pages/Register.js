import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Mail, Hash, Building, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const events = ['Speed Programming','E-Gaming (FIFA)','E-Gaming (Tekken)','Web Development','UI/UX Design','Prompt Engineering','CS Quiz','Poster Designing'];
const departments = ['Computer Science','Software Engineering','Information Technology','Artificial Intelligence','Electrical Engineering','Business Administration','Other'];

export default function Register() {
  const [form, setForm] = useState({ student_name:'', email:'', reg_number:'', department:'', event_id:'' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableEvents, setAvailableEvents] = useState(events.map((e,i)=>({id:i+1,title:e})));

  useEffect(() => {
    supabase.from('events').select('id,title').then(({data}) => { if(data&&data.length) setAvailableEvents(data); });
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_name || !form.email || !form.reg_number || !form.department || !form.event_id) {
      toast.error('Please fill all fields'); return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('registrations').insert([{ ...form, event_id: parseInt(form.event_id) }]);
      if (error) throw error;
      setSuccess(true);
      toast.success('Registration successful!');
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    }
    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px 14px 44px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.2)',
    color: '#e8eaf6', fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 500,
    outline: 'none', borderRadius: 0, transition: 'border-color 0.3s',
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem' }}>
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', maxWidth: 500, borderColor: 'rgba(0,255,136,0.3)' }}>
          <CheckCircle size={64} style={{ color: '#00ff88', marginBottom: '1.5rem', animation: 'pulse-glow 2s infinite' }} />
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: '1rem' }}>Registered!</h2>
          <p style={{ color: '#8892b0', lineHeight: 1.7, marginBottom: '1rem' }}>
            <strong style={{ color: '#00ff88' }}>{form.student_name}</strong>, your registration is confirmed!<br />
            Check your email at <strong style={{ color: '#00d4ff' }}>{form.email}</strong> for confirmation.
          </p>
          <p style={{ color: '#8892b0', marginBottom: '2rem', fontSize: '0.9rem' }}>Event: <span style={{ color: '#ffd700' }}>{availableEvents.find(e=>e.id==form.event_id)?.title}</span></p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#00d4ff' }}>📅 December 10, 2025 | CUI Vehari Campus</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(0,212,255,0.08) 0%, transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>Join VSpark 2025</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Register Now</h1>
        <p style={{ color: '#8892b0', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Fill in your details to secure your spot at VSpark 2025 — December 10, 2025</p>
      </section>

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <form onSubmit={submit} className="glass" style={{ padding: '3rem' }}>
            {[
              { name: 'student_name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Muhammad Ali' },
              { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@example.com' },
              { name: 'reg_number', label: 'Registration Number', icon: Hash, type: 'text', placeholder: 'SP21-CS-001' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 8, fontSize: '0.9rem' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <f.icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff' }} />
                  <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor='#00d4ff'}
                    onBlur={e => e.target.style.borderColor='rgba(0,212,255,0.2)'}
                  />
                </div>
              </div>
            ))}
            
            {/* Department select */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 8, fontSize: '0.9rem' }}>Department</label>
              <div style={{ position: 'relative' }}>
                <Building size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff', zIndex: 1 }} />
                <select name="department" value={form.department} onChange={handle}
                  style={{ ...inputStyle, appearance: 'none', paddingRight: 44, cursor: 'pointer' }}>
                  <option value="" style={{ background: '#0a0f1e' }}>Select Department</option>
                  {departments.map(d => <option key={d} value={d} style={{ background: '#0a0f1e' }}>{d}</option>)}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8892b0' }} />
              </div>
            </div>

            {/* Event select */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 8, fontSize: '0.9rem' }}>Select Competition</label>
              <div style={{ position: 'relative' }}>
                <select name="event_id" value={form.event_id} onChange={handle}
                  style={{ ...inputStyle, paddingLeft: 16, appearance: 'none', paddingRight: 44, cursor: 'pointer' }}>
                  <option value="" style={{ background: '#0a0f1e' }}>Choose Competition</option>
                  {availableEvents.map(e => <option key={e.id} value={e.id} style={{ background: '#0a0f1e' }}>{e.title}</option>)}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8892b0' }} />
              </div>
            </div>

            <button type="submit" className="btn-neon" disabled={submitting}
              style={{ width: '100%', fontSize: '1.1rem', padding: '16px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
