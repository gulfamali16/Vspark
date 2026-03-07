import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// ============================================================
// PASTE YOUR EMAILJS IDS HERE
const EMAILJS_SERVICE_ID  = 'service_gzvzpnr';   // e.g. service_abc123
const EMAILJS_TEMPLATE_ID = 'template_5ucrbhb';  // e.g. template_xyz456
const EMAILJS_PUBLIC_KEY  = 'HpOhKt9TbldjRD-wn';   // e.g. aBcDeFgHiJkL
const SITE_URL            = 'https://vspark-omega.vercel.app';
// ============================================================

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);

  const load = () =>
    supabase
      .from('registration_requests')
      .select('*, competitions(title)')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setRegs(data || []);
        setFiltered(data || []);
      });

  useEffect(() => { load(); }, []);

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

  // Generate a random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = 'VSpark@';
    for (let i = 0; i < 6; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    return pass;
  };

  const updateStatus = async (id, status) => {
    setProcessing(true);

    if (status === 'approved') {
      try {
        const req = regs.find(r => r.id === id);
        const tempPass = generatePassword();

        // Step 1: Update database status
        const { error: dbErr } = await supabase
          .from('registration_requests')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            temp_password: tempPass,
          })
          .eq('id', id);

        if (dbErr) throw new Error('Database error: ' + dbErr.message);

        // Step 2: Send email via EmailJS
        let emailSent = false;
        try {
          const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_ID,
              user_id: EMAILJS_PUBLIC_KEY,
              template_params: {
                to_email:      req.email,
                student_name:  req.student_name,
                student_email: req.email,
                password:      tempPass,
                competition:   req.competitions?.title || 'VSpark',
                site_url:      SITE_URL,
              },
            }),
          });
          emailSent = emailRes.ok;
        } catch (emailErr) {
          console.error('EmailJS error:', emailErr);
        }

        // Step 3: Show credentials popup so you can create user in Supabase manually
        const message =
          `✅ APPROVED!\n\n` +
          `Now go to:\nSupabase → Authentication → Users → Add User\n\n` +
          `Email:    ${req.email}\n` +
          `Password: ${tempPass}\n\n` +
          `✅ Check "Auto Confirm User"\n` +
          `Then click Create.\n\n` +
          (emailSent
            ? `📧 Email was sent to student automatically!`
            : `⚠️ Email failed — manually send these credentials to the student.`);

        alert(message);

        toast.success(
          emailSent
            ? `✅ Approved! Email sent to ${req.email}`
            : `✅ Approved! Note the password — email failed.`
        );

        setSelected(null);
        load();

      } catch (err) {
        toast.error('Error: ' + err.message);
      }

    } else {
      // Reject
      const { error } = await supabase
        .from('registration_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        toast.error('Update failed');
      } else {
        toast.success('Request rejected');
        setSelected(null);
        load();
      }
    }

    setProcessing(false);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map(r => ({
        Name: r.student_name,
        Email: r.email,
        'Reg #': r.reg_number,
        Institute: r.institute,
        Department: r.department,
        Competition: r.competitions?.title || r.competition_id,
        Fee: r.fee_amount,
        TxnID: r.transaction_id,
        Status: r.status,
        Password: r.temp_password || '',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, 'VSpark_Registrations.xlsx');
  };

  const statusColor = s =>
    s === 'approved' ? '#00ff88' : s === 'rejected' ? '#ff3d77' : '#ff6b00';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 2 }}>
              Registration Requests
            </h1>
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>
              Review, approve or reject student registration requests
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
            <option value="rejected">Rejected</option>
          </select>
        </div>

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
                    {['#', 'Name', 'Email', 'Institute', 'Competition', 'Fee', 'TxnID', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '9px 10px', textAlign: 'left', fontFamily: 'Bebas Neue', letterSpacing: 1.5, color: '#00d4ff', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                      <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.78rem' }}>{i + 1}</td>
                      <td style={{ padding: '9px 10px', color: '#e8eaf6', fontWeight: 600, fontSize: '0.88rem' }}>{r.student_name}</td>
                      <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.email}</td>
                      <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.institute}</td>
                      <td style={{ padding: '9px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.competitions?.title || r.competition_id}</td>
                      <td style={{ padding: '9px 10px', color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>PKR {r.fee_amount}</td>
                      <td style={{ padding: '9px 10px', color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}>{r.transaction_id}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <span style={{ padding: '2px 8px', background: `${statusColor(r.status)}15`, color: statusColor(r.status), fontSize: '0.7rem', fontFamily: 'JetBrains Mono', border: `1px solid ${statusColor(r.status)}35` }}>
                          {r.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '9px 10px' }}>
                        <button onClick={() => setSelected(r)} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', cursor: 'pointer', padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Rajdhani', fontWeight: 600 }}>
                          <Eye size={12} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelected(null)}>
          <div className="glass" style={{ width: '100%', maxWidth: 580, padding: '2.5rem', borderColor: 'rgba(0,212,255,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 2, color: '#e8eaf6' }}>Review Request</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {[
              ['Student Name', selected.student_name],
              ['Email', selected.email],
              ['Phone', selected.phone || '—'],
              ['Reg Number', selected.reg_number],
              ['Institute', selected.institute],
              ['Department', selected.department],
              ['Competition', selected.competitions?.title || selected.competition_id],
              ['Registration Fee', `PKR ${selected.fee_amount}`],
              ['Transaction ID', selected.transaction_id],
              ['Status', selected.status?.toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '1rem', padding: '8px 0', borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
                <span style={{ color: '#8892b0', fontSize: '0.85rem', minWidth: 140 }}>{k}</span>
                <span style={{ color: '#e8eaf6', fontSize: '0.88rem', fontWeight: 600 }}>{v}</span>
              </div>
            ))}

            {selected.screenshot_url && (
              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ color: '#8892b0', fontSize: '0.85rem', marginBottom: 8 }}>Payment Screenshot:</p>
                <a href={selected.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#00d4ff', fontSize: '0.85rem', fontFamily: 'JetBrains Mono', wordBreak: 'break-all' }}>
                  {selected.screenshot_url}
                </a>
                <img src={selected.screenshot_url} alt="screenshot" style={{ width: '100%', marginTop: 8, border: '1px solid rgba(0,212,255,0.2)', maxHeight: 200, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
            )}

            {/* Approve / Reject buttons */}
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => updateStatus(selected.id, 'approved')}
                  disabled={processing}
                  style={{ flex: 1, padding: '13px', background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88', color: '#00ff88', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', opacity: processing ? 0.6 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}
                >
                  <CheckCircle size={16} />
                  {processing ? 'Processing...' : 'Approve & Send Credentials'}
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'rejected')}
                  disabled={processing}
                  style={{ flex: 1, padding: '13px', background: 'rgba(255,61,119,0.08)', border: '2px solid #ff3d77', color: '#ff3d77', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: processing ? 0.6 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,119,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,61,119,0.08)'}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}

            {/* Show credentials if already approved */}
            {selected.status === 'approved' && selected.temp_password && (
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.25)' }}>
                <p style={{ color: '#8892b0', fontSize: '0.82rem', marginBottom: 8 }}>Generated Credentials:</p>
                <p style={{ color: '#8892b0', fontSize: '0.82rem' }}>Email: <strong style={{ color: '#e8eaf6', fontFamily: 'JetBrains Mono' }}>{selected.email}</strong></p>
                <p style={{ color: '#8892b0', fontSize: '0.82rem', marginTop: 4 }}>Password: <strong style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '1rem' }}>{selected.temp_password}</strong></p>
                <p style={{ color: '#ffd700', fontSize: '0.78rem', marginTop: 10, fontFamily: 'JetBrains Mono' }}>
                  ⚠ Make sure this user exists in Supabase → Authentication → Users
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}