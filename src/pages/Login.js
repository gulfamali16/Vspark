import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;

      // Check if this is the admin email
      // Note: put your admin email in the condition if needed, based on logic
      const isAdmin = data.user.email === 'your-admin@email.com'; 

      setUser(data.user);
      setLoggedIn(true);
      toast.success('Welcome back!');

      setTimeout(() => {
        if (isAdmin) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/card';
        }
      }, 1000);
    } catch (err) {
      toast.error('Invalid email or password. Check your credentials sent by admin.');
    }
    setLoading(false);
  };

  if (loggedIn && user) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 mt-16 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 md:p-14 rounded-3xl shadow-soft text-center max-w-lg border border-primary-100"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-blue-400 mx-auto mb-6 flex items-center justify-center text-white font-sora font-black text-4xl shadow-md">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-sora font-black text-3xl text-gray-900 mb-2">Logged In!</h2>
          <p className="text-gray-500 font-medium mb-2">Welcome to VSpark</p>
          <p className="text-primary-600 font-bold tracking-wider text-sm mb-6 bg-primary-50 px-4 py-2 rounded-lg inline-block">
            {user.email}
          </p>
          <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              You are registered for VSpark. Check your email for event details, schedule updates, and competition information closer to the event date.
            </p>
          </div>
          <button 
            onClick={() => { supabase.auth.signOut(); setLoggedIn(false); setUser(null); }}
            className="w-full btn-outline border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="pt-32 pb-12 px-6 text-center bg-gradient-to-b from-primary-50 to-transparent">
        <span className="badge-premium mb-6">Participant Access</span>
        <h1 className="font-sora font-black text-4xl md:text-6xl text-gray-900 mb-4">Login</h1>
        <p className="text-gray-600 max-w-md mx-auto text-base md:text-lg leading-relaxed">
          Use the credentials sent to your email after admin approval of your registration.
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft border border-gray-100 mb-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4 border border-primary-100 shadow-sm">
                <LogIn className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="font-sora font-semibold text-2xl text-gray-900">Participant Login</h2>
            </div>

            <form onSubmit={submit}>
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={handle} 
                    placeholder="your@email.com" 
                    className="input-premium pl-12" 
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    name="password" 
                    type={show ? 'text' : 'password'} 
                    value={form.password} 
                    onChange={handle} 
                    placeholder="••••••••" 
                    className="input-premium pl-12 pr-12" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShow(!show)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full btn-primary text-lg py-4 rounded-xl shadow-lg transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-sm font-medium">
                Don't have credentials?{' '}
                <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors">
                  Register here →
                </Link>
              </p>
            </div>
          </motion.div>

          <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200 flex items-start gap-4">
             <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
             <p className="text-yellow-700 text-sm font-medium leading-relaxed">
               Credentials are generated and emailed by admin after verifying your payment. If you haven't received them, contact the VSpark team.
             </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
