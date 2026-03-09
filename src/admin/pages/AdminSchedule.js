import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Clock, MapPin, Users, Zap, Calendar } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const inputSt = {
  width: '100%', padding: '11px 13px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(0,212,255,0.2)',
  color: '#e8eaf6', fontFamily: 'Rajdhani,sans-serif',
  fontSize: '0.93rem', outline: 'none', marginBottom: '0.9rem',
};

// ── TAB: ROOMS ───────────────────────────────────────────────
function RoomsTab() {
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', capacity: 30, is_active: true });

  const load = () => supabase.from('rooms').select('*').order('name').then(({ data }) => setRooms(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name) { toast.error('Room name required'); return; }
    const payload = { ...form, capacity: parseInt(form.capacity) || 30 };
    const { error } = editing
      ? await supabase.from('rooms').update(payload).eq('id', editing)
      : await supabase.from('rooms').insert([payload]);
    if (error) { toast.error('Save failed'); return; }
    toast.success(editing ? 'Room updated!' : 'Room added!');
    setModal(false); setEditing(null); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    await supabase.from('rooms').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#00d4ff' }}>Rooms & Venues</h2>
        <button className="btn-neon" onClick={() => { setForm({ name: '', location: '', capacity: 30, is_active: true }); setEditing(null); setModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
          <Plus size={14} /> Add Room
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
        {rooms.map(room => (
          <div key={room.id} className="glass" style={{ padding: '1.25rem', borderLeft: `3px solid ${room.is_active ? '#00d4ff' : '#8892b0'}`, opacity: room.is_active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.15rem', letterSpacing: 2, color: '#e8eaf6' }}>{room.name}</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setForm(room); setEditing(room.id); setModal(true); }} style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer' }}><Edit2 size={13} /></button>
                <button onClick={() => del(room.id)} style={{ background: 'none', border: 'none', color: '#ff3d77', cursor: 'pointer' }}><Trash2 size={13} /></button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MapPin size={12} style={{ color: '#8892b0' }} />
              <span style={{ color: '#8892b0', fontSize: '0.82rem' }}>{room.location || '—'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={12} style={{ color: '#ffd700' }} />
              <span style={{ color: '#ffd700', fontSize: '0.85rem', fontFamily: 'JetBrains Mono' }}>Capacity: {room.capacity}</span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: 440, padding: '2rem', borderColor: 'rgba(0,212,255,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6' }}>{editing ? 'Edit' : 'Add'} Room</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['name', 'Room Name', 'text'], ['location', 'Location', 'text'], ['capacity', 'Capacity', 'number']].map(([k, l, t]) => (
              <div key={k}>
                <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>{l}</label>
                <input type={t} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputSt} />
              </div>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#8892b0', fontSize: '0.88rem', marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 'auto' }} />
              Active / Available
            </label>
            <button onClick={save} className="btn-neon" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <Save size={14} /> {editing ? 'Update' : 'Add'} Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TAB: TIME SLOTS ──────────────────────────────────────────
function TimeSlotsTab() {
  const [slots, setSlots] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label: '', start_time: '', end_time: '', event_date: '' });

  const load = () => supabase.from('time_slots').select('*').order('event_date').order('start_time').then(({ data }) => setSlots(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.label || !form.start_time || !form.end_time || !form.event_date) { toast.error('All fields required'); return; }
    const { error } = editing
      ? await supabase.from('time_slots').update(form).eq('id', editing)
      : await supabase.from('time_slots').insert([form]);
    if (error) { toast.error('Save failed'); return; }
    toast.success(editing ? 'Slot updated!' : 'Slot added!');
    setModal(false); setEditing(null); load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this time slot?')) return;
    await supabase.from('time_slots').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#00d4ff' }}>Time Slots</h2>
        <button className="btn-neon" onClick={() => { setForm({ label: '', start_time: '', end_time: '', event_date: '' }); setEditing(null); setModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
          <Plus size={14} /> Add Slot
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {slots.map(slot => (
          <div key={slot.id} className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Clock size={16} style={{ color: '#7c3aed' }} />
              <div>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.05rem', letterSpacing: 2, color: '#e8eaf6' }}>{slot.label}</p>
                <p style={{ color: '#8892b0', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>
                  {slot.event_date} · {slot.start_time} – {slot.end_time}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setForm(slot); setEditing(slot.id); setModal(true); }} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Edit2 size={12} /> Edit</button>
              <button onClick={() => del(slot.id)} style={{ background: 'rgba(255,61,119,0.08)', border: '1px solid rgba(255,61,119,0.2)', color: '#ff3d77', cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
        {slots.length === 0 && <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No time slots yet.</p>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: 440, padding: '2rem', borderColor: 'rgba(124,58,237,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6' }}>{editing ? 'Edit' : 'Add'} Time Slot</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['label', 'Slot Label', 'text'], ['event_date', 'Event Date', 'date'], ['start_time', 'Start Time', 'time'], ['end_time', 'End Time', 'time']].map(([k, l, t]) => (
              <div key={k}>
                <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>{l}</label>
                <input type={t} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputSt} />
              </div>
            ))}
            <button onClick={save} className="btn-neon" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', borderColor: '#7c3aed', color: '#7c3aed' }}>
              <Save size={14} /> {editing ? 'Update' : 'Add'} Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TAB: SCHEDULE ASSIGNMENTS ────────────────────────────────
function ScheduleTab() {
  const [schedules, setSchedules] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [regCounts, setRegCounts] = useState({});
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ competition_id: '', room_id: '', time_slot_id: '', max_capacity: '', notes: '' });

  const load = async () => {
    const [sched, comps, rm, sl, regs] = await Promise.all([
      supabase.from('schedules').select('*, competitions(title,fee,color), rooms(name,capacity,location), time_slots(label,start_time,end_time,event_date)'),
      supabase.from('competitions').select('*').eq('is_active', true),
      supabase.from('rooms').select('*').eq('is_active', true),
      supabase.from('time_slots').select('*').order('event_date').order('start_time'),
      supabase.from('registration_requests').select('competition_id, status').eq('status', 'approved'),
    ]);
    setSchedules(sched.data || []);
    setCompetitions(comps.data || []);
    setRooms(rm.data || []);
    setSlots(sl.data || []);

    // Count approved registrations per competition
    const counts = {};
    (regs.data || []).forEach(r => {
      counts[r.competition_id] = (counts[r.competition_id] || 0) + 1;
    });
    setRegCounts(counts);
  };

  useEffect(() => { load(); }, []);

  // Auto-suggest room based on registered count
  const autoAssign = () => {
    if (!form.competition_id) { toast.error('Select a competition first'); return; }
    const count = regCounts[parseInt(form.competition_id)] || 0;
    const suitable = rooms.filter(r => r.capacity >= count).sort((a, b) => a.capacity - b.capacity);
    if (suitable.length === 0) {
      toast.error(`No room fits ${count} students — largest is ${Math.max(...rooms.map(r => r.capacity))}`);
      return;
    }
    setForm({ ...form, room_id: String(suitable[0].id), max_capacity: String(suitable[0].capacity) });
    toast.success(`Auto-assigned: ${suitable[0].name} (capacity ${suitable[0].capacity}) for ${count} registered students`);
  };

  const save = async () => {
    if (!form.competition_id || !form.room_id || !form.time_slot_id) {
      toast.error('Competition, Room and Time Slot are required'); return;
    }
    const payload = {
      competition_id: parseInt(form.competition_id),
      room_id: parseInt(form.room_id),
      time_slot_id: parseInt(form.time_slot_id),
      max_capacity: parseInt(form.max_capacity) || 30,
      notes: form.notes || '',
    };
    const { error } = editing
      ? await supabase.from('schedules').update(payload).eq('id', editing)
      : await supabase.from('schedules').upsert([payload], { onConflict: 'competition_id' });
    if (error) { toast.error('Save failed: ' + error.message); return; }
    toast.success(editing ? 'Schedule updated!' : 'Schedule saved!');
    setModal(false); setEditing(null); load();
  };

  const del = async (id) => {
    if (!window.confirm('Remove this schedule?')) return;
    await supabase.from('schedules').delete().eq('id', id);
    toast.success('Removed'); load();
  };

  const unscheduled = competitions.filter(c => !schedules.find(s => s.competition_id === c.id));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#00d4ff' }}>Competition Schedule</h2>
        <button className="btn-neon" onClick={() => { setForm({ competition_id: '', room_id: '', time_slot_id: '', max_capacity: '', notes: '' }); setEditing(null); setModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
          <Plus size={14} /> Assign Schedule
        </button>
      </div>

      {/* Unscheduled warning */}
      {unscheduled.length > 0 && (
        <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1.25rem', background: 'rgba(255,107,0,0.07)', border: '1px solid rgba(255,107,0,0.25)', borderLeft: '3px solid #ff6b00' }}>
          <p style={{ color: '#ff6b00', fontSize: '0.85rem', fontFamily: 'JetBrains Mono' }}>
            ⚠ {unscheduled.length} competition{unscheduled.length > 1 ? 's' : ''} not yet scheduled: {unscheduled.map(c => c.title).join(', ')}
          </p>
        </div>
      )}

      {/* Schedule cards */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {schedules.map(s => {
          const regCount = regCounts[s.competition_id] || 0;
          const capacity = s.max_capacity || s.rooms?.capacity || 0;
          const pct = capacity > 0 ? Math.min(100, Math.round((regCount / capacity) * 100)) : 0;
          const fillColor = pct >= 90 ? '#ff3d77' : pct >= 70 ? '#ff6b00' : '#00ff88';

          return (
            <div key={s.id} className="glass" style={{ padding: '1.5rem', borderLeft: `3px solid ${s.competitions?.color || '#00d4ff'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.25rem', letterSpacing: 2, color: '#e8eaf6' }}>{s.competitions?.title}</h3>
                    <span style={{ padding: '2px 8px', background: `${s.competitions?.color || '#00d4ff'}20`, color: s.competitions?.color || '#00d4ff', fontSize: '0.68rem', fontFamily: 'JetBrains Mono', border: `1px solid ${s.competitions?.color || '#00d4ff'}40` }}>
                      PKR {s.competitions?.fee}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.5rem', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={13} style={{ color: '#8892b0', flexShrink: 0 }} />
                      <span style={{ color: '#e8eaf6', fontSize: '0.88rem' }}>{s.rooms?.name || '—'}</span>
                      <span style={{ color: '#8892b0', fontSize: '0.78rem' }}>({s.rooms?.location})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={13} style={{ color: '#8892b0', flexShrink: 0 }} />
                      <span style={{ color: '#e8eaf6', fontSize: '0.88rem' }}>{s.time_slots?.label}</span>
                      <span style={{ color: '#8892b0', fontSize: '0.78rem' }}>({s.time_slots?.start_time} – {s.time_slots?.end_time})</span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#8892b0', fontSize: '0.78rem', fontFamily: 'JetBrains Mono' }}>Registered: {regCount} / {capacity}</span>
                      <span style={{ color: fillColor, fontSize: '0.78rem', fontFamily: 'JetBrains Mono' }}>{pct}% full</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: fillColor, borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                  </div>

                  {s.notes && <p style={{ color: '#8892b0', fontSize: '0.82rem', marginTop: 8, fontStyle: 'italic' }}>Note: {s.notes}</p>}
                </div>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => { setForm({ competition_id: String(s.competition_id), room_id: String(s.room_id), time_slot_id: String(s.time_slot_id), max_capacity: String(s.max_capacity), notes: s.notes || '' }); setEditing(s.id); setModal(true); }} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => del(s.id)} style={{ background: 'rgba(255,61,119,0.08)', border: '1px solid rgba(255,61,119,0.2)', color: '#ff3d77', cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {schedules.length === 0 && <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No schedules assigned yet.</p>}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: 520, padding: '2rem', borderColor: 'rgba(0,212,255,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6' }}>{editing ? 'Edit' : 'Assign'} Schedule</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {/* Competition */}
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Competition *</label>
            <select value={form.competition_id} onChange={e => setForm({ ...form, competition_id: e.target.value, max_capacity: '' })} style={{ ...inputSt, cursor: 'pointer', appearance: 'none' }}>
              <option value="">Select Competition</option>
              {competitions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} — {regCounts[c.id] || 0} registered
                </option>
              ))}
            </select>

            {/* Auto-assign button */}
            {form.competition_id && (
              <button onClick={autoAssign} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', cursor: 'pointer', padding: '7px 14px', fontSize: '0.82rem', fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: '0.9rem' }}>
                <Zap size={13} /> Auto-suggest Room Based on Registrations
              </button>
            )}

            {/* Room */}
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Room *</label>
            <select value={form.room_id} onChange={e => { const r = rooms.find(rm => String(rm.id) === e.target.value); setForm({ ...form, room_id: e.target.value, max_capacity: r ? String(r.capacity) : form.max_capacity }); }} style={{ ...inputSt, cursor: 'pointer', appearance: 'none' }}>
              <option value="">Select Room</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name} — capacity {r.capacity}</option>
              ))}
            </select>

            {/* Time Slot */}
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Time Slot *</label>
            <select value={form.time_slot_id} onChange={e => setForm({ ...form, time_slot_id: e.target.value })} style={{ ...inputSt, cursor: 'pointer', appearance: 'none' }}>
              <option value="">Select Time Slot</option>
              {slots.map(s => (
                <option key={s.id} value={s.id}>{s.label} ({s.start_time} – {s.end_time})</option>
              ))}
            </select>

            {/* Max Capacity */}
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Max Capacity</label>
            <input type="number" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} placeholder="Auto-filled from room" style={inputSt} />

            {/* Notes */}
            <label style={{ display: 'block', color: '#8892b0', fontFamily: 'Bebas Neue', letterSpacing: 1, fontSize: '0.8rem', marginBottom: 4 }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={{ ...inputSt, resize: 'vertical' }} placeholder="e.g. Bring your own laptop" />

            <button onClick={save} className="btn-neon" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
              <Save size={14} /> {editing ? 'Update' : 'Save'} Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────
export default function AdminSchedule() {
  const [tab, setTab] = useState('schedule');

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'rooms',    label: 'Rooms',    icon: MapPin },
    { id: 'slots',    label: 'Time Slots', icon: Clock },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 2 }}>Schedule Manager</h1>
          <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>Manage rooms, time slots, and assign competitions to venues</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '2rem', borderBottom: '1px solid rgba(0,212,255,0.1)', paddingBottom: 0 }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '10px 22px', background: 'transparent', border: 'none',
              borderBottom: tab === id ? '2px solid #00d4ff' : '2px solid transparent',
              color: tab === id ? '#00d4ff' : '#8892b0', cursor: 'pointer',
              fontFamily: 'Bebas Neue', letterSpacing: 2, fontSize: '1rem',
              display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s',
            }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === 'schedule' && <ScheduleTab />}
        {tab === 'rooms'    && <RoomsTab />}
        {tab === 'slots'    && <TimeSlotsTab />}
      </main>
    </div>
  );
}