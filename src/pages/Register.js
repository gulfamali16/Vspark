import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Mail, Hash, Building, ChevronDown, Upload, CreditCard, Info, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const institutes = ['COMSATS University Islamabad','University of the Punjab','NUST','FAST-NUCES','UET Lahore','UET Peshawar','Air University','Bahria University','IBA Karachi','LUMS','Government College University','University of Karachi','Quaid-i-Azam University','Other University','School/College (Pre-University)','Other'];
const departments = ['Computer Science','Software Engineering','Information Technology','Artificial Intelligence','Electrical Engineering','Business Administration','Pre-Engineering','Pre-Medical','ICS','Other'];

export default function Register() {
  const [form, setForm] = useState({
    student_name:'',email:'',reg_number:'',institute:'',department:'',
    competition_id:'',transaction_id:'',screenshot_url:'',phone:'',
  });
  const [competitions, setCompetitions] = useState([]);
  const [settings, setSettings] = useState({ payment_account:'', payment_account_name:'', payment_account_title:'' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);

  useEffect(() => {
    supabase.from('competitions').select('*').eq('is_active',true).order('title')
      .then(({data})=>{ if(data&&data.length) setCompetitions(data); });
    supabase.from('site_settings').select('*').then(({data})=>{
      if(data){
        const s={};
        data.forEach(r=>{ s[r.key]=r.value; });
        setSettings(s);
      }
    });
  },[]);

  const handle = e => setForm({...form,[e.target.name]:e.target.value});

  const handleCompChange = e => {
    const id = e.target.value;
    setForm({...form, competition_id:id});
    setSelectedComp(competitions.find(c=>String(c.id)===id)||null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const required = ['student_name','email','reg_number','institute','department','competition_id','transaction_id'];
    for(const f of required){
      if(!form[f]){ toast.error(`Please fill: ${f.replace('_',' ')}`); return; }
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('registration_requests').insert([{
        ...form,
        competition_id: parseInt(form.competition_id),
        fee_amount: selectedComp?.fee || 0,
        status: 'pending',
      }]);
      if(error) throw error;
      setSuccess(true);
      toast.success('Registration request submitted!');
    } catch(err) {
      toast.error('Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  if(success) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      <Navbar/>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'8rem 2rem'}}>
        <div className="glass" style={{padding:'3.5rem',textAlign:'center',maxWidth:520,borderColor:'rgba(0,255,136,0.3)'}}>
          <CheckCircle size={64} style={{color:'#00ff88',marginBottom:'1.5rem'}}/>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'2.2rem',letterSpacing:3,color:'#e8eaf6',marginBottom:'1rem'}}>Request Submitted!</h2>
          <p style={{color:'#8892b0',lineHeight:1.8,marginBottom:'1.5rem'}}>
            Hi <strong style={{color:'#00ff88'}}>{form.student_name}</strong>! Your registration request is under review.<br/>
            Once the admin verifies your payment, your login credentials will be sent to <strong style={{color:'#00d4ff'}}>{form.email}</strong>.
          </p>
          <div style={{background:'rgba(255,215,0,0.05)',border:'1px solid rgba(255,215,0,0.2)',padding:'1rem',marginBottom:'1.5rem'}}>
            <p style={{color:'#ffd700',fontSize:'0.9rem',display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
              <Clock size={16}/> Approval usually takes 24-48 hours
            </p>
          </div>
          <p style={{fontFamily:'JetBrains Mono',fontSize:'0.82rem',color:'#00d4ff'}}>Competition: {selectedComp?.title}</p>
        </div>
      </div>
      <Footer/>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar/>
      <section style={{padding:'10rem 2rem 3rem',textAlign:'center',background:'radial-gradient(ellipse at top,rgba(0,212,255,0.08) 0%,transparent 60%)'}}>
        <span className="tag" style={{display:'inline-block',marginBottom:'1rem'}}>Join VSpark</span>
        <h1 className="section-title" style={{display:'block',marginBottom:'0.5rem'}}>Register</h1>
        <p style={{color:'#8892b0',maxWidth:520,margin:'0 auto',lineHeight:1.7}}>Fill the form below. After admin verifies your payment, login credentials will be emailed to you.</p>
      </section>

      <section style={{padding:'2rem 2rem 6rem'}}>
        <div style={{maxWidth:680,margin:'0 auto'}}>

          {/* Payment Info Box */}
          {settings.payment_account && (
            <div style={{marginBottom:'2rem',padding:'1.5rem 2rem',background:'rgba(255,215,0,0.04)',border:'1px solid rgba(255,215,0,0.25)',borderLeft:'4px solid #ffd700'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'0.75rem'}}>
                <CreditCard size={18} style={{color:'#ffd700'}}/>
                <h3 style={{fontFamily:'Bebas Neue',letterSpacing:2,color:'#ffd700',fontSize:'1.1rem'}}>Payment Instructions</h3>
              </div>
              <p style={{color:'#8892b0',fontSize:'0.92rem',lineHeight:1.7,marginBottom:'0.5rem'}}>
                Transfer the registration fee to the account below, then fill in your transaction ID and attach screenshot.
              </p>
              <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'6px 16px',marginTop:'0.75rem'}}>
                {settings.payment_account_title&&<><span style={{color:'#8892b0',fontSize:'0.88rem'}}>Account Title:</span><span style={{color:'#ffd700',fontWeight:700}}>{settings.payment_account_title}</span></>}
                <span style={{color:'#8892b0',fontSize:'0.88rem'}}>Account #:</span>
                <span style={{color:'#fff',fontFamily:'JetBrains Mono',fontSize:'0.95rem',fontWeight:700,letterSpacing:1}}>{settings.payment_account}</span>
                {settings.payment_account_name&&<><span style={{color:'#8892b0',fontSize:'0.88rem'}}>Bank / Service:</span><span style={{color:'#e8eaf6'}}>{settings.payment_account_name}</span></>}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="glass" style={{padding:'2.5rem'}}>

            {/* Personal Info */}
            <div style={{marginBottom:'2rem'}}>
              <h3 style={{fontFamily:'Bebas Neue',letterSpacing:2,color:'#00d4ff',fontSize:'1.1rem',marginBottom:'1.25rem',paddingBottom:'0.5rem',borderBottom:'1px solid rgba(0,212,255,0.15)'}}>Personal Information</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Full Name *</label>
                  <input name="student_name" placeholder="Muhammad Ali" value={form.student_name} onChange={handle}/>
                </div>
                <div>
                  <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Phone Number</label>
                  <input name="phone" placeholder="03XX-XXXXXXX" value={form.phone} onChange={handle}/>
                </div>
              </div>
              <div style={{marginTop:'1rem'}}>
                <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Email Address *</label>
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}/>
              </div>
            </div>

            {/* Academic Info */}
            <div style={{marginBottom:'2rem'}}>
              <h3 style={{fontFamily:'Bebas Neue',letterSpacing:2,color:'#00d4ff',fontSize:'1.1rem',marginBottom:'1.25rem',paddingBottom:'0.5rem',borderBottom:'1px solid rgba(0,212,255,0.15)'}}>Academic Information</h3>
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>University / School / College *</label>
                <div style={{position:'relative'}}>
                  <select name="institute" value={form.institute} onChange={handle} style={{paddingRight:40,appearance:'none',cursor:'pointer'}}>
                    <option value="">Select Your Institution</option>
                    {institutes.map(i=><option key={i} value={i}>{i}</option>)}
                  </select>
                  <ChevronDown size={15} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'#8892b0',pointerEvents:'none'}}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Department *</label>
                  <div style={{position:'relative'}}>
                    <select name="department" value={form.department} onChange={handle} style={{paddingRight:40,appearance:'none',cursor:'pointer'}}>
                      <option value="">Select Department</option>
                      {departments.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={15} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'#8892b0',pointerEvents:'none'}}/>
                  </div>
                </div>
                <div>
                  <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Reg / Roll Number *</label>
                  <input name="reg_number" placeholder="FA23-BSE-001" value={form.reg_number} onChange={handle}/>
                </div>
              </div>
            </div>

            {/* Competition Selection */}
            <div style={{marginBottom:'2rem'}}>
              <h3 style={{fontFamily:'Bebas Neue',letterSpacing:2,color:'#00d4ff',fontSize:'1.1rem',marginBottom:'1.25rem',paddingBottom:'0.5rem',borderBottom:'1px solid rgba(0,212,255,0.15)'}}>Competition Selection</h3>
              <div style={{position:'relative',marginBottom:'1rem'}}>
                <select name="competition_id" value={form.competition_id} onChange={handleCompChange} style={{paddingRight:40,appearance:'none',cursor:'pointer'}}>
                  <option value="">Choose Competition</option>
                  {competitions.map(c=><option key={c.id} value={c.id}>{c.title} — PKR {c.fee?.toLocaleString()}</option>)}
                </select>
                <ChevronDown size={15} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'#8892b0',pointerEvents:'none'}}/>
              </div>
              {selectedComp && (
                <div style={{padding:'1rem 1.25rem',background:`rgba(0,212,255,0.05)`,border:`1px solid rgba(0,212,255,0.2)`,borderLeft:`3px solid #00d4ff`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                    <div>
                      <p style={{fontFamily:'Bebas Neue',color:'#e8eaf6',fontSize:'1.1rem',letterSpacing:1}}>{selectedComp.title}</p>
                      <p style={{color:'#8892b0',fontSize:'0.88rem',marginTop:3}}>{selectedComp.short_desc}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontFamily:'Bebas Neue',color:'#ffd700',fontSize:'1.5rem',letterSpacing:1}}>PKR {selectedComp.fee?.toLocaleString()}</p>
                      <p style={{color:'#8892b0',fontSize:'0.78rem'}}>Registration Fee</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Proof */}
            <div style={{marginBottom:'2rem'}}>
              <h3 style={{fontFamily:'Bebas Neue',letterSpacing:2,color:'#00d4ff',fontSize:'1.1rem',marginBottom:'1.25rem',paddingBottom:'0.5rem',borderBottom:'1px solid rgba(0,212,255,0.15)'}}>Payment Verification</h3>
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Transaction ID *</label>
                <input name="transaction_id" placeholder="e.g. TXN123456789" value={form.transaction_id} onChange={handle}/>
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:1.5,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>
                  Screenshot URL (Optional — Upload to GitHub &amp; paste link)
                </label>
                <input name="screenshot_url" placeholder="https://github.com/user-attachments/assets/..." value={form.screenshot_url} onChange={handle}/>
                <p style={{color:'rgba(0,212,255,0.5)',fontSize:'0.78rem',marginTop:6,fontFamily:'JetBrains Mono'}}>
                  <Info size={11} style={{display:'inline',marginRight:4}}/> 
                  Upload screenshot to GitHub Issues or Imgur, then paste the image URL here
                </p>
              </div>
            </div>

            <button type="submit" className="btn-neon" disabled={submitting} style={{width:'100%',fontSize:'1.05rem',padding:'15px',cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.7:1}}>
              {submitting ? 'Submitting Request...' : 'Submit Registration Request'}
            </button>
            <p style={{color:'#8892b0',fontSize:'0.82rem',textAlign:'center',marginTop:'1rem'}}>
              After admin approval, your login credentials will be sent to your email.
            </p>
          </form>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
