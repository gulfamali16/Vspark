import React, { useEffect, useState } from 'react'
import { Save, Loader, Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const fields = [
  { key: 'event_date', label: 'Event Date', placeholder: 'e.g. December 10, 2025 (leave blank for "Not Announced")' },
  { key: 'event_venue', label: 'Event Venue', placeholder: 'COMSATS University Islamabad, Vehari Campus' },
  { key: 'event_time', label: 'Event Time', placeholder: 'e.g. 9:00 AM onwards' },
  { key: 'payment_account', label: 'Payment Account', placeholder: 'JazzCash: 0300-0000000 (Account Title: VSpark)' },
]

export default function AdminSettings() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('site_settings').select('key, value')
    if (data) {
      const v = {}
      data.forEach(r => { v[r.key] = r.value || '' })
      setValues(v)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      for (const field of fields) {
        await supabase.from('site_settings').upsert({
          key: field.key,
          value: values[field.key] || null,
          updated_at: new Date().toISOString(),
        })
      }
      setToast({ message: 'Settings saved successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err.message || 'Failed to save settings.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
      </div>
    )
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: 28 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure site-wide settings like event date, venue, and payment details.</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <Settings size={20} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>Site Settings</h3>
        </div>

        <form onSubmit={handleSave}>
          {fields.map(field => (
            <div key={field.key} className="form-group">
              <label>{field.label}</label>
              <input
                value={values[field.key] || ''}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <><Loader size={14} style={{ animation: 'rotate 0.8s linear infinite' }} /> Saving...</> : <><Save size={14} /> Save Settings</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
