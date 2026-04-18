import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, XCircle, Eye, X, Clock, MessageCircle, Building, Trophy, Filter } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// ── EmailJS Config ───────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_gzvzpnr';
const EMAILJS_TEMPLATE_ID = 'template_5ucrbhb';
const EMAILJS_PUBLIC_KEY  = 'HpOhKt9TbldjRD-wn';
const SITE_URL            = 'https://vspark-omega.vercel.app';

// ── Helpers ──────────────────────────────────────────────────
const statusBadge = s => {
  if (s === 'approved') return 'status-approved';
  if (s === 'rejected') return 'status-rejected';
  if (s === 'partial') return 'bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-bold rounded-lg';
  return 'status-pending';
};

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pass = 'VSpark@';
  for (let i = 0; i < 6; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
};

export default function AdminRegistrations() {
  const [regs, setRegs]               = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [competitions, setCompetitions] = useState({});  // id -> competition object
  const [unis, setUnis]               = useState([]);     // For university filter
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [uniFilter, setUniFilter]     = useState('');
  const [compFilter, setCompFilter]   = useState('');
  const [selected, setSelected]       = useState(null);
  const [processing, setProcessing]   = useState(false);

  // Load competitions lookup
  const loadComps = async () => {
    const { data } = await supabase.from('competitions').select('id, title, fee, color');
    if (data) {
      const lookup = {};
      data.forEach(c => { lookup[c.id] = c; });
      setCompetitions(lookup);
    }
  };

  // Load universities for filter
  const loadUnis = async () => {
    const { data } = await supabase.from('universities').select('name').order('name');
    if (data) {
      const names = [...new Set(data.map(u => u.name))];
      setUnis(names);
    }
  };

  const load = () =>
    supabase
      .from('registration_requests')
      .select('*, competitions(title, color)')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setRegs(data || []);
        applyFilters(data || [], search, statusFilter, uniFilter, compFilter);
      });

  useEffect(() => { load(); loadComps(); loadUnis(); }, []);

  const applyFilters = (data, s, sf, uf, cf) => {
    let result = [...data];

    // Search
    if (s) {
      const lowS = s.toLowerCase();
      result = result.filter(r => 
        r.student_name?.toLowerCase().includes(lowS) || 
        r.email?.toLowerCase().includes(lowS) ||
        r.institute?.toLowerCase().includes(lowS)
      );
    }

    // Status
    if (sf) result = result.filter(r => r.status === sf);

    // University
    if (uf) result = result.filter(r => r.institute === uf);

    // Competition
    if (cf) {
      const cid = parseInt(cf);
      result = result.filter(r => {
        const ids = r.competition_ids || [r.competition_id].filter(Boolean);
        return ids.includes(cid);
      });
    }

    setFiltered(result);
  };

  const handleSearch = e => { setSearch(e.target.value); applyFilters(regs, e.target.value, statusFilter, uniFilter, compFilter); };
  const handleStatus = e => { setStatusFilter(e.target.value); applyFilters(regs, search, e.target.value, uniFilter, compFilter); };
  const handleUniFilter = e => { setUniFilter(e.target.value); applyFilters(regs, search, statusFilter, e.target.value, compFilter); };
  const handleCompFilter = e => { setCompFilter(e.target.value); applyFilters(regs, search, statusFilter, uniFilter, e.target.value); };

  // ── Approve entire request (all competitions) ────────────
  const approveAll = async (id) => {
    setProcessing(true);
    const req = regs.find(r => r.id === id);
    const tempPass = generatePassword();
    const compIds = req.competition_ids || [req.competition_id].filter(Boolean);
    const statuses = {};
    compIds.forEach(cid => { statuses[String(cid)] = 'approved'; });

    try {
      let userCreated = false;
      try {
        const authRes = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.REACT_APP_SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ email: req.email, password: tempPass, email_confirm: true }),
        });
        const authData = await authRes.json();
        userCreated = authRes.ok || authData?.code === 'email_exists' || authData?.msg?.includes('already been registered');
      } catch (e) { console.error(e); }

      await supabase.from('registration_requests').update({
        status: 'approved',
        competition_statuses: statuses,
        approved_at: new Date().toISOString(),
        temp_password: tempPass,
      }).eq('id', id);

      let emailSent = false;
      try {
        const compNames = compIds.map(cid => competitions[cid]?.title || `Competition ${cid}`).join(', ');
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID, user_id: EMAILJS_PUBLIC_KEY,
            template_params: { to_email: req.email, student_name: req.student_name, student_email: req.email, password: tempPass, competition: compNames, site_url: SITE_URL },
          }),
        });
        emailSent = res.ok;
      } catch (e) { console.error(e); }

      if (userCreated && emailSent) { toast.success(`✅ Approved! Email sent to ${req.email}`); }
      else {
        toast.success(`✅ Approved! Password: ${tempPass}`);
        if (!emailSent) alert(`Email failed.\n\nEmail: ${req.email}\nPassword: ${tempPass}`);
      }
      setSelected(null); load();
    } catch (err) { toast.error('Error: ' + err.message); }
    setProcessing(false);
  };

  const rejectAll = async (id) => {
    setProcessing(true);
    const req = regs.find(r => r.id === id);
    const compIds = req.competition_ids || [req.competition_id].filter(Boolean);
    const statuses = {};
    compIds.forEach(cid => { statuses[String(cid)] = 'rejected'; });
    await supabase.from('registration_requests').update({ status: 'rejected', competition_statuses: statuses }).eq('id', id);
    toast.success('Request rejected'); setSelected(null); load(); setProcessing(false);
  };

  const updateCompStatus = async (reqId, compId, newStatus) => {
    const req = regs.find(r => r.id === reqId);
    const currentStatuses = req.competition_statuses || {};
    const updated = { ...currentStatuses, [String(compId)]: newStatus };
    const vals = Object.values(updated);
    let overallStatus = 'pending';
    if (vals.every(v => v === 'approved')) overallStatus = 'approved';
    else if (vals.every(v => v === 'rejected')) overallStatus = 'rejected';
    else if (vals.some(v => v === 'approved')) overallStatus = 'partial';
    await supabase.from('registration_requests').update({ competition_statuses: updated, status: overallStatus }).eq('id', reqId);
    toast.success(`Competition ${newStatus}`);
    const { data } = await supabase.from('registration_requests').select('*, competitions(title,color)').eq('id', reqId).single();
    setSelected(data); load();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map(r => {
        const compIds = r.competition_ids || [r.competition_id].filter(Boolean);
        const compNames = compIds.map(id => competitions[id]?.title || id).join(' / ');
        return {
          Name: r.student_name, Email: r.email, Phone: r.phone, 'Reg #': r.reg_number, Institute: r.institute, Dept: r.department, 
          'Focal Person': r.focal_person_name || '—', 'Focal Contact': r.focal_person_contact || '—',
          Competitions: compNames, 'Total Fee': r.total_fee || r.fee_amount, TxnID: r.transaction_id, Status: r.status
        };
      })
    );
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Registrations'); XLSX.writeFile(wb, 'VSpark_Registrations.xlsx');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">

        <div className="admin-page-header flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="admin-page-title">Registration Requests</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Review student requests and filter by university or competition</p>
          </div>
          <button onClick={exportExcel} className="btn-primary text-sm flex items-center gap-2">
            <Download size={16} /> Export Excel
          </button>
        </div>

        {/* ── Enhanced Filters ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative col-span-1 lg:col-span-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={handleSearch} placeholder="Search participant..." className="admin-input pl-11 w-full" />
          </div>
          
          <div className="flex items-center gap-2 lg:col-span-1">
            <Filter size={14} className="text-gray-400 flex-shrink-0" />
            <select value={statusFilter} onChange={handleStatus} className="admin-input cursor-pointer">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="partial">Partial</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2 lg:col-span-1">
            <Building size={14} className="text-gray-400 flex-shrink-0" />
            <select value={uniFilter} onChange={handleUniFilter} className="admin-input cursor-pointer">
              <option value="">All Universities</option>
              {unis.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 lg:col-span-1">
            <Trophy size={14} className="text-gray-400 flex-shrink-0" />
            <select value={compFilter} onChange={handleCompFilter} className="admin-input cursor-pointer">
              <option value="">All Competitions</option>
              {Object.values(competitions).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>

        <div className="admin-card">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            {filtered.length} Results Found
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400"><p className="font-medium">No results matching filters.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['#', 'Participant', 'University', 'Competitions', 'Total Fee', 'Status', 'Action'].map(h => (
                      <th key={h} className="admin-table-head whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r, i) => {
                    const compIds = r.competition_ids || [r.competition_id].filter(Boolean);
                    const compNames = compIds.map(id => competitions[id]?.title || `#${id}`).join(', ');
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="admin-table-cell text-gray-400">{i + 1}</td>
                        <td className="admin-table-cell">
                          <p className="font-bold text-gray-900">{r.student_name}</p>
                          <p className="text-[10px] text-gray-400">{r.email}</p>
                        </td>
                        <td className="admin-table-cell text-gray-600 font-medium">{r.institute}</td>
                        <td className="admin-table-cell max-w-[200px]">
                           <span className="text-primary-600 font-bold text-xs bg-primary-50 px-2 py-1 rounded-md">
                             {compIds.length} Event{compIds.length > 1 ? 's' : ''}
                           </span>
                        </td>
                        <td className="admin-table-cell font-bold text-gray-900 text-sm">PKR {r.total_fee || r.fee_amount || 0}</td>
                        <td className="admin-table-cell"><span className={statusBadge(r.status)}>{(r.status || 'PENDING').toUpperCase()}</span></td>
                        <td className="admin-table-cell"><button onClick={() => setSelected(r)} className="btn-outline text-xs py-1.5 px-3 whitespace-nowrap"><Eye size={13} /> Review</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selected && (() => {
        const compIds = selected.competition_ids || [selected.competition_id].filter(Boolean);
        const isPending = selected.status === 'pending' || selected.status === 'partial';

        return (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setSelected(null)}>
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-100">
                <h2 className="font-sora font-black text-xl text-gray-900">Review Application</h2>
                <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={20} /></button>
              </div>

              {/* Focal Person Info Header */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">University Focal Person</p>
                    <p className="font-bold text-primary-900">{selected.focal_person_name || 'N/A'}</p>
                 </div>
                 <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Focal Contact</p>
                    <p className="font-bold text-gray-900">{selected.focal_person_contact || 'N/A'}</p>
                 </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-4">
                {[
                  ['Student Name', selected.student_name],
                  ['University', selected.institute],
                  ['Email', selected.email],
                  ['Focal Email', selected.focal_person_email || '—'],
                  ['Reg #', selected.reg_number],
                  ['Txn ID', selected.transaction_id]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center border-b border-gray-100/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{k}</span>
                    <span className="text-gray-900 text-sm font-bold">{v}</span>
                  </div>
                ))}
              </div>

              {selected.screenshot_url && (
                <div className="mb-8">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Payment Verification</p>
                  <a href={selected.screenshot_url} target="_blank" rel="noreferrer" className="block relative h-40 group rounded-2xl overflow-hidden border-2 border-dashed border-gray-200">
                    <img src={selected.screenshot_url} alt="Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white text-xs font-bold">View Full Screenshot</p></div>
                  </a>
                </div>
              )}

              <h3 className="font-sora font-bold text-gray-900 mb-4 px-2">Selected Competitions</h3>
              <div className="space-y-3 mb-10">
                {compIds.map(cid => {
                  const comp = competitions[cid] || { title: `Comp #${cid}`, fee: 0 };
                  const cStatus = (selected.competition_statuses || {})[String(cid)] || 'pending';
                  return (
                    <div key={cid} className="flex justify-between items-center gap-4 p-5 bg-white rounded-2xl border-2 border-gray-50">
                      <div><p className="font-bold text-gray-900 text-sm">{comp.title}</p><p className="text-[10px] font-black text-gray-400 uppercase">PKR {comp.fee || 0}</p></div>
                      <div className="flex items-center gap-3">
                        <span className={statusBadge(cStatus)}>{cStatus.toUpperCase()}</span>
                        {isPending && (
                          <div className="flex gap-1.5">
                            <button onClick={() => updateCompStatus(selected.id, cid, 'approved')} disabled={processing} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle size={14}/></button>
                            <button onClick={() => updateCompStatus(selected.id, cid, 'rejected')} disabled={processing} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><XCircle size={14}/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isPending && (
                <div className="flex gap-4">
                  <button onClick={() => approveAll(selected.id)} disabled={processing} className="flex-1 btn-primary py-4 font-bold shadow-xl shadow-primary-200">
                    {processing ? 'Processing...' : 'Bulk Approve & Notify'}
                  </button>
                  <button onClick={() => rejectAll(selected.id)} disabled={processing} className="px-8 btn-outline border-red-200 text-red-500 hover:bg-red-50 transition-colors font-bold">Reject All</button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}