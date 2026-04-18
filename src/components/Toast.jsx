/**
 * Toast.jsx — Premium light-theme notification toast
 */
import React, { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position:'fixed', bottom:24, right:24,
      display:'flex', alignItems:'center', gap:12,
      padding:'14px 20px',
      background: type === 'success' ? '#18181B' : '#7F1D1D',
      color:'#fff',
      borderRadius:12,
      fontSize:'14px', fontWeight:500,
      boxShadow:'0 20px 40px rgba(0,0,0,0.2)',
      zIndex:9999,
      animation:'slideDown 0.3s ease',
      maxWidth:380,
      fontFamily:'var(--font-body)',
    }}>
      {type === 'success' ? <CheckCircle size={18} style={{ color:'#4ADE80', flexShrink:0 }} /> : <XCircle size={18} style={{ color:'#FCA5A5', flexShrink:0 }} />}
      <span style={{ flex:1 }}>{message}</span>
      <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)', padding:'2px 4px', borderRadius:4, display:'flex', alignItems:'center' }}>
        <X size={14}/>
      </button>
    </div>
  )
}
