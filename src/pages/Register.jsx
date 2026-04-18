/**
 * Register.jsx — Premium light-theme registration page
 */
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader, User, Mail, Hash, Building, Zap, Trophy, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const COMPETITIONS = ['Speed Programming','E-Gaming (FIFA)','E-Gaming (Tekken)','Web Development','UI/UX Design','Prompt Engineering','Quiz Competition','Poster Designing']
const DEPARTMENTS  = ['Computer Science (CS)','Software Engineering (SE)','Information Technology (IT)','Artificial Intelligence (AI)','Electrical Engineering (EE)','Business Administration (BBA)','Other']
const INITIAL_FORM = { student_name:'', email:'', reg_number:'', department:'', event_name:'' }

export default function Register() {
  const [searchParams] = useSearchParams()
  const preSelected    = searchParams.get('event')
  const [form,    setForm]    = useState({ ...INITIAL_FORM, event_name: preSelected || '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const handleFieldChange = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data: events } = await supabase.from('events').select('id').eq('title', form.event_name).limit(1)
      const event_id = events?.[0]?.id || null
      const { error: err } = await supabase.from('registrations').insert([{ ...form, event_id }])
      if (err) throw err
      setSuccess(true)
    } catch (err) { setError(err.message || 'Registration failed. Please try again.') }
    finally { setLoading(false) }
  }

  if (success) return <SuccessView form={form} onReset={() => { setSuccess(false); setForm({ ...INITIAL_FORM }) }} />

  const inputStyle = { background:'#FAFAFA', border:'1.5px solid #E5E7EB', borderRadius:10, padding:'11px 14px', fontSize:15, color:'#0F172A', outline:'none', width:'100%', fontFamily:'var(--font-body)', transition:'all 0.2s' }

  return (
    <div style={{ background:'#F9F7F4', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ paddingTop:68 }}>
        {/* Header */}
        <section style={{ padding:'80px 0 48px', textAlign:'center', background:'linear-gradient(160deg, #F9F7F4, #EEF2FF)' }}>
          <div className="container">
            <span className="section-eyebrow">Join VSpark 2025</span>
            <h1 className="section-title" style={{ marginBottom:16 }}>Register <span className="gradient-text">Now</span></h1>
            <p className="section-subtitle" style={{ margin:'0 auto' }}>Secure your spot at Pakistan's premier CS competition. Free for all eligible students.</p>
          </div>
        </section>

        <section style={{ padding:'48px 0 100px' }}>
          <div className="container" style={{ maxWidth:900 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:48, alignItems:'start' }}>
              {/* Info panel */}
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.3rem', color:'#0F172A', marginBottom:24 }}>What you get</h3>
                {[
                  { icon:<Trophy size={16}/>,   text:'7 Competition Categories', sub:'Pick the one that fits your skill' },
                  { icon:<Zap    size={16}/>,   text:'Internship Opportunities', sub:'Top performers get industry connections' },
                  { icon:<CheckCircle size={16}/>, text:'100% Free to Register', sub:'No fees, no hidden costs' },
                  { icon:<Building size={16}/>, text:'Open to All CS/SE/IT/AI', sub:'From any Pakistani university' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:20 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', color:'#4F46E5', flexShrink:0, marginTop:2 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.95rem', color:'#0F172A', marginBottom:2 }}>{item.text}</div>
                      <div style={{ fontSize:'0.83rem', color:'#9CA3AF' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:16, padding:20, marginTop:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'#4F46E5', marginBottom:12 }}>📅 Event Details</div>
                  {[['Date','December 10, 2025'],['Venue','COMSATS University, Vehari Campus'],['Time','9:00 AM onwards'],['Organizer','Department of Computer Science']].map(([k,v])=>(
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #F3F4F6', fontSize:'0.85rem' }}>
                      <span style={{ color:'#9CA3AF' }}>{k}</span><span style={{ fontWeight:600, color:'#374151' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:24, padding:36, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.25rem', color:'#0F172A', marginBottom:28 }}>Registration Form</h2>
                <form onSubmit={handleSubmit}>
                  {[
                    { key:'student_name', label:'Full Name',            Icon:User,     placeholder:'Muhammad Ahmad',      type:'text' },
                    { key:'reg_number',   label:'Registration Number',  Icon:Hash,     placeholder:'FA21-BCS-001',         type:'text' },
                    { key:'email',        label:'Email Address',        Icon:Mail,     placeholder:'student@comsats.edu.pk', type:'email' },
                  ].map(({ key, label, Icon, placeholder, type }) => (
                    <div key={key} className="form-group">
                      <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>
                        <Icon size={12} /> {label} *
                      </label>
                      <input type={type} value={form[key]} onChange={handleFieldChange(key)} placeholder={placeholder} required style={inputStyle}
                        onFocus={e=>{e.target.style.borderColor='#4F46E5';e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)'}}
                        onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none'}}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
                      <Building size={12} /> Department *
                    </label>
                    <select value={form.department} onChange={handleFieldChange('department')} required style={{ ...inputStyle, cursor:'pointer' }}>
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
                      <Trophy size={12} /> Competition / Event *
                    </label>
                    <select value={form.event_name} onChange={handleFieldChange('event_name')} required style={{ ...inputStyle, cursor:'pointer' }}>
                      <option value="">Select Competition</option>
                      {COMPETITIONS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {error && (
                    <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', color:'#B91C1C', fontSize:'0.875rem', marginBottom:20 }}>
                      {error}
                    </div>
                  )}
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'14px 0', fontSize:'1rem', opacity:loading?0.7:1, borderRadius:10 }}>
                    {loading ? <><Loader size={16} style={{ animation:'rotate 0.8s linear infinite' }}/> Registering...</> : <><Zap size={16}/> Complete Registration</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

function SuccessView({ form, onReset }) {
  return (
    <div style={{ background:'#F9F7F4', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:68 }}>
        <div style={{ textAlign:'center', maxWidth:540, padding:40, animation:'fadeInUp 0.5s ease' }}>
          <div style={{ width:88, height:88, borderRadius:'50%', background:'#F0FDF4', border:'2px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', boxShadow:'0 0 0 8px rgba(34,197,94,0.08)' }}>
            <CheckCircle size={44} style={{ color:'#22C55E' }} />
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'#0F172A', marginBottom:14 }}>
            Registration <span className="gradient-text">Successful!</span>
          </h1>
          <p style={{ color:'#6B7280', lineHeight:1.7, marginBottom:32, fontSize:'1rem' }}>
            Thank you, <strong style={{ color:'#0F172A' }}>{form.student_name}</strong>! You've registered for <strong style={{ color:'#4F46E5' }}>{form.event_name}</strong> at VSpark 2025.
          </p>
          <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:16, padding:24, marginBottom:28, textAlign:'left', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.95rem', color:'#0F172A', marginBottom:16 }}>Registration Details</h3>
            {[['Name',form.student_name],['Email',form.email],['Reg. No.',form.reg_number],['Department',form.department],['Event',form.event_name],['Date','December 10, 2025'],['Venue','COMSATS University, Vehari Campus']].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F3F4F6', fontSize:'0.875rem' }}>
                <span style={{ color:'#9CA3AF' }}>{k}</span><span style={{ fontWeight:600, color:'#374151', textAlign:'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <button onClick={onReset} className="btn-primary" style={{ borderRadius:10 }}>Register for Another Event</button>
            <a href="/" className="btn-outline" style={{ borderRadius:10 }}>Back to Home</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
