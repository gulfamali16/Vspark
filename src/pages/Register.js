import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle, CreditCard, Info, Clock,
  ChevronDown, Building, Layout, User,
  Phone, Mail, GraduationCap, Link as LinkIcon,
  ArrowRight, ShieldCheck, Zap, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// ── Constants ────────────────────────────────────────────────
const DEPARTMENTS = [
  'Computer Science', 'Software Engineering', 'Information Technology', 'Artificial Intelligence',
  'Electrical Engineering', 'Business Administration', 'Pre-Engineering', 'Pre-Medical', 'ICS', 'Other',
];

const clean = (val) => (val || '').replace(/\s+/g, ' ').trim();
const cleanPhone = (val) => val.replace(/[^\d\s+\-()]/g, '').replace(/\s+/g, ' ').trim();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Field({ label, error, children, required, icon: Icon }) {
  return (
    <div className="mb-6">
      <label className="block font-sora font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-2.5 ml-1">
        {label} {required && <span className="text-primary-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        {children}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1.5 ml-1">
           <Info size={12} /> {error}
        </motion.p>
      )}
    </div>
  );
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const preCompId = searchParams.get('comp');
  const [competitions, setCompetitions] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [isOther, setIsOther] = useState(false);
  const [settings, setSettings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    student_name: '', email: '', phone: '', reg_number: '',
    institute: '', department: '', transaction_id: '', screenshot_url: '',
    manual_institute: '', focal_name: '', focal_contact: '', focal_email: '',
  });

  const [mainEvent, setMainEvent] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          // Fetch Main Event
          supabase.from('events').select('*').eq('is_main_event', true).maybeSingle()
            .then(({ data }) => setMainEvent(data)),

          // Fetch Competitions
          supabase.from('competitions').select('*').eq('is_active', true).order('title')
            .then(({ data }) => {
              setCompetitions(data || []);
              if (preCompId) {
                const id = parseInt(preCompId);
                if (!isNaN(id)) setSelectedIds([id]);
              }
            }),

          // Fetch Universities
          supabase.from('universities').select('*').order('name')
            .then(({ data }) => setUniversities(data || [])),

          // Fetch Site Settings
          supabase.from('site_settings').select('*').then(({ data }) => {
            if (data) {
              const s = {};
              data.forEach(r => { s[r.key] = r.value; });
              setSettings(s);
            }
          })
        ]);
      } catch (err) {
        console.error('Error loading registration data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    
    load();
  }, [preCompId]);

  const selectedComps = competitions.filter(c => selectedIds.includes(c.id));
  const totalFee = selectedComps.reduce((sum, c) => sum + (c.fee || 0), 0);

  const toggleComp = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setErrors(e => ({ ...e, competitions: '' }));
  };

  const handle = (field) => (e) => {
    let val = e.target.value;
    if (field === 'phone' || field === 'focal_contact') val = cleanPhone(val);
    
    if (field === 'institute') {
      if (val === 'OTHER') {
        setIsOther(true);
        setSelectedUni(null);
        setForm(prev => ({ ...prev, institute: 'Other', focal_name: '', focal_contact: '', focal_email: '' }));
      } else {
        const uni = universities.find(u => String(u.id) === val);
        setIsOther(false);
        setSelectedUni(uni);
        setForm(prev => ({ 
          ...prev, 
          institute: uni.name, 
          focal_name: uni.focal_person, 
          focal_contact: uni.contact_number, 
          focal_email: uni.email,
          department: uni.department || prev.department
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [field]: val }));
    }
    
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z\s.]+$/;

    if (!clean(form.student_name)) errs.student_name = 'Full name is required';
    else if (!nameRegex.test(form.student_name)) errs.student_name = 'Name should only contain letters';
    else if (clean(form.student_name).length < 3) errs.student_name = 'Name is too short';

    if (!isValidEmail(clean(form.email))) errs.email = 'Enter a valid email address';
    if (!clean(form.reg_number)) errs.reg_number = 'Registration number required';
    if (!form.institute || form.institute === '') errs.institute = 'Institution is required';
    if (!form.department) errs.department = 'Department is required';
    
    if (isOther) {
      if (!clean(form.manual_institute)) errs.manual_institute = 'University name is required';
      else if (!nameRegex.test(form.manual_institute)) errs.manual_institute = 'Use only letters for university name';

      if (!clean(form.focal_name)) errs.focal_name = 'Focal person name required';
      else if (!nameRegex.test(form.focal_name)) errs.focal_name = 'Focal name should only contain letters';

      if (!clean(form.focal_contact)) errs.focal_contact = 'Focal contact required';
      if (!isValidEmail(clean(form.focal_email))) errs.focal_email = 'Valid focal email required';
    }

    if (selectedIds.length === 0) errs.competitions = 'Choose at least one competition';
    if (!clean(form.transaction_id)) errs.transaction_id = 'Transaction ID is required';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors in the form');
      window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll to form start
      return;
    }
    setSubmitting(true);
    try {
      const compStatuses = {};
      selectedIds.forEach(id => { compStatuses[String(id)] = 'pending'; });
      
      const payload = {
        student_name: clean(form.student_name),
        email: clean(form.email).toLowerCase(),
        phone: clean(form.phone),
        reg_number: clean(form.reg_number),
        institute: isOther ? clean(form.manual_institute) : form.institute,
        department: form.department,
        transaction_id: clean(form.transaction_id),
        screenshot_url: clean(form.screenshot_url),
        competition_ids: selectedIds,
        competition_statuses: compStatuses,
        total_fee: totalFee,
        fee_amount: totalFee,
        competition_id: selectedIds[0] || null,
        status: 'pending',
        
        // Focal person details
        university_id: selectedUni ? selectedUni.id : null,
        focal_person_name: clean(form.focal_name),
        focal_person_contact: clean(form.focal_contact),
        focal_person_email: clean(form.focal_email).toLowerCase(),
      };
      
      const { error } = await supabase.from('registration_requests').insert([payload]);
      if (error) throw error;
      setSuccess(true);
      toast.success('Registration submitted!');
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    }
    setSubmitting(false);
  };

  if (loadingData) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Initializing registration...</p>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sora">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 md:p-14 rounded-3xl shadow-soft text-center max-w-xl border border-gray-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="font-black text-3xl text-gray-900 mb-4">Request Received!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your verification is pending. Credentials will be sent to <span className="text-primary-600 font-bold">{form.email}</span> within 24-48 hours.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left mb-8">
            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest opacity-60">Registration Summary</h4>
            <div className="space-y-3 mb-4">
              {selectedComps.map(c => (
                <div key={c.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate mr-4">{c.title}</span>
                  <span className="font-bold text-gray-900">PKR {c.fee}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="font-black text-xl text-primary-600">PKR {totalFee}</span>
            </div>
          </div>
          <Link to="/" className="btn-primary w-full justify-center py-4 text-base font-bold">Return Home</Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sora">
      <Navbar />
      
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="mb-10 text-center lg:text-left">
          <span className="badge-premium mb-4 flex items-center gap-1 justify-center lg:justify-start w-fit mx-auto lg:mx-0">
            <Zap size={14} fill="currentColor" className="text-amber-500" /> {mainEvent ? 'Official Event Dashboard' : 'National Innovation Event'}
          </span>
          <h1 className="font-black text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-4 leading-tight">
            Register for <span className="text-gradient">{mainEvent?.title || 'VSpark'}</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            {mainEvent?.date 
              ? `Join us on ${new Date(mainEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${mainEvent.venue}. Register now to secure your spot!`
              : "Join 500+ participants from across the country. Select your university and competitions to get started."
            }
          </p>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-5 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center"><User size={18}/></div>
                Profile Details
              </h3>
              
              <Field label="Full Name" required error={errors.student_name} icon={User}>
                <input value={form.student_name} onChange={handle('student_name')} placeholder="Ali Khan" className="input-premium pl-12" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="WhatsApp / Phone" error={errors.phone} icon={Phone}>
                  <input value={form.phone} onChange={handle('phone')} placeholder="03XXXXXXXXX" className="input-premium pl-12" />
                </Field>
                <Field label="Email Address" required error={errors.email} icon={Mail}>
                  <input type="email" value={form.email} onChange={handle('email')} placeholder="ali@gmail.com" className="input-premium pl-12" />
                </Field>
              </div>

              <Field label="University / Institute" required error={errors.institute} icon={Building}>
                <select 
                  onChange={handle('institute')} 
                  className="input-premium pl-12 appearance-none cursor-pointer"
                >
                  <option value="">Select University</option>
                  {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  <option value="OTHER">Other / Not Listed</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </Field>

              {/* ── Focal Person Info (Auto-filled) ── */}
              {selectedUni && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-5 bg-primary-50 rounded-2xl border border-primary-100 flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0"><UserCheck size={20}/></div>
                   <div>
                     <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">University Focal Person</p>
                     <p className="text-sm font-bold text-primary-900">{selectedUni.focal_person}</p>
                     <p className="text-xs text-primary-600 font-medium mt-0.5">{selectedUni.contact_number}</p>
                   </div>
                </motion.div>
              )}

              {/* ── Manual Fields for "Other" ── */}
              <AnimatePresence>
                {isOther && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-1 mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Institutional Metadata Required</p>
                    
                    <Field label="University Full Name" required error={errors.manual_institute} icon={Building}>
                      <input value={form.manual_institute} onChange={handle('manual_institute')} placeholder="Enter University Name" className="input-premium pl-12 bg-white" />
                    </Field>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Focal Person Name" required error={errors.focal_name} icon={User}>
                        <input value={form.focal_name} onChange={handle('focal_name')} className="input-premium pl-12 bg-white" />
                      </Field>
                      <Field label="Focal Contact" required error={errors.focal_contact} icon={Phone}>
                        <input value={form.focal_contact} onChange={handle('focal_contact')} className="input-premium pl-12 bg-white" />
                      </Field>
                    </div>
                    
                    <Field label="Focal Person Gmail" required error={errors.focal_email} icon={Mail}>
                      <input type="email" value={form.focal_email} onChange={handle('focal_email')} placeholder="focal@gmail.com" className="input-premium pl-12 bg-white" />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Department" required error={errors.department} icon={Layout}>
                  <select value={form.department} onChange={handle('department')} className="input-premium pl-12 appearance-none cursor-pointer">
                    <option value="">Select Dept</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </Field>
                <Field label="Registration No." required error={errors.reg_number} icon={GraduationCap}>
                  <input value={form.reg_number} onChange={handle('reg_number')} placeholder="FA23-XXX-001" className="input-premium pl-12" />
                </Field>
              </div>
            </div>

            {/* Competitions */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center"><Zap size={18}/></div>
                Select Competitions
              </h3>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-8 ml-11">Multiple Selection Allowed</p>
              
              {errors.competitions && <p className="mb-4 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-shake"><Info size={14}/> {errors.competitions}</p>}

              <div className="grid gap-3">
                {competitions.map(comp => {
                  const active = selectedIds.includes(comp.id);
                  return (
                    <button key={comp.id} type="button" onClick={() => toggleComp(comp.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                        active ? 'border-primary-500 bg-primary-50/20 shadow-sm' : 'border-gray-100 bg-white hover:border-primary-200'
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${active ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-200'}`}>
                          {active && <CheckCircle size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${active ? 'text-primary-700' : 'text-gray-900'}`}>{comp.title}</p>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mt-1">{comp.category}</p>
                        </div>
                      </div>
                      <span className={`font-black ${active ? 'text-primary-600' : 'text-gray-400'}`}>PKR {comp.fee}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 lg:sticky lg:top-28">
              <div className="bg-gray-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-xl shadow-gray-200">
                <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard size={100}/></div>
                <h4 className="font-bold text-sm mb-4 uppercase tracking-widest opacity-60">Payment Account</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Account Title</p>
                    <p className="font-bold">{settings.payment_account_title || 'CS Department'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Account Number</p>
                    <p className="font-black text-2xl tracking-tighter">{settings.payment_account || '000000000000'}</p>
                  </div>
                  <div className="pt-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold border border-white/20 whitespace-nowrap">
                      {settings.payment_account_name || 'HBL / Easypaisa'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <Field label="Transaction ID" required error={errors.transaction_id} icon={ShieldCheck}>
                   <input value={form.transaction_id} onChange={handle('transaction_id')} placeholder="TXN-XXXXXXX" className="input-premium pl-12" />
                </Field>
                <div className="text-[10px] text-gray-400 font-medium leading-relaxed px-1">
                   Transfer the total amount matching your selection below, then enter the ID. Verification is required.
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-6">
                 <div className="flex justify-between items-center px-1">
                    <p className="text-gray-500 font-bold text-sm">Total Payable</p>
                    <p className="font-black text-3xl text-primary-600 tracking-tighter">PKR {totalFee}</p>
                 </div>
                 
                 <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-5 shadow-lg shadow-primary-200 text-base font-bold">
                    {submitting ? 'Processing...' : 'Complete Registration'} <ArrowRight size={18} />
                 </button>
              </div>
            </div>
          </div>

        </form>
      </section>

      <Footer />
    </div>
  );
}