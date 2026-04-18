import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Info, Calendar, Settings } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    payment_account:'', payment_account_name:'', payment_account_title:'',
    site_email:'', event_date:'', event_venue:'', event_status:'upcoming',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) { const s = {}; data.forEach(r => { s[r.key] = r.value; }); setSettings(prev => ({ ...prev, ...s })); }
    });
  }, []);

  const upsert = async (key, value) => {
    await supabase.from('site_settings').upsert([{ key, value }], { onConflict: 'key' });
  };

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all(Object.entries(settings).map(([k, v]) => upsert(k, v)));
      toast.success('Settings saved!');
    } catch (e) { toast.error('Save failed'); }
    setSaving(false);
  };

  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div className="mb-5">
      <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      <input
        type={type} value={settings[k] || ''}
        onChange={e => setSettings({ ...settings, [k]: e.target.value })}
        placeholder={placeholder}
        className="admin-input"
      />
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main max-w-4xl">
        <div className="admin-page-header">
          <h1 className="admin-page-title flex items-center gap-3">
            <Settings size={22} className="text-primary-600" /> Site Settings
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Manage payment account, event details, and site configuration
          </p>
        </div>

        {/* Payment Settings */}
        <div className="admin-card mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400 rounded-l-2xl" />
          <h2 className="font-sora font-bold text-lg text-gray-900 flex items-center gap-3 mb-4 pl-4">
            <CreditCard size={20} className="text-yellow-500" /> Payment Account Settings
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-800 text-sm leading-relaxed">
              This account number is shown to students on the registration page. Students will transfer the fee here and provide the transaction ID. Update whenever your payment account changes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-6">
            <Field label="Account Number / JazzCash / EasyPaisa" k="payment_account" placeholder="03XX-XXXXXXX or IBAN" />
            <Field label="Bank / Service Name" k="payment_account_name" placeholder="JazzCash / HBL / Meezan Bank" />
            <Field label="Account Title (Name)" k="payment_account_title" placeholder="Muhammad Ali Khan" />
          </div>
        </div>

        {/* Event Settings */}
        <div className="admin-card mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 rounded-l-2xl" />
          <h2 className="font-sora font-bold text-lg text-gray-900 flex items-center gap-3 mb-6 pl-4">
            <Calendar size={20} className="text-primary-600" /> Event Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-x-6">
            <Field label="Event Date" k="event_date" type="date" />
            <Field label="Event Venue" k="event_venue" placeholder="COMSATS Vehari Campus, Hall A" />
            <div className="mb-5">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Event Status</label>
              <select
                value={settings.event_status || 'upcoming'}
                onChange={e => setSettings({ ...settings, event_status: e.target.value })}
                className="admin-input cursor-pointer"
              >
                <option value="upcoming">Upcoming</option>
                <option value="registration_open">Registration Open</option>
                <option value="registration_closed">Registration Closed</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Field label="Contact Email" k="site_email" type="email" placeholder="vspark@cuivehari.edu.pk" />
          </div>
        </div>

        <button onClick={save} className={`btn-primary text-base py-4 px-10 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </main>
    </div>
  );
}
