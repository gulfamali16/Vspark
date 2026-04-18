/**
 * Competitions.jsx — Premium light-theme competitions listing
 */
import React, { useState } from 'react'
import { Code2, Gamepad2, Globe, Brain, Layers, Award, FileImage, CheckCircle, Clock, Users, Trophy, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const competitions = [
  { id:1, icon:<Code2 size={28}/>,    title:'Speed Programming',  subtitle:'On-the-Spot Coding',      color:'#4F46E5', bg:'#EEF2FF', category:'Programming', description:'Test your algorithmic thinking and coding speed. Solve complex problems under time pressure using any programming language. Problems range from basic logic to advanced data structures.', rules:['Individual participation only','Any programming language allowed','Internet access NOT permitted','Problems of varying difficulty','Score based on correctness + speed','Top 3 winners receive prizes'], prizes:['1st: PKR 5,000 + Certificate','2nd: PKR 3,000 + Certificate','3rd: PKR 1,500 + Certificate'], duration:'2 hours', teamSize:'Individual' },
  { id:2, icon:<Gamepad2 size={28}/>, title:'E-Gaming',           subtitle:'FIFA & Tekken Tournaments', color:'#F97316', bg:'#FFF7ED', category:'Gaming',     description:'Show your gaming skills in FIFA and Tekken. Bracket-style elimination rounds. COMSATS Vehari recently won 1st place in E-Gaming at Byte & Battle!', rules:['Both FIFA and Tekken available','1v1 bracket elimination format','Best of 3 matches per round','Finals: Best of 5','Bring your own controller (optional)','Fair play policy enforced'], prizes:['1st: PKR 4,000 + Trophy','2nd: PKR 2,500 + Certificate','3rd: PKR 1,000 + Certificate'], duration:'4 hours (full day)', teamSize:'Individual' },
  { id:3, icon:<Globe size={28}/>,    title:'Web Development',    subtitle:'Build. Deploy. Impress.',  color:'#7C3AED', bg:'#F5F3FF', category:'Development', description:'Build a fully functional website from scratch in limited time. Judges evaluate design, functionality, code quality, and user experience. Theme revealed on event day.', rules:['Teams of 2–3 members','Theme announced on the day','Any framework/library allowed','4-hour development window','Submission via GitHub link','Live demo to judges required'], prizes:['1st: PKR 6,000 + Certificates','2nd: PKR 4,000 + Certificates','3rd: PKR 2,000 + Certificates'], duration:'4 hours', teamSize:'2–3 members' },
  { id:4, icon:<Layers size={28}/>,   title:'UI/UX Design',       subtitle:'Design That Speaks',       color:'#EC4899', bg:'#FDF2F8', category:'Design',       description:'Create stunning user interface designs using Figma or Adobe XD. Design a complete app or website UI based on the given brief. Focus on aesthetics, usability, and user journey.', rules:['Individual or pairs (max 2)','Figma or Adobe XD only','Brief provided at start','3-hour design window','Prototype + presentation required','Judged on creativity + usability'], prizes:['1st: PKR 4,500 + Certificate','2nd: PKR 3,000 + Certificate','3rd: PKR 1,500 + Certificate'], duration:'3 hours', teamSize:'Individual or Pairs' },
  { id:5, icon:<Brain size={28}/>,    title:'Prompt Engineering', subtitle:'NEW for 2025 ✦',           color:'#059669', bg:'#ECFDF5', category:'AI',           description:'The newest category for VSpark 2025! Master the art of crafting AI prompts. Compete in designing optimal prompts for given tasks, evaluating AI outputs, and demonstrating understanding of large language models.', rules:['Individual participation','Tasks involve GPT/Claude prompting','Multiple rounds of challenges','Score based on output quality','Creativity and precision judged','No prior AI knowledge assumed'], prizes:['1st: PKR 5,000 + Certificate','2nd: PKR 3,000 + Certificate','3rd: PKR 1,500 + Certificate'], duration:'2.5 hours', teamSize:'Individual', isNew:true },
  { id:6, icon:<Award size={28}/>,    title:'Quiz Competition',   subtitle:'Test Your CS Knowledge',  color:'#D97706', bg:'#FFFBEB', category:'Quiz',         description:'A comprehensive quiz testing Computer Science fundamentals, current tech trends, programming concepts, and general knowledge. Multiple rounds with increasing difficulty.', rules:['Teams of 2 members','Multiple choice + buzzer rounds','Topics: CS, Programming, Tech','No device usage permitted','Tie-breaker rounds available','Academic year students only'], prizes:['1st: PKR 3,500 + Certificates','2nd: PKR 2,000 + Certificates','3rd: PKR 1,000 + Certificates'], duration:'1.5 hours', teamSize:'2 members' },
  { id:7, icon:<FileImage size={28}/>,title:'Poster Designing',   subtitle:'Visual Storytelling',     color:'#0891B2', bg:'#ECFEFF', category:'Design',       description:'Design an impactful poster on a given technology or social theme. Express ideas through compelling visual design. Printed and digital submissions both accepted.', rules:['Individual participation','Any design software allowed','A3 size, 300 DPI minimum','Both print and digital versions','Originality is key','Plagiarism = disqualification'], prizes:['1st: PKR 3,000 + Certificate','2nd: PKR 2,000 + Certificate','3rd: PKR 1,000 + Certificate'], duration:'3 hours', teamSize:'Individual' },
]

const CATEGORIES = ['All','Programming','Gaming','Development','Design','AI','Quiz']

export default function Competitions() {
  const [active,   setActive]   = useState('All')
  const [expanded, setExpanded] = useState(null)
  const filtered = competitions.filter(c => active === 'All' || c.category === active)

  return (
    <div style={{ background:'#F9F7F4', minHeight:'100vh' }}>
      <div style={{ backgroundImage:'radial-gradient(circle, #CBD5E1 1px, transparent 1px)', backgroundSize:'28px 28px', position:'fixed', inset:0, opacity:0.4, pointerEvents:'none', zIndex:0 }} />
      <Navbar />
      <div style={{ paddingTop:68, position:'relative', zIndex:1 }}>

        {/* Header */}
        <section style={{ padding:'80px 0 48px', textAlign:'center', background:'linear-gradient(160deg, #F9F7F4 0%, #EEF2FF 100%)' }}>
          <div className="container">
            <span className="section-eyebrow">Competitions</span>
            <h1 className="section-title" style={{ marginBottom:16 }}>Choose Your <span className="gradient-text">Battle</span></h1>
            <p className="section-subtitle" style={{ margin:'0 auto 40px' }}>Seven competition categories. Infinite opportunities to prove yourself.</p>
            {/* Filter tabs */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActive(cat)} style={{
                  padding:'8px 18px', borderRadius:100, border:'1.5px solid', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'13px', transition:'all 0.18s',
                  background:   active===cat ? '#4F46E5' : '#fff',
                  borderColor:  active===cat ? '#4F46E5' : '#E5E7EB',
                  color:        active===cat ? '#fff'    : '#6B7280',
                  boxShadow:    active===cat ? '0 2px 8px rgba(79,70,229,0.25)' : 'none',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Cards */}
        <section style={{ padding:'40px 0 100px' }}>
          <div className="container">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:20 }}>
              {filtered.map(comp => (
                <div key={comp.id} style={{
                  background:'#fff', border:`1.5px solid ${expanded===comp.id ? comp.color+'60' : '#E5E7EB'}`,
                  borderRadius:20, overflow:'hidden', transition:'all 0.25s',
                  boxShadow: expanded===comp.id ? `0 8px 32px ${comp.color}18` : '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                  {/* Card top */}
                  <div style={{ padding:28, cursor:'pointer' }} onClick={() => setExpanded(expanded===comp.id ? null : comp.id)}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                      <div style={{ width:56, height:56, borderRadius:14, background:comp.bg, display:'flex', alignItems:'center', justifyContent:'center', color:comp.color }}>
                        {comp.icon}
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                        {comp.isNew && <span className="badge badge-new">New 2025</span>}
                        <span style={{ background:comp.bg, color:comp.color, padding:'4px 12px', borderRadius:100, fontSize:12, fontWeight:700, letterSpacing:'0.04em' }}>{comp.category}</span>
                      </div>
                    </div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.15rem', color:'#0F172A', marginBottom:4 }}>{comp.title}</h3>
                    <div style={{ color:comp.color, fontSize:'0.8rem', fontWeight:600, letterSpacing:'0.5px', marginBottom:10 }}>{comp.subtitle}</div>
                    <p style={{ color:'#6B7280', fontSize:'0.9rem', lineHeight:1.65 }}>{comp.description}</p>
                    <div style={{ display:'flex', gap:20, marginTop:16 }}>
                      {[{icon:<Clock size={13}/>,val:comp.duration},{icon:<Users size={13}/>,val:comp.teamSize}].map((item,i)=>(
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:6, color:'#9CA3AF', fontSize:'0.8rem' }}>
                          <span style={{ color:comp.color }}>{item.icon}</span>{item.val}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Expanded */}
                  {expanded===comp.id && (
                    <div style={{ padding:'0 28px 28px', borderTop:`1px solid ${comp.color}20`, paddingTop:24 }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
                        <div>
                          <h4 style={{ fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.06em', textTransform:'uppercase', color:comp.color, marginBottom:12 }}>Rules</h4>
                          {comp.rules.map((rule,i)=>(
                            <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:8, fontSize:'0.84rem', color:'#374151' }}>
                              <CheckCircle size={13} style={{ color:comp.color, flexShrink:0, marginTop:2 }}/>{rule}
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 style={{ fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.06em', textTransform:'uppercase', color:comp.color, marginBottom:12 }}>Prizes</h4>
                          {comp.prizes.map((prize,i)=>(
                            <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:8, fontSize:'0.84rem' }}>
                              <Trophy size={13} style={{ color:['#F59E0B','#94A3B8','#D97706'][i], flexShrink:0, marginTop:2 }}/>
                              <span style={{ color:i===0?'#0F172A':'#6B7280' }}>{prize}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop:20 }}>
                        <Link to={`/register?event=${encodeURIComponent(comp.title)}`} className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                          <Zap size={15}/> Register for {comp.title}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
