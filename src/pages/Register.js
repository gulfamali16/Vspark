import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle, CreditCard, Info, Clock,
  ChevronDown, X, Plus, Minus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// ── Constants ────────────────────────────────────────────────
const INSTITUTES = [
  'COMSATS University Islamabad',
  'University of the Punjab',
  'NUST',
  'FAST-NUCES',
  'UET Lahore',
  'UET Peshawar',
  'Air University',
  'Bahria University',
  'IBA Karachi',
  'LUMS',
  'Government College University',
  'University of Karachi',
  'Quaid-i-Azam University',
  'Other University',
  'School / College (Pre-University)',
  'Other',
];

const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Artificial Intelligence',
  'Electrical Engineering',
  'Business Administration',
  'Pre-Engineering',
  'Pre-Medical',
  'ICS',
  'Other',
];

// ── Helpers ──────────────────────────────────────────────────

// Trim and collapse extra spaces
const clean = (val) => (val || '').replace(/\s+/g, ' ').trim();

// Clean phone — keep only digits, +, -, spaces
const cleanPhone = (val) => val.replace(/[^\d\s+\-()]/g, '').replace(/\s+/g, ' ').trim();

// Validate email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Label style
const labelSt = {
  display: 'block',
  fontFamily: 'Bebas Neue, cursive',
  letterSpacing: 1.5,
  color: '#8892b0',
  marginBottom: 5,
  fontSize: '0.82rem',
};

// Input style factory
const inputSt = (hasError) => ({
  width: '100%',
  padding: '12px 16px',
  background: hasError ? 'rgba(255,61,119,0.04)' : 'rgba(255,255,255,0.03)',
  border: `1px solid ${hasError ? 'rgba(255,61,119,0.5)' : 'rgba(0,212,255,0.2)'}`,
  color: '#e8eaf6',
  fontFamily: 'Rajdhani, sans-serif',
  fontSize: '1rem',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.2s',
});

