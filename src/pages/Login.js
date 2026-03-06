import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handle = e => setForm({...form,[e.target.name]:e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    if(!form.email||!form.password){ toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if(error) throw error;
      setUser(data.user);
      setLoggedIn(true);
      toast.success('Welcome back!');
    } catch(err) {
      toast.error('Invalid email or password. Check your credentials sent by admin.');
    }
    setLoading(false);
  };

  if(loggedIn && user) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      <Navbar/>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'8rem 2rem'}}>
        <div className="glass" style={{padding:'3.5rem',textAlign:'center',maxWidth:500,borderColor:'rgba(0,255,136,0.3)'}}>
          <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#00d4ff,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem',fontSize:'1.8rem',fontFamily:'Bebas Neue'}}>
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'2rem',letterSpacing:3,color:'#00ff88',marginBottom:'0.5rem'}}>Logged In!</h2>
          <p style={{color:'#8892b0',marginBottom:'0.5rem'}}>Welcome to VSpark</p>
          <p style={{color:'#00d4ff',fontFamily:'JetBrains Mono',fontSize:'0.85rem',marginBottom:'2rem'}}>{user.email}</p>
          <div style={{background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.2)',padding:'1.25rem',marginBottom:'2rem'}}>
            <p style={{color:'#8892b0',fontSize:'0.88rem',lineHeight:1.7}}>
              You are registered for VSpark. Check your email for event details, schedule updates, and competition information closer to the event date.
            </p>
          </div>
          <button onClick={()=>{supabase.auth.signOut();setLoggedIn(false);setUser(null);}} style={{background:'none',border:'1px solid rgba(255,61,119,0.4)',color:'#ff3d77',padding:'10px 24px',cursor:'pointer',fontFamily:'Rajdhani',fontWeight:600}}>
            Sign Out
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar/>
      <section style={{padding:'10rem 2rem 5rem',textAlign:'center',background:'radial-gradient(ellipse at top,rgba(124,58,237,0.08) 0%,transparent 60%)'}}>
        <span className="tag" style={{display:'inline-block',marginBottom:'1rem'}}>Participant Access</span>
        <h1 className="section-title" style={{display:'block',marginBottom:'0.5rem'}}>Login</h1>
        <p style={{color:'#8892b0',maxWidth:480,margin:'0 auto',lineHeight:1.7}}>
          Use the credentials sent to your email after admin approval of your registration.
        </p>
      </section>

      <section style={{padding:'1rem 2rem 6rem'}}>
        <div style={{maxWidth:440,margin:'0 auto'}}>
          <div className="glass" style={{padding:'2.5rem'}}>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
              <div style={{width:52,height:52,border:'1px solid rgba(124,58,237,0.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',background:'rgba(124,58,237,0.05)'}}>
                <LogIn size={22} style={{color:'#7c3aed'}}/>
              </div>
              <h2 style={{fontFamily:'Bebas Neue',fontSize:'1.6rem',letterSpacing:3,color:'#e8eaf6'}}>Participant Login</h2>
            </div>

            <form onSubmit={submit}>
              <div style={{marginBottom:'1.25rem'}}>
                <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:2,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Email</label>
                <div style={{position:'relative'}}>
                  <Mail size={14} style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'#7c3aed'}}/>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" style={{paddingLeft:38}}/>
                </div>
              </div>
              <div style={{marginBottom:'2rem'}}>
                <label style={{display:'block',fontFamily:'Bebas Neue',letterSpacing:2,color:'#8892b0',marginBottom:6,fontSize:'0.83rem'}}>Password</label>
                <div style={{position:'relative'}}>
                  <Lock size={14} style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'#7c3aed'}}/>
                  <input name="password" type={show?'text':'password'} value={form.password} onChange={handle} placeholder="••••••••" style={{paddingLeft:38,paddingRight:42}}/>
                  <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#8892b0',cursor:'pointer'}}>
                    {show?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                width:'100%',padding:'14px',background:'transparent',
                border:'2px solid #7c3aed',color:'#7c3aed',fontFamily:'Bebas Neue',
                fontSize:'1.05rem',letterSpacing:2,cursor:loading?'not-allowed':'pointer',
                transition:'all 0.3s',clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
                opacity:loading?0.7:1,
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#7c3aed';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#7c3aed';}}>
                {loading?'Signing In...':'Sign In'}
              </button>
            </form>

            <div style={{textAlign:'center',marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid rgba(0,212,255,0.1)'}}>
              <p style={{color:'#8892b0',fontSize:'0.88rem'}}>
                Don't have credentials?{' '}
                <Link to="/register" style={{color:'#00d4ff',textDecoration:'none',fontWeight:600}}>Register here →</Link>
              </p>
            </div>
          </div>

          <div style={{marginTop:'1.5rem',padding:'1rem 1.5rem',background:'rgba(255,215,0,0.04)',border:'1px solid rgba(255,215,0,0.15)'}}>
            <p style={{color:'#ffd700',fontSize:'0.83rem',fontFamily:'JetBrains Mono',lineHeight:1.6}}>
              ⚠ Credentials are generated and emailed by admin after verifying your payment. If you haven't received them, contact the VSpark team.
            </p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
