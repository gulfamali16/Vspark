import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// ============================================================
const ADMIN_EMAILS = [
  'gulfam@gmail.com', // ← your real admin email
];
// ============================================================

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in as admin/assistant, go to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const email = session.user.email;
      if (ADMIN_EMAILS.includes(email)) { navigate('/admin'); return; }
      const { data: assistant } = await supabase
        .from('admin_assistants').select('id').eq('email', email).eq('is_active', true).maybeSingle();
      if (assistant) { navigate('/admin'); return; }
      await supabase.auth.signOut();
    });
  }, [navigate]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;
      const email = data.user.email;

      const { data: studentReg } = await supabase
        .from('registration_requests').select('id').eq('email', email).eq('status', 'approved').maybeSingle();
      if (studentReg) {
        await supabase.auth.signOut();
        toast.error('This is the admin panel. Please use the participant login.');
        setTimeout(() => navigate('/login'), 1500);
        setLoading(false);
        return;
      }

      if (ADMIN_EMAILS.includes(email)) {
        sessionStorage.setItem('vspark_role', 'admin');
        sessionStorage.setItem('vspark_name', 'Admin');
        sessionStorage.setItem('vspark_perms', JSON.stringify(['all']));
        toast.success('Welcome back, Admin!');
        navigate('/admin');
        setLoading(false);
        return;
      }

      const { data: assistant } = await supabase
        .from('admin_assistants').select('*').eq('email', email).eq('is_active', true).maybeSingle();
      if (assistant) {
        sessionStorage.setItem('vspark_role', 'assistant');
        sessionStorage.setItem('vspark_name', assistant.name);
        sessionStorage.setItem('vspark_perms', JSON.stringify(assistant.permissions || []));
        toast.success(`Welcome, ${assistant.name}!`);
        navigate('/admin');
        setLoading(false);
        return;
      }

      await supabase.auth.signOut();
      toast.error('You are not authorized to access the admin panel.');
    } catch (err) {
      toast.error('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Background blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-sora font-black text-4xl tracking-tighter text-gray-900 mb-3">
            <span className="text-primary-600">V</span>SPARK
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-200 rounded-full">
            <Shield size={14} className="text-primary-600" />
            <span className="font-sora font-bold text-xs text-primary-600 tracking-widest uppercase">Admin Access Only</span>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-10 mb-6"
        >
          <h1 className="font-sora font-black text-2xl text-gray-900 text-center mb-1">Admin Login</h1>
          <p className="text-gray-500 text-sm text-center mb-8 font-medium">For admin and assistant accounts only</p>

          <form onSubmit={submit}>
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email" type="email" value={form.email} onChange={handle}
                  placeholder="admin@email.com"
                  className="input-premium pl-12"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••"
                  className="input-premium pl-12 pr-12"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full btn-primary py-4 text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </motion.div>

        {/* Link to participant login */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 text-sm font-medium mb-1">Are you a registered participant?</p>
            <Link to="/login" className="text-yellow-700 font-bold text-sm hover:text-yellow-900 hover:underline">
              Go to Participant Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}