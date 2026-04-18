import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Clock, MapPin, Users, Zap, Calendar } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sora font-bold text-xl text-gray-900">Rooms &amp; Venues</h2>
        <button className="btn-primary text-sm" onClick={() => { setForm({ name: '', location: '', capacity: 30, is_active: true }); setEditing(null); setModal(true); }}>
          <Plus size={14} /> Add Room
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map(room => (
          <div key={room.id} className={`bg-white rounded-2xl border shadow-sm p-5 relative overflow-hidden ${room.is_active ? 'border-gray-100' : 'border-gray-100 opacity-50'}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{ background: room.is_active ? '#4F46E5' : '#9CA3AF' }} />
            <div className="flex justify-between items-start mb-3 pl-3">
              <h3 className="font-sora font-bold text-gray-900">{room.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setForm(room); setEditing(room.id); setModal(true); }} className="text-primary-500 hover:text-primary-700 transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => del(room.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="pl-3 space-y-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={13} /> {room.location || '—'}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Users size={13} className="text-primary-500" /> Capacity: {room.capacity}
              </div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && <p className="text-gray-400 text-sm font-medium col-span-4">No rooms added yet.</p>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-sora font-bold text-lg text-gray-900">{editing ? 'Edit' : 'Add'} Room</h3>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>
            {[['name', 'Room Name', 'text'], ['location', 'Location', 'text'], ['capacity', 'Capacity', 'number']].map(([k, l, t]) => (
              <div key={k} className="mb-4">
                <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{l}</label>
                <input type={t} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} className="admin-input" />
              </div>
            ))}
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600 mb-5">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
              Active / Available
            </label>
            <button onClick={save} className="btn-primary w-full justify-center py-3">
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sora font-bold text-xl text-gray-900">Time Slots</h2>
        <button className="btn-primary text-sm" onClick={() => { setForm({ label: '', start_time: '', end_time: '', event_date: '' }); setEditing(null); setModal(true); }}>
          <Plus size={14} /> Add Slot
        </button>
      </div>

      <div className="space-y-3">
        {slots.length === 0 && <p className="text-gray-400 text-sm font-medium">No time slots yet.</p>}
        {slots.map(slot => (
          <div key={slot.id} className="admin-card flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <Clock size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="font-sora font-bold text-gray-900">{slot.label}</p>
                <p className="text-gray-500 text-sm">{slot.event_date} · {slot.start_time} – {slot.end_time}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setForm(slot); setEditing(slot.id); setModal(true); }} className="btn-outline text-xs py-1.5 px-3"><Edit2 size={12} /> Edit</button>
              <button onClick={() => del(slot.id)} className="btn-danger text-xs py-1.5 px-3"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-sora font-bold text-lg text-gray-900">{editing ? 'Edit' : 'Add'} Time Slot</h3>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>
            {[['label', 'Slot Label', 'text'], ['event_date', 'Event Date', 'date'], ['start_time', 'Start Time', 'time'], ['end_time', 'End Time', 'time']].map(([k, l, t]) => (
              <div key={k} className="mb-4">
                <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{l}</label>
                <input type={t} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} className="admin-input" />
              </div>
            ))}
            <button onClick={save} className="btn-primary w-full justify-center py-3">
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
    const counts = {};
    (regs.data || []).forEach(r => { counts[r.competition_id] = (counts[r.competition_id] || 0) + 1; });
    setRegCounts(counts);
  };

  useEffect(() => { load(); }, []);

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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="font-sora font-bold text-xl text-gray-900">Competition Schedule</h2>
        <button className="btn-primary text-sm" onClick={() => { setForm({ competition_id: '', room_id: '', time_slot_id: '', max_capacity: '', notes: '' }); setEditing(null); setModal(true); }}>
          <Plus size={14} /> Assign Schedule
        </button>
      </div>

      {/* Unscheduled warning */}
      {unscheduled.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-400 rounded-2xl p-4 mb-6">
          <p className="text-orange-800 text-sm font-medium">
            ⚠ {unscheduled.length} competition{unscheduled.length > 1 ? 's' : ''} not yet scheduled: {unscheduled.map(c => c.title).join(', ')}
          </p>
        </div>
      )}

      {/* Schedule cards */}
      <div className="space-y-4">
        {schedules.length === 0 && <p className="text-gray-400 text-sm font-medium">No schedules assigned yet.</p>}
        {schedules.map(s => {
          const regCount = regCounts[s.competition_id] || 0;
          const capacity = s.max_capacity || s.rooms?.capacity || 0;
          const pct = capacity > 0 ? Math.min(100, Math.round((regCount / capacity) * 100)) : 0;
          const fillColor = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F97316' : '#10B981';

          return (
            <div key={s.id} className="admin-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{ background: s.competitions?.color || '#4F46E5' }} />
              <div className="flex justify-between items-start flex-wrap gap-4 pl-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="font-sora font-bold text-gray-900">{s.competitions?.title}</h3>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full border"
                      style={{ background: `${s.competitions?.color || '#4F46E5'}15`, color: s.competitions?.color || '#4F46E5', borderColor: `${s.competitions?.color || '#4F46E5'}30` }}>
                      PKR {s.competitions?.fee}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={13} className="text-gray-400" />
                      <span className="font-medium">{s.rooms?.name || '—'}</span>
                      <span className="text-gray-400 text-xs">({s.rooms?.location})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={13} className="text-gray-400" />
                      <span className="font-medium">{s.time_slots?.label}</span>
                      <span className="text-gray-400 text-xs">({s.time_slots?.start_time} – {s.time_slots?.end_time})</span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-xs">Registered: {regCount} / {capacity}</span>
                      <span className="text-xs font-bold" style={{ color: fillColor }}>{pct}% full</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: fillColor }} />
                    </div>
                  </div>
                  {s.notes && <p className="text-gray-400 text-xs mt-2 italic">Note: {s.notes}</p>}
                </div>

                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => { setForm({ competition_id: String(s.competition_id), room_id: String(s.room_id), time_slot_id: String(s.time_slot_id), max_capacity: String(s.max_capacity), notes: s.notes || '' }); setEditing(s.id); setModal(true); }} className="btn-outline text-xs py-1.5 px-3"><Edit2 size={12} /> Edit</button>
                  <button onClick={() => del(s.id)} className="btn-danger text-xs py-1.5 px-3"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-sora font-bold text-lg text-gray-900">{editing ? 'Edit' : 'Assign'} Schedule</h3>
              <button onClick={() => setModal(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>

            {/* Competition */}
            <div className="mb-4">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Competition *</label>
              <select value={form.competition_id} onChange={e => setForm({ ...form, competition_id: e.target.value, max_capacity: '' })} className="admin-input cursor-pointer">
                <option value="">Select Competition</option>
                {competitions.map(c => (
                  <option key={c.id} value={c.id}>{c.title} — {regCounts[c.id] || 0} registered</option>
                ))}
              </select>
            </div>

            {/* Auto-assign button */}
            {form.competition_id && (
              <button onClick={autoAssign} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold py-2 px-4 rounded-xl mb-4 hover:bg-emerald-100 transition-colors">
                <Zap size={13} /> Auto-suggest Room Based on Registrations
              </button>
            )}

            {/* Room */}
            <div className="mb-4">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Room *</label>
              <select value={form.room_id} onChange={e => { const r = rooms.find(rm => String(rm.id) === e.target.value); setForm({ ...form, room_id: e.target.value, max_capacity: r ? String(r.capacity) : form.max_capacity }); }} className="admin-input cursor-pointer">
                <option value="">Select Room</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} — capacity {r.capacity}</option>
                ))}
              </select>
            </div>

            {/* Time Slot */}
            <div className="mb-4">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Time Slot *</label>
              <select value={form.time_slot_id} onChange={e => setForm({ ...form, time_slot_id: e.target.value })} className="admin-input cursor-pointer">
                <option value="">Select Time Slot</option>
                {slots.map(s => (
                  <option key={s.id} value={s.id}>{s.label} ({s.start_time} – {s.end_time})</option>
                ))}
              </select>
            </div>

            {/* Max Capacity */}
            <div className="mb-4">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Max Capacity</label>
              <input type="number" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} placeholder="Auto-filled from room" className="admin-input" />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="admin-input resize-y" placeholder="e.g. Bring your own laptop" />
            </div>

            <button onClick={save} className="btn-primary w-full justify-center py-3">
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
    { id: 'schedule', label: 'Schedule',   icon: Calendar },
    { id: 'rooms',    label: 'Rooms',      icon: MapPin },
    { id: 'slots',    label: 'Time Slots', icon: Clock },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Schedule Manager</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage rooms, time slots, and assign competitions to venues</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-7 py-3.5 font-sora font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
                tab === id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
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