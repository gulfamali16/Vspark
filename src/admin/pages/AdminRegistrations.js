import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, XCircle, Eye, X, Clock, MessageCircle } from 'lucide-react';
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
const statusColor = s =>
  s === 'approved' ? '#00ff88' : s === 'rejected' ? '#ff3d77' : '#ff6b00';

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
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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

  const load = () =>
    supabase
      .from('registration_requests')
      .select('*, competitions(title, color)')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setRegs(data || []);
        setFiltered(data || []);
      });

  useEffect(() => { load(); loadComps(); }, []);

  const doFilter = (s, sf) => {
    setFiltered(
      regs.filter(r =>
        (r.student_name?.toLowerCase().includes(s.toLowerCase()) ||
          r.email?.toLowerCase().includes(s.toLowerCase())) &&
        (sf ? r.status === sf : true)
      )
    );
  };

  const handleSearch = e => { setSearch(e.target.value); doFilter(e.target.value, statusFilter); };
  const handleStatus = e => { setStatusFilter(e.target.value); doFilter(search, e.target.value); };

  // ── Approve entire request (all competitions) ────────────
  const approveAll = async (id) => {
    setProcessing(true);
    const req = regs.find(r => r.id === id);
    const tempPass = generatePassword();

    // Build statuses — all approved
    const compIds = req.competition_ids || [req.competition_id].filter(Boolean);
    const statuses = {};
    compIds.forEach(cid => { statuses[String(cid)] = 'approved'; });

    try {
      // Create Supabase Auth user
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

      // Update DB
      await supabase.from('registration_requests').update({
        status: 'approved',
        competition_statuses: statuses,
        approved_at: new Date().toISOString(),
        temp_password: tempPass,
      }).eq('id', id);

      // Send email
      let emailSent = false;
      try {
        const compNames = compIds.map(cid => competitions[cid]?.title || `Competition ${cid}`).join(', ');
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              to_email: req.email,
              student_name: req.student_name,
              student_email: req.email,
              password: tempPass,
              competition: compNames,
              site_url: SITE_URL,
            },
          }),
        });
        emailSent = res.ok;
      } catch (e) { console.error(e); }

      if (userCreated && emailSent) {
        toast.success(`✅ Approved! Email sent to ${req.email}`);
      } else {
        toast.success(`✅ Approved! Password: ${tempPass}`);
        if (!emailSent) alert(`Email failed.\n\nEmail: ${req.email}\nPassword: ${tempPass}\nLogin: ${SITE_URL}/login`);
        if (!userCreated) alert(`Create user manually in Supabase Auth:\nEmail: ${req.email}\nPassword: ${tempPass}`);
      }

      setSelected(null);
      load();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
    setProcessing(false);
  };

  // ── Reject entire request ────────────────────────────────
  const rejectAll = async (id) => {
    setProcessing(true);
    const req = regs.find(r => r.id === id);
    const compIds = req.competition_ids || [req.competition_id].filter(Boolean);
    const statuses = {};
    compIds.forEach(cid => { statuses[String(cid)] = 'rejected'; });

    await supabase.from('registration_requests').update({
      status: 'rejected',
      competition_statuses: statuses,
    }).eq('id', id);

    toast.success('Request rejected');
    setSelected(null);
    load();
    setProcessing(false);
  };

  // ── Update per-competition status ────────────────────────
  const updateCompStatus = async (reqId, compId, newStatus) => {
    const req = regs.find(r => r.id === reqId);
    const currentStatuses = req.competition_statuses || {};
    const updated = { ...currentStatuses, [String(compId)]: newStatus };

    // Compute overall status
    const vals = Object.values(updated);
    let overallStatus = 'pending';
    if (vals.every(v => v === 'approved')) overallStatus = 'approved';
    else if (vals.every(v => v === 'rejected')) overallStatus = 'rejected';
    else if (vals.some(v => v === 'approved')) overallStatus = 'partial';

    await supabase.from('registration_requests').update({
      competition_statuses: updated,
      status: overallStatus,
    }).eq('id', reqId);

    toast.success(`Competition ${newStatus}`);
    // Refresh selected
    const { data } = await supabase.from('registration_requests').select('*, competitions(title,color)').eq('id', reqId).single();
    setSelected(data);
    load();
  };

  // ── Excel export ─────────────────────────────────────────
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map(r => {
        const compIds = r.competition_ids || [r.competition_id].filter(Boolean);
        const compNames = compIds.map(id => competitions[id]?.title || id).join(' / ');
        return {
          Name:          r.student_name,
          Email:         r.email,
          'Reg #':       r.reg_number,
          Institute:     r.institute,
          Department:    r.department,
          Competitions:  compNames,
          'Total Fee':   r.total_fee || r.fee_amount,
          TxnID:         r.transaction_id,
          Status:        r.status,
          Password:      r.temp_password || '',
        };
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, 'VSpark_Registrations.xlsx');
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 2 }}>
              Registration Requests
            </h1>
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>
              Review requests · approve/reject all or individual competitions
            </p>
          </div>
          <button onClick={exportExcel} className="btn-neon btn-orange" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
            <Download size={15} /> Export Excel
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff' }} />
            <input value={search} onChange={handleSearch} placeholder="Search name or email..." style={{ paddingLeft: 36 }} />
          </div>
          <select value={statusFilter} onChange={handleStatus} style={{ minWidth: 160, cursor: 'pointer' }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="partial">Partial</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem', marginBottom: '1rem' }}>
            {filtered.length} of {regs.length} requests
          </p>
          {filtered.length === 0 ? (
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No requests found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                    {['#', 'Name', 'Email', 'Competitions', 'Total Fee', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '9px 10px', textAlign: 'left', fontFamily: 'Bebas Neue', letterSpacing: 1.5, color: '#00d4ff', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const compIds = r.competition_ids || [r.competition_id].filter(Boolean);
                    const compNames = compIds.map(id => competitions[id]?.title || `#${id}`).join(', ');
                    const fee = r.total_fee || r.fee_amount || 0;
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                        <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.78rem' }}>{i + 1}</td>
                        <td style={{ padding: '9px 10px', color: '#e8eaf6', fontWeight: 600, fontSize: '0.88rem' }}>{r.student_name}</td>
                        <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.email}</td>
                        <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.78rem', maxWidth: 200 }}>
                          <span title={compNames} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {compIds.length > 1
                              ? <span style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>{compIds.length} competitions</span>
                              : compNames
                            }
                          </span>
                        </td>
                        <td style={{ padding: '9px 10px', color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
                          PKR {fee.toLocaleString()}
                        </td>
                        <td style={{ padding: '9px 10px' }}>
                          <span style={{ padding: '2px 8px', background: `${statusColor(r.status)}15`, color: statusColor(r.status), fontSize: '0.7rem', fontFamily: 'JetBrains Mono', border: `1px solid ${statusColor(r.status)}35` }}>
                            {(r.status || 'PENDING').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '9px 10px' }}>
                          <button onClick={() => setSelected(r)} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', cursor: 'pointer', padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Rajdhani', fontWeight: 600 }}>
                            <Eye size={12} /> Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Modal ── */}
      {selected && (() => {
        const compIds = selected.competition_ids || [selected.competition_id].filter(Boolean);
        const statuses = selected.competition_statuses || {};
        const totalFee = selected.total_fee || selected.fee_amount || 0;
        const isPending = selected.status === 'pending' || selected.status === 'partial';

        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelected(null)}>
            <div className="glass" style={{ width: '100%', maxWidth: 620, padding: '2.5rem', borderColor: 'rgba(0,212,255,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 2, color: '#e8eaf6' }}>Review Request</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Student details */}
              {[
                ['Student Name',  selected.student_name],
                ['Email',         selected.email],
                ['Reg Number',    selected.reg_number],
                ['Institute',     selected.institute],
                ['Department',    selected.department],
                ['Transaction ID',selected.transaction_id],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '1rem', padding: '7px 0', borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
                  <span style={{ color: '#8892b0', fontSize: '0.84rem', minWidth: 140 }}>{k}</span>
                  <span style={{ color: '#e8eaf6', fontSize: '0.87rem', fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              {/* Phone with WhatsApp contact button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '7px 0', borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
                <span style={{ color: '#8892b0', fontSize: '0.84rem', minWidth: 140 }}>Phone</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                  <span style={{ color: '#e8eaf6', fontSize: '0.87rem', fontWeight: 600 }}>
                    {selected.phone || '—'}
                  </span>
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Contact via WhatsApp"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        background: 'rgba(34, 177, 76, 0.15)',
                        border: '1px solid rgba(34, 177, 76, 0.4)',
                        color: '#22b14c',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(34, 177, 76, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(34, 177, 76, 0.6)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(34, 177, 76, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(34, 177, 76, 0.4)';
                      }}
                    >
                      <MessageCircle size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Screenshot */}
              {selected.screenshot_url && (
                <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                  <p style={{ color: '#8892b0', fontSize: '0.82rem', marginBottom: 6 }}>Payment Screenshot:</p>
                  <a href={selected.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#00d4ff', fontSize: '0.8rem', fontFamily: 'JetBrains Mono', wordBreak: 'break-all' }}>
                    {selected.screenshot_url}
                  </a>
                  <img src={selected.screenshot_url} alt="screenshot" style={{ width: '100%', marginTop: 8, border: '1px solid rgba(0,212,255,0.2)', maxHeight: 180, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                </div>
              )}

              {/* ── Competitions with per-competition actions ── */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#00d4ff', fontSize: '1rem' }}>
                    Competitions ({compIds.length})
                  </h3>
                  <span style={{ color: '#ffd700', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: 1 }}>
                    Total: PKR {totalFee.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {compIds.map(cid => {
                    const comp = competitions[cid] || { title: `Competition #${cid}`, color: '#00d4ff', fee: 0 };
                    const compStatus = statuses[String(cid)] || 'pending';
                    const color = comp.color || '#00d4ff';
                    return (
                      <div key={cid} style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}25`, borderLeft: `3px solid ${color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#e8eaf6', fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{comp.title}</p>
                          <p style={{ color: '#ffd700', fontSize: '0.8rem', fontFamily: 'JetBrains Mono' }}>PKR {comp.fee?.toLocaleString()}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {/* Status badge */}
                          <span style={{ padding: '2px 8px', background: `${statusColor(compStatus)}15`, color: statusColor(compStatus), fontSize: '0.68rem', fontFamily: 'JetBrains Mono', border: `1px solid ${statusColor(compStatus)}30` }}>
                            {compStatus.toUpperCase()}
                          </span>
                          {/* Per-competition action buttons if overall is pending/partial */}
                          {isPending && (
                            <div style={{ display: 'flex', gap: 5 }}>
                              {compStatus !== 'approved' && (
                                <button
                                  onClick={() => updateCompStatus(selected.id, cid, 'approved')}
                                  disabled={processing}
                                  title="Approve this competition"
                                  style={{ width: 28, height: 28, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <CheckCircle size={13} />
                                </button>
                              )}
                              {compStatus !== 'rejected' && (
                                <button
                                  onClick={() => updateCompStatus(selected.id, cid, 'rejected')}
                                  disabled={processing}
                                  title="Reject this competition"
                                  style={{ width: 28, height: 28, background: 'rgba(255,61,119,0.08)', border: '1px solid rgba(255,61,119,0.25)', color: '#ff3d77', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <XCircle size={13} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bulk approve / reject buttons */}
              {isPending && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => approveAll(selected.id)}
                    disabled={processing}
                    style={{ flex: 1, padding: '13px', background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88', color: '#00ff88', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: processing ? 0.6 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}
                  >
                    <CheckCircle size={15} />
                    {processing ? 'Processing...' : 'Approve All & Send Credentials'}
                  </button>
                  <button
                    onClick={() => rejectAll(selected.id)}
                    disabled={processing}
                    style={{ flex: 1, padding: '13px', background: 'rgba(255,61,119,0.08)', border: '2px solid #ff3d77', color: '#ff3d77', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: processing ? 0.6 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,119,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,61,119,0.08)'}
                  >
                    <XCircle size={15} /> Reject All
                  </button>
                </div>
              )}

              {/* Show credentials if approved */}
              {selected.status === 'approved' && selected.temp_password && (
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.25)' }}>
                  <p style={{ color: '#00ff88', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '1rem', marginBottom: 10 }}>✅ Approved — Credentials</p>
                  <p style={{ color: '#8892b0', fontSize: '0.85rem', marginBottom: 4 }}>Email: <strong style={{ color: '#e8eaf6', fontFamily: 'JetBrains Mono' }}>{selected.email}</strong></p>
                  <p style={{ color: '#8892b0', fontSize: '0.85rem' }}>Password: <strong style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '1.05rem' }}>{selected.temp_password}</strong></p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}