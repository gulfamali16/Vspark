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
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">

        {/* Header */}
        <div className="admin-page-header flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="admin-page-title">Competition Results</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Announce winners and publish competition results</p>
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
            className="btn-primary text-sm"
          >
            <Plus size={15} /> New Result
          </button>
        </div>

        {/* Results List */}
        <div className="admin-card">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium">Loading...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 font-medium">No results announced yet. Create the first one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(r => {
                const comp = competitions[r.competition_id];
                return (
                  <div key={r.id} className="flex justify-between items-center gap-4 flex-wrap p-4 bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1.5 h-full rounded-l-xl" style={{ background: comp?.color || '#4F46E5' }} />
                    <div className="flex-1 pl-3">
                      <p className="font-sora font-bold text-gray-900 mb-2">
                        {comp?.title || `Competition #${r.competition_id}`}
                      </p>
                      <div className="flex gap-5 text-sm font-medium text-gray-600 flex-wrap">
                        <span>🥇 {r.first_place || '—'}</span>
                        <span>🥈 {r.second_place || '—'}</span>
                        <span>🥉 {r.third_place || '—'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {r.is_published
                        ? <span className="status-approved flex items-center gap-1"><CheckCircle size={12} /> PUBLISHED</span>
                        : <span className="status-pending flex items-center gap-1"><Clock size={12} /> DRAFT</span>
                      }
                      <button onClick={() => startEdit(r)} className="btn-outline text-xs py-1.5 px-3" title="Edit"><Edit size={13} /> Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="btn-danger text-xs py-1.5 px-3" title="Delete"><Trash2 size={13} /> Delete</button>
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
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={() => setIsEditing(false)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-sora font-bold text-xl text-gray-900">{selected ? 'Edit Result' : 'New Result'}</h2>
              <button onClick={() => setIsEditing(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Competition Select */}
              <div>
                <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Competition *</label>
                <select
                  name="competition_id" value={formData.competition_id} onChange={handleInputChange} disabled={!!selected}
                  className={`admin-input ${selected ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <option value="">Select Competition</option>
                  {Object.entries(competitions).map(([id, comp]) => (
                    <option key={id} value={id}>{comp.title}</option>
                  ))}
                </select>
              </div>

              {/* Place Winners */}
              {[
                { emoji: '🥇', label: '1st Place Winner *', field: 'first_place', infoField: 'first_place_info', uniField: 'first_university' },
                { emoji: '🥈', label: '2nd Place Winner', field: 'second_place', infoField: 'second_place_info', uniField: 'second_university' },
                { emoji: '🥉', label: '3rd Place Winner', field: 'third_place', infoField: 'third_place_info', uniField: 'third_university' },
              ].map(({ emoji, label, field, infoField, uniField }) => (
                <div key={field} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="block font-sora font-bold text-sm text-gray-700 mb-3">{emoji} {label}</label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 font-semibold mb-1.5">Team / Name</label>
                      <input type="text" name={field} value={formData[field]} onChange={handleInputChange} placeholder="e.g. Team Alpha" className="admin-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-semibold mb-1.5">Additional Info</label>
                      <input type="text" name={infoField} value={formData[infoField]} onChange={handleInputChange} placeholder="Score / time" className="admin-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-semibold mb-1.5">University</label>
                      <input type="text" name={uniField} value={formData[uniField]} onChange={handleInputChange} placeholder="Institution" className="admin-input text-sm" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Extra Fields */}
              <div>
                <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Result Description</label>
                <textarea name="result_description" value={formData.result_description} onChange={handleInputChange}
                  placeholder="Add details about the competition, highlights..." className="admin-input resize-y min-h-[100px]" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">Result Image URL</label>
                  <input type="url" name="result_image_url" value={formData.result_image_url} onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg" className="admin-input" />
                </div>
                <div>
                  <label className="block font-sora font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">💰 Cash Prize / Reward</label>
                  <input type="text" name="cash_prize" value={formData.cash_prize} onChange={handleInputChange}
                    placeholder="Rs. 50,000 / Internship offer" className="admin-input" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleInputChange} className="w-5 h-5" />
                <span className="font-sora font-bold text-gray-700 text-sm">Publish Result (visible on public website)</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary justify-center py-3">
                {selected ? 'Update Result' : 'Create Result'}
              </button>
              <button onClick={() => setIsEditing(false)} className="flex-1 btn-danger justify-center py-3">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