// Field wrapper
function Field({ label, error, children, required }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={labelSt}>
        {label} {required && <span style={{ color: '#ff3d77' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: '#ff3d77', fontSize: '0.75rem', marginTop: 4, fontFamily: 'JetBrains Mono' }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Register() {
  const [searchParams] = useSearchParams();
  const preCompId   = searchParams.get('comp');      // competition ID from URL
  const preCompName = searchParams.get('compName');  // competition name from URL

  const [competitions, setCompetitions] = useState([]);
  const [settings, setSettings]         = useState({});
  const [submitting, setSubmitting]     = useState(false);
  const [success, setSuccess]           = useState(false);

  // Form state
  const [form, setForm] = useState({
    student_name:    '',
    email:           '',
    phone:           '',
    reg_number:      '',
    institute:       '',
    department:      '',
    transaction_id:  '',
    screenshot_url:  '',
  });

  // Selected competition IDs (array for multi-select)
  const [selectedIds, setSelectedIds] = useState([]);

  // Errors
  const [errors, setErrors] = useState({});

  // ── Load data ──────────────────────────────────────────────
  useEffect(() => {
    supabase.from('competitions').select('*').eq('is_active', true).order('title')
      .then(({ data }) => {
        setCompetitions(data || []);
        // Pre-select from URL param
        if (preCompId) {
          const id = parseInt(preCompId);
          if (!isNaN(id)) setSelectedIds([id]);
        }
      });

    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const s = {};
        data.forEach(r => { s[r.key] = r.value; });
        setSettings(s);
      }
    });
  }, [preCompId]);

  // ── Computed values ────────────────────────────────────────
  const selectedComps = competitions.filter(c => selectedIds.includes(c.id));
  const totalFee      = selectedComps.reduce((sum, c) => sum + (c.fee || 0), 0);

  // ── Toggle competition selection ───────────────────────────
  const toggleComp = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
    // Clear competition error on any change
    setErrors(e => ({ ...e, competitions: '' }));
  };

  // ── Handle field change ────────────────────────────────────
  const handle = (field) => (e) => {
    let val = e.target.value;
    // Auto-clean phone in real time
    if (field === 'phone') val = cleanPhone(val);
    setForm(prev => ({ ...prev, [field]: val }));
    // Clear error on change
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  // ── Validate ───────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    const name = clean(form.student_name);
    if (!name)              errs.student_name = 'Full name is required';
    else if (name.length < 3) errs.student_name = 'Name must be at least 3 characters';

    const email = clean(form.email).toLowerCase();
    if (!email)             errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address';

    const regNo = clean(form.reg_number);
    if (!regNo)             errs.reg_number = 'Registration / Roll number is required';

    if (!form.institute)    errs.institute = 'Please select your institution';
    if (!form.department)   errs.department = 'Please select your department';

    if (selectedIds.length === 0)
      errs.competitions = 'Please select at least one competition';

    const txn = clean(form.transaction_id);
    if (!txn)               errs.transaction_id = 'Transaction ID is required';
    else if (txn.length < 4) errs.transaction_id = 'Enter a valid transaction ID';

    return errs;
  };

  // ── Submit ─────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the highlighted fields');
      // Scroll to first error
      const firstErrKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstErrKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      // Build competition statuses (all start as pending)
      const compStatuses = {};
      selectedIds.forEach(id => { compStatuses[String(id)] = 'pending'; });

      const payload = {
        student_name:          clean(form.student_name),
        email:                 clean(form.email).toLowerCase(),
        phone:                 clean(form.phone),
        reg_number:            clean(form.reg_number),
        institute:             form.institute,
        department:            form.department,
        transaction_id:        clean(form.transaction_id),
        screenshot_url:        clean(form.screenshot_url),
        // Multi-competition fields
        competition_ids:       selectedIds,
        competition_statuses:  compStatuses,
        total_fee:             totalFee,
        fee_amount:            totalFee,
        // Keep first competition_id for backward compat
        competition_id:        selectedIds[0] || null,
        status:                'pending',
      };

      const { error } = await supabase.from('registration_requests').insert([payload]);
      if (error) throw error;

      setSuccess(true);
      toast.success('Registration request submitted!');
    } catch (err) {
      toast.error('Submission failed: ' + (err.message || 'Please try again'));
    }
    setSubmitting(false);
  };

  // ── Success screen ─────────────────────────────────────────
  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem' }}>
        <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', maxWidth: 560, borderColor: 'rgba(0,255,136,0.3)' }}>
          <CheckCircle size={64} style={{ color: '#00ff88', marginBottom: '1.5rem' }} />
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: '1rem' }}>
            Request Submitted!
          </h2>
          <p style={{ color: '#8892b0', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Your registration request is under review. Once the admin verifies your payment, your login credentials will be sent to{' '}
            <strong style={{ color: '#00d4ff' }}>{clean(form.email).toLowerCase()}</strong>.
          </p>

          {/* Selected competitions summary */}
          <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
            <p style={{ color: '#00d4ff', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '0.9rem', marginBottom: 8 }}>
              Competitions Registered:
            </p>
            {selectedComps.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(0,212,255,0.07)' }}>
                <span style={{ color: '#e8eaf6', fontSize: '0.88rem' }}>{c.title}</span>
                <span style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>PKR {c.fee?.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
              <span style={{ color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1 }}>Total Paid</span>
              <span style={{ color: '#ffd700', fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: 1 }}>PKR {totalFee.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#ffd700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <Clock size={16} /> Approval usually takes 24–48 hours
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── Main Form ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <section style={{ padding: '10rem 2rem 3rem', textAlign: 'center', background: 'radial-gradient(ellipse at top,rgba(0,212,255,0.08) 0%,transparent 60%)' }}>
        <span className="tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>Join VSpark</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>Register</h1>
        <p style={{ color: '#8892b0', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          Fill in your details and select your competitions. You can register for multiple events in a single request.
        </p>
      </section>

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* ── Payment Info ── */}
          {settings.payment_account && (
            <div style={{ marginBottom: '2rem', padding: '1.5rem 2rem', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.25)', borderLeft: '4px solid #ffd700' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                <CreditCard size={18} style={{ color: '#ffd700' }} />
                <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#ffd700', fontSize: '1.1rem' }}>Payment Instructions</h3>
              </div>
              <p style={{ color: '#8892b0', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Transfer the total registration fee to the account below, then fill in your transaction ID.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px' }}>
                {settings.payment_account_title && (
                  <>
                    <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>Account Title:</span>
                    <span style={{ color: '#ffd700', fontWeight: 700 }}>{settings.payment_account_title}</span>
                  </>
                )}
                <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>Account #:</span>
                <span style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '0.95rem', fontWeight: 700, letterSpacing: 1 }}>{settings.payment_account}</span>
                {settings.payment_account_name && (
                  <>
                    <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>Bank / Service:</span>
                    <span style={{ color: '#e8eaf6' }}>{settings.payment_account_name}</span>
                  </>
                )}
              </div>

              {/* Show total dynamically if competitions selected */}
              {totalFee > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
                    Total amount to transfer ({selectedComps.length} competition{selectedComps.length > 1 ? 's' : ''}):
                  </span>
                  <span style={{ color: '#ffd700', fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2 }}>
                    PKR {totalFee.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={submit} noValidate>

            {/* ── SECTION 1: Personal Info ── */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#00d4ff', fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div data-field="student_name">
                  <Field label="Full Name" required error={errors.student_name}>
                    <input
                      value={form.student_name}
                      onChange={handle('student_name')}
                      onBlur={e => setForm(p => ({ ...p, student_name: clean(e.target.value) }))}
                      placeholder="Muhammad Ali"
                      style={inputSt(!!errors.student_name)}
                    />
                  </Field>
                </div>
                <div data-field="phone">
                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      value={form.phone}
                      onChange={handle('phone')}
                      placeholder="03XX-XXXXXXX"
                      style={inputSt(false)}
                    />
                  </Field>
                </div>
              </div>
              <div data-field="email">
                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handle('email')}
                    onBlur={e => setForm(p => ({ ...p, email: clean(e.target.value).toLowerCase() }))}
                    placeholder="you@example.com"
                    style={inputSt(!!errors.email)}
                  />
                </Field>
              </div>
            </div>

            {/* ── SECTION 2: Academic Info ── */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#00d4ff', fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                Academic Information
              </h3>
              <div data-field="institute">
                <Field label="University / School / College" required error={errors.institute}>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={form.institute}
                      onChange={handle('institute')}
                      style={{ ...inputSt(!!errors.institute), paddingRight: 40, appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select Your Institution</option>
                      {INSTITUTES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <ChevronDown size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8892b0', pointerEvents: 'none' }} />
                  </div>
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div data-field="department">
                  <Field label="Department" required error={errors.department}>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={form.department}
                        onChange={handle('department')}
                        style={{ ...inputSt(!!errors.department), paddingRight: 40, appearance: 'none', cursor: 'pointer' }}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8892b0', pointerEvents: 'none' }} />
                    </div>
                  </Field>
                </div>
                <div data-field="reg_number">
                  <Field label="Reg / Roll Number" required error={errors.reg_number}>
                    <input
                      value={form.reg_number}
                      onChange={handle('reg_number')}
                      onBlur={e => setForm(p => ({ ...p, reg_number: clean(e.target.value).toUpperCase() }))}
                      placeholder="FA23-BSE-001"
                      style={inputSt(!!errors.reg_number)}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* ── SECTION 3: Competition Selection ── */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }} data-field="competitions">
              <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#00d4ff', fontSize: '1.1rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                Competition Selection
              </h3>
              <p style={{ color: '#8892b0', fontSize: '0.82rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono' }}>
                Select one or more competitions. Tap to toggle.
              </p>

              {errors.competitions && (
                <p style={{ color: '#ff3d77', fontSize: '0.78rem', fontFamily: 'JetBrains Mono', marginBottom: '0.75rem' }}>⚠ {errors.competitions}</p>
              )}

              <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {competitions.map(comp => {
                  const isSelected = selectedIds.includes(comp.id);
                  const color = comp.color || '#00d4ff';
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComp(comp.id)}
                      style={{
                        padding: '0.9rem 1.1rem',
                        cursor: 'pointer',
                        background: isSelected ? `${color}10` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? color + '50' : 'rgba(0,212,255,0.1)'}`,
                        borderLeft: `3px solid ${isSelected ? color : 'transparent'}`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.18s',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, overflow: 'hidden' }}>
                        {/* Checkbox */}
                        <div style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                          background: isSelected ? color : 'transparent',
                          border: `2px solid ${isSelected ? color : 'rgba(0,212,255,0.3)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {isSelected && <span style={{ color: '#050810', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ color: isSelected ? '#e8eaf6' : '#8892b0', fontSize: '0.92rem', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {comp.title}
                          </span>
                          <span style={{ color: '#8892b0', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', letterSpacing: 1 }}>
                            {comp.category}
                          </span>
                        </div>
                      </div>
                      <span style={{ color: '#ffd700', fontFamily: 'Bebas Neue', fontSize: '1.05rem', letterSpacing: 1, flexShrink: 0 }}>
                        PKR {comp.fee?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected summary + total */}
              {selectedComps.length > 0 && (
                <div style={{ padding: '1rem', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selectedComps.length > 1 ? 8 : 0 }}>
                    <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>
                      {selectedComps.length} competition{selectedComps.length > 1 ? 's' : ''} selected
                    </span>
                    <span style={{ color: '#ffd700', fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2 }}>
                      Total: PKR {totalFee.toLocaleString()}
                    </span>
                  </div>
                  {selectedComps.length > 1 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {selectedComps.map(c => (
                        <span key={c.id} style={{ padding: '2px 10px', background: `${c.color || '#00d4ff'}15`, color: c.color || '#00d4ff', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', border: `1px solid ${c.color || '#00d4ff'}30`, display: 'flex', alignItems: 'center', gap: 5 }}>
                          {c.title}
                          <span
                            onClick={(e) => { e.stopPropagation(); toggleComp(c.id); }}
                            style={{ cursor: 'pointer', lineHeight: 1 }}
                          >
                            <X size={10} />
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── SECTION 4: Payment Proof ── */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#00d4ff', fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                Payment Verification
              </h3>

              {/* Total reminder */}
              {totalFee > 0 && (
                <div style={{ padding: '0.65rem 1rem', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ffd700', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>Amount to transfer:</span>
                  <span style={{ color: '#ffd700', fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: 1 }}>PKR {totalFee.toLocaleString()}</span>
                </div>
              )}

              <div data-field="transaction_id">
                <Field label="Transaction ID" required error={errors.transaction_id}>
                  <input
                    value={form.transaction_id}
                    onChange={handle('transaction_id')}
                    onBlur={e => setForm(p => ({ ...p, transaction_id: clean(e.target.value) }))}
                    placeholder="e.g. TXN123456789"
                    style={inputSt(!!errors.transaction_id)}
                  />
                </Field>
              </div>

              <Field label="Screenshot URL (Optional — upload to GitHub & paste link)" error={errors.screenshot_url}>
                <input
                  value={form.screenshot_url}
                  onChange={handle('screenshot_url')}
                  placeholder="https://github.com/user-attachments/assets/..."
                  style={inputSt(false)}
                />
                <p style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.75rem', marginTop: 5, fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Info size={11} /> Upload to GitHub Issues or Imgur → paste URL here
                </p>
              </Field>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              className="btn-neon"
              disabled={submitting}
              style={{ width: '100%', fontSize: '1.05rem', padding: '16px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, border: 'none' }}
            >
              {submitting
                ? 'Submitting Request...'
                : `Submit Registration${selectedComps.length > 1 ? ` (${selectedComps.length} competitions)` : ''}`
              }
            </button>

            {totalFee > 0 && (
              <p style={{ color: '#8892b0', fontSize: '0.82rem', textAlign: 'center', marginTop: '0.75rem', fontFamily: 'JetBrains Mono' }}>
                Total payable: <strong style={{ color: '#ffd700' }}>PKR {totalFee.toLocaleString()}</strong>
                {' '}· After approval, credentials will be sent to your email.
              </p>
            )}
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}