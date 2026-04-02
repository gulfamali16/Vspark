import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, CheckCircle, Clock } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [competitions, setCompetitions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    competition_id: '',
    first_place: '',
    first_place_info: '',
    first_university: '',
    second_place: '',
    second_place_info: '',
    second_university: '',
    third_place: '',
    third_place_info: '',
    third_university: '',
    result_description: '',
    result_image_url: '',
    cash_prize: '',
    is_published: false,
  });

  // Load competitions and results
  const loadData = async () => {
    setLoading(true);
    try {
      const { data: comps } = await supabase.from('competitions').select('id, title, color').eq('is_active', true);
      const lookup = {};
      comps?.forEach(c => { lookup[c.id] = c; });
      setCompetitions(lookup);

      const { data: res } = await supabase.from('competition_results').select('*').order('created_at', { ascending: false });
      setResults(res || []);
    } catch (err) {
      toast.error('Error loading data: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!formData.competition_id) {
      toast.error('Please select a competition');
      return;
    }
    if (!formData.first_place) {
      toast.error('Please enter 1st place winner');
      return;
    }

    try {
      if (selected?.id) {
        // Update existing
        await supabase.from('competition_results').update({
          ...formData,
          updated_at: new Date().toISOString(),
          announced_at: formData.is_published ? new Date().toISOString() : null,
        }).eq('id', selected.id);
        toast.success('Result updated!');
      } else {
        // Create new
        await supabase.from('competition_results').insert([{
          ...formData,
          announced_at: formData.is_published ? new Date().toISOString() : null,
        }]);
        toast.success('Result created!');
      }
      setSelected(null);
      setIsEditing(false);
      loadData();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await supabase.from('competition_results').delete().eq('id', id);
      toast.success('Result deleted');
      loadData();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  const startEdit = (result) => {
    setSelected(result);
    setFormData({
      competition_id: result.competition_id,
      first_place: result.first_place || '',
      first_place_info: result.first_place_info || '',
      first_university: result.first_university || '',
      second_place: result.second_place || '',
      second_place_info: result.second_place_info || '',
      second_university: result.second_university || '',
      third_place: result.third_place || '',
      third_place_info: result.third_place_info || '',
      third_university: result.third_university || '',
      result_description: result.result_description || '',
      result_image_url: result.result_image_url || '',
      cash_prize: result.cash_prize || '',
      is_published: result.is_published || false,
    });
    setIsEditing(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 2 }}>
              Competition <span style={{ color: '#ffd700' }}>Results</span>
            </h1>
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>
              Announce winners and publish competition results
            </p>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setIsEditing(true);
              setFormData({
                competition_id: '',
                first_place: '',
                first_place_info: '',
                first_university: '',
                second_place: '',
                second_place_info: '',
                second_university: '',
                third_place: '',
                third_place_info: '',
                third_university: '',
                result_description: '',
                result_image_url: '',
                cash_prize: '',
                is_published: false,
              });
            }}
            className="btn-neon btn-orange"
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}
          >
            <Plus size={15} /> New Result
          </button>
        </div>

        {/* Results List */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#8892b0' }}>Loading...</div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#8892b0' }}>
              No results announced yet. Create the first one!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {results.map(r => {
                const comp = competitions[r.competition_id];
                return (
                  <div
                    key={r.id}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${comp?.color || '#00d4ff'}25`,
                      borderLeft: `3px solid ${comp?.color || '#00d4ff'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#e8eaf6', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>
                        {comp?.title || `Competition #${r.competition_id}`}
                      </p>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#8892b0' }}>
                        <div>
                          <span style={{ color: '#ffd700', fontWeight: 600 }}>🥇</span> {r.first_place || '—'}
                        </div>
                        <div>
                          <span style={{ color: '#c0c0c0', fontWeight: 600 }}>🥈</span> {r.second_place || '—'}
                        </div>
                        <div>
                          <span style={{ color: '#cd7f32', fontWeight: 600 }}>🥉</span> {r.third_place || '—'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {r.is_published && (
                        <span style={{ padding: '4px 10px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', fontSize: '0.7rem', border: '1px solid rgba(0,255,136,0.3)', fontWeight: 600 }}>
                          <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} /> PUBLISHED
                        </span>
                      )}
                      {!r.is_published && (
                        <span style={{ padding: '4px 10px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', fontSize: '0.7rem', border: '1px solid rgba(255,107,0,0.3)', fontWeight: 600 }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> DRAFT
                        </span>
                      )}

                      <button
                        onClick={() => startEdit(r)}
                        style={{
                          width: 32,
                          height: 32,
                          background: 'rgba(0,212,255,0.1)',
                          border: '1px solid rgba(0,212,255,0.3)',
                          color: '#00d4ff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
                        }}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{
                          width: 32,
                          height: 32,
                          background: 'rgba(255,61,119,0.08)',
                          border: '1px solid rgba(255,61,119,0.25)',
                          color: '#ff3d77',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setIsEditing(false)}
        >
          <div
            className="glass"
            style={{
              width: '100%',
              maxWidth: 700,
              padding: '2.5rem',
              borderColor: 'rgba(0,212,255,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 2, color: '#e8eaf6' }}>
                {selected ? 'Edit Result' : 'New Result'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Competition Select */}
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  Competition *
                </label>
                <select
                  name="competition_id"
                  value={formData.competition_id}
                  onChange={handleInputChange}
                  disabled={!!selected}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    color: '#e8eaf6',
                    borderRadius: 4,
                    fontSize: '0.88rem',
                    cursor: selected ? 'not-allowed' : 'pointer',
                    opacity: selected ? 0.6 : 1,
                  }}
                >
                  <option value="">Select Competition</option>
                  {Object.entries(competitions).map(([id, comp]) => (
                    <option key={id} value={id}>
                      {comp.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 1st Place */}
              <div>
                <label style={{ display: 'block', color: '#ffd700', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  🥇 1st Place Winner *
                </label>
                <input
                  type="text"
                  name="first_place"
                  value={formData.first_place}
                  onChange={handleInputChange}
                  placeholder="e.g., Team Alpha / John Doe"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8 }}>
                  Additional Info (e.g., score, time)
                </label>
                <input
                  type="text"
                  name="first_place_info"
                  value={formData.first_place_info}
                  onChange={handleInputChange}
                  placeholder="Optional details"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8 }}>
                  University / Institution
                </label>
                <input
                  type="text"
                  name="first_university"
                  value={formData.first_university}
                  onChange={handleInputChange}
                  placeholder="e.g., MIT, Stanford University"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>

              {/* 2nd Place */}
              <div>
                <label style={{ display: 'block', color: '#c0c0c0', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  🥈 2nd Place Winner
                </label>
                <input
                  type="text"
                  name="second_place"
                  value={formData.second_place}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,192,192,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8 }}>
                  Additional Info
                </label>
                <input
                  type="text"
                  name="second_place_info"
                  value={formData.second_place_info}
                  onChange={handleInputChange}
                  placeholder="Optional details"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8 }}>
                  University / Institution
                </label>
                <input
                  type="text"
                  name="second_university"
                  value={formData.second_university}
                  onChange={handleInputChange}
                  placeholder="e.g., MIT, Stanford University"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>

              {/* 3rd Place */}
              <div>
                <label style={{ display: 'block', color: '#cd7f32', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  🥉 3rd Place Winner
                </label>
                <input
                  type="text"
                  name="third_place"
                  value={formData.third_place}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(205,127,50,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8 }}>
                  Additional Info
                </label>
                <input
                  type="text"
                  name="third_place_info"
                  value={formData.third_place_info}
                  onChange={handleInputChange}
                  placeholder="Optional details"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8 }}>
                  University / Institution
                </label>
                <input
                  type="text"
                  name="third_university"
                  value={formData.third_university}
                  onChange={handleInputChange}
                  placeholder="e.g., MIT, Stanford University"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  Result Description
                </label>
                <textarea
                  name="result_description"
                  value={formData.result_description}
                  onChange={handleInputChange}
                  placeholder="Add details about the competition, highlights, statistics..."
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem', minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  Result Image URL (optional)
                </label>
                <input
                  type="url"
                  name="result_image_url"
                  value={formData.result_image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>

              {/* Cash Prize */}
              <div>
                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', marginBottom: 8, fontWeight: 600 }}>
                  💰 Cash Prize or Reward
                </label>
                <input
                  type="text"
                  name="cash_prize"
                  value={formData.cash_prize}
                  onChange={handleInputChange}
                  placeholder="e.g., $5000, Rs. 50,000, Internship offer"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', borderRadius: 4, fontSize: '0.88rem' }}
                />
              </div>

              {/* Publish Checkbox */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#e8eaf6' }}>
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>Publish Result (visible on public website)</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(0,255,136,0.1)',
                  border: '2px solid #00ff88',
                  color: '#00ff88',
                  cursor: 'pointer',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: 2,
                  fontSize: '0.95rem',
                  borderRadius: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}
              >
                {selected ? 'Update Result' : 'Create Result'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,61,119,0.08)',
                  border: '2px solid #ff3d77',
                  color: '#ff3d77',
                  cursor: 'pointer',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: 2,
                  fontSize: '0.95rem',
                  borderRadius: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,119,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,61,119,0.08)'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
