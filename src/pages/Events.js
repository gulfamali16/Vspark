import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader2, Megaphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('*').order('date'),
      supabase.from('site_settings').select('*'),
    ]).then(([ev, set]) => {
      setEvents(ev.data || []);
      const s = {};
      (set.data || []).forEach(r => { s[r.key] = r.value; });
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const statusColors = {
    upcoming: { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-700', dot: 'bg-primary-500', label: 'UPCOMING' },
    registration_open: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'REGISTRATION OPEN', animate: true },
    registration_closed: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500', label: 'REGISTRATION CLOSED' },
    ongoing: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'ONGOING' },
    completed: { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-600', dot: 'bg-gray-400', label: 'COMPLETED' },
  };

  const status = statusColors[settings.event_status] || statusColors.upcoming;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-primary-50 to-transparent">
        <span className="badge-premium mb-6">Event Schedule</span>
        <h1 className="font-sora font-black text-4xl md:text-6xl text-gray-900 mb-8">Events</h1>

        {/* Event Status Banner */}
        <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border ${status.bg} ${status.border} mb-6 shadow-sm`}>
          <span className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.animate ? 'animate-pulse' : ''}`} />
          <span className={`font-bold text-xs tracking-widest ${status.text}`}>{status.label}</span>
        </div>

        {settings.event_date && (
          <div className="flex justify-center gap-8 flex-wrap mt-4">
            <div className="flex items-center gap-2 text-gray-600 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span>{settings.event_date}</span>
            </div>
            {settings.event_venue && (
              <div className="flex items-center gap-2 text-gray-600 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>{settings.event_venue}</span>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="px-6 pb-32 flex-1 relative">
        <div className="max-w-4xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
               <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
               <p className="font-medium">Loading events...</p>
             </div>
          ) : events.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Events will be announced soon.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="hidden md:block absolute left-[120px] top-4 bottom-4 w-px bg-gray-200"></div>

              <div className="space-y-8">
                {events.map((ev, i) => {
                  const isPast = ev.date && new Date(ev.date) < new Date();
                  
                  return (

                    <motion.div 
                      key={ev.id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative flex flex-col md:flex-row gap-6 md:gap-12 p-8 md:p-10 bg-white rounded-2xl border transition-all ${
                        ev.is_main_event ? 'border-amber-400 shadow-glow bg-amber-50/10' :
                        isPast ? 'border-gray-200 opacity-60 bg-gray-50' : 'border-primary-100 shadow-sm hover:shadow-soft'
                      }`}
                    >
                      {/* Timeline Dot (Desktop) */}
                      {!isPast && (
                         <div className={`hidden md:flex absolute left-[108px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${ev.is_main_event ? 'bg-amber-100' : 'bg-primary-100'} items-center justify-center z-10 border-4 border-white`}>
                           <div className={`w-2.5 h-2.5 rounded-full ${ev.is_main_event ? 'bg-amber-500' : 'bg-primary-500'}`}></div>
                         </div>
                      )}

                      {/* Date block */}
                      <div className="md:w-32 flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between md:justify-center border-b md:border-b-0 border-gray-100 pb-4 md:pb-0">
                        <div className="text-center md:text-left">
                          <div className={`font-sora font-bold text-5xl md:text-6xl ${ev.is_main_event ? 'text-amber-600' : isPast ? 'text-gray-400' : 'text-primary-600'} leading-none mb-2`}>
                            {ev.date ? new Date(ev.date).getDate() : '—'}
                          </div>
                          <div className={`font-bold tracking-widest uppercase ${ev.is_main_event ? 'text-amber-700' : isPast ? 'text-gray-400' : 'text-gray-900'} text-sm`}>
                            {ev.date ? new Date(ev.date).toLocaleDateString('en-US', { month: 'short' }) : ''}
                          </div>
                          {ev.date && (
                             <div className="text-gray-500 text-xs mt-1 font-medium">
                               {new Date(ev.date).getFullYear()}
                             </div>
                          )}
                        </div>
                        
                        {/* Status Badges */}
                        {!isPast && (
                          <div className="md:hidden">
                            {ev.is_main_event ? (
                              <span className="badge-premium bg-amber-500 text-white border-transparent shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1"><Zap size={10} fill="currentColor" /> Main Event</span>
                            ) : i === 0 && (
                              <span className="badge-premium bg-primary-500 text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]">Next Event</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-4">
                          <h3 className={`font-sora font-semibold text-xl md:text-2xl ${isPast ? 'text-gray-700' : 'text-gray-900'}`}>{ev.title}</h3>
                          {ev.is_main_event && (
                            <span className="inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-widest animate-pulse">
                              <Zap size={10} fill="currentColor" /> Main Day
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6 font-medium bg-gray-50/50 p-3 sm:p-4 rounded-lg border border-gray-50 text-sm md:text-base">{ev.description}</p>
                        
                        <div className="flex flex-wrap gap-4">
                          {ev.time && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                              <Clock className={`w-4 h-4 ${isPast ? 'text-gray-400' : 'text-primary-500'}`} />
                              <span className="text-gray-600 text-sm font-medium">{ev.time}</span>
                            </div>
                          )}
                          {ev.venue && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                              <MapPin className={`w-4 h-4 ${isPast ? 'text-gray-400' : 'text-primary-500'}`} />
                              <span className="text-gray-600 text-sm font-medium">{ev.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}