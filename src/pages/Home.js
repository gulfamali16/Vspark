import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronDown, Trophy, Code, Gamepad2, Palette,
  Zap, Brain, Star, ArrowRight, Users, Calendar,
  Award, Linkedin
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticlesBg from '../components/ParticlesBg';
import { supabase } from '../lib/supabase';

const stats = [
  { icon: Users, value: '500+', label: 'Participants' },
  { icon: Trophy, value: '20+', label: 'Awards' },
  { icon: Calendar, value: '1', label: 'Epic Day' },
  { icon: Award, value: '7+', label: 'Competitions' },
];

const compList = [
  { icon: Code, title: 'Speed Programming', fee: 300, color: 'bg-primary-500' },
  { icon: Gamepad2, title: 'E-Gaming', fee: 200, color: 'bg-indigo-500' },
  { icon: Code, title: 'Web Development', fee: 350, color: 'bg-orange-500' },
  { icon: Palette, title: 'UI/UX Design', fee: 250, color: 'bg-yellow-500' },
  { icon: Brain, title: 'Prompt Engineering', fee: 200, color: 'bg-emerald-500', isNew: true },
  { icon: Star, title: 'CS Quiz', fee: 150, color: 'bg-rose-500' },
  { icon: Palette, title: 'Poster Design', fee: 200, color: 'bg-cyan-500' },
];

// ── Team data ─────────────────────────────────────────────
const team = {
  lead: {
    name: 'Muhammad Abdullah',
    role: 'Team Lead',
    image: '/images/abdullah-sir.png',
    linkedin: 'https://www.linkedin.com/in/abdullahwale/',
  },
  developers: [
    {
      name: 'Gulfam Ali',
      role: 'Developer',
      image: '/images/gulfam-ali.png',
      linkedin: 'https://www.linkedin.com/in/gulfam-a1i/',
    },
    {
      name: 'Ali Hassan',
      role: 'Developer',
      image: '/images/ali-hassan.png',
      linkedin: 'https://www.linkedin.com/in/ali-hassan-45b9b53b0/',
    },
  ],
};

function TeamCard({ member, isLead = false }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`relative overflow-hidden rounded-2xl bg-white border ${isLead ? 'border-primary-200' : 'border-gray-100'} shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col items-center p-8`}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isLead ? 'bg-primary-500' : 'bg-gray-300'}`} />

      {isLead && (
        <span className="absolute top-4 right-4 badge-premium">
          TEAM LEAD
        </span>
      )}

      <div className={`w-28 h-28 rounded-full border-4 ${isLead ? 'border-primary-100' : 'border-gray-50'} overflow-hidden mb-6 flex-shrink-0 shadow-sm`}>
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span class="flex h-full w-full items-center justify-center bg-gray-100 font-sora font-bold text-3xl text-primary-500">${member.name.charAt(0)}</span>`;
          }}
        />
      </div>

      <h3 className="font-sora font-bold text-xl text-gray-900 mb-1 text-center">
        {member.name}
      </h3>
      <p className="text-sm font-semibold text-primary-600 tracking-wider uppercase mb-6">
        {member.role}
      </p>

      <a
        href={member.linkedin}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-colors text-sm font-medium"
      >
        <Linkedin size={16} /> LinkedIn
      </a>
    </motion.div>
  );
}

export default function Home() {
  const [mainEvent, setMainEvent] = useState(null);

  useEffect(() => {
    supabase.from('events').select('*').eq('is_main_event', true).maybeSingle()
      .then(({ data }) => setMainEvent(data));
  }, []);

  const eventDate = mainEvent ? new Date(mainEvent.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }) : 'December 10, 2025';

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ParticlesBg />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-gray-50 z-15" />
          <img
            src="/images/hero slider.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
            fetchpriority="high"
            loading="eager"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.3 }
              }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}>
              <h1 className="font-sora font-black text-5xl md:text-8xl lg:text-9xl tracking-tighter mb-4 text-white leading-none drop-shadow-2xl">
                <span className="text-primary-500">V</span>SPARK
              </h1>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="mb-8">
              <span className="inline-block px-4 py-2 bg-primary-600/20 backdrop-blur-md border border-primary-400/30 text-primary-200 rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase shadow-lg shadow-black/20">
                {eventDate} • {mainEvent?.venue || 'COMSATS University Islamabad'}
              </span>
            </motion.div>

            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="text-gray-200 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium drop-shadow-lg px-4">
              National-level coding competition and innovation showcase.
              <span className="block mt-2 text-primary-300">Speed programming, e-gaming, web dev, AI prompting and more.</span>
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/register" className="w-full sm:w-auto btn-primary px-10 py-5 text-xl bg-primary-600 hover:bg-primary-500 shadow-xl shadow-primary-900/30">
                Register Now
              </Link>
              <Link to="/competitions" className="w-full sm:w-auto px-10 py-5 text-xl font-sora font-bold text-white border-2 border-white/20 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm rounded-2xl transition-all">
                Explore Events
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center text-white/40"
          >
            <ChevronDown size={32} />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100 relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-50 text-primary-600 mb-4 shadow-sm">
                <Icon size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="font-sora font-black text-3xl md:text-5xl text-gray-900 mb-1 md:mb-2">{value}</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COMPETITIONS PREVIEW ─────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-premium mb-4">What to Expect</span>
            <h2 className="font-sora font-bold text-4xl md:text-5xl text-gray-900 mb-4">Competitions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Seven high-stakes categories — each with prizes and internship opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {compList.map(({ icon: Icon, title, fee, color, isNew }, i) => (
              <Link to="/competitions" key={i} className="group flex">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card-premium p-6 w-full relative flex flex-col justify-between"
                >
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out`} />

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary-50 transition-colors">
                      <Icon size={24} className="text-primary-600" />
                    </div>

                    <h3 className="font-sora font-bold text-xl text-gray-900 mb-4 line-clamp-2">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-4">
                    <span className="font-bold text-gray-900">PKR {fee}</span>
                    {isNew && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">NEW</span>}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/competitions" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 hover:gap-3 transition-all">
              View All Details <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERNSHIP ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-primary-50/50 border-y border-primary-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Zap size={200} />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-soft text-yellow-500 mb-8 mx-auto -translate-y-4">
            <Zap size={40} />
          </div>
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-gray-900 mb-6">Internship Program</h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Top performers unlock <span className="font-bold text-primary-600">exclusive internship opportunities</span>{' '}
            with industry partners. Your performance determines your career tomorrow.
          </p>
          <Link to="/register" className="btn-primary shadow-[0_0_40px_rgba(59,130,246,0.3)]">Register & Compete</Link>
        </div>
      </section>

      {/* ── DEVELOPMENT TEAM ─────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-premium mb-4">Built With 💙</span>
            <h2 className="font-sora font-bold text-4xl md:text-5xl text-gray-900 mb-4">Development Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The minds behind VSpark — building the platform that powers the competition
            </p>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-8 items-center">
            <div className="translate-y-8"><TeamCard member={team.developers[0]} /></div>
            <div className="-translate-y-4 relative z-10"><TeamCard member={team.lead} isLead /></div>
            <div className="translate-y-8"><TeamCard member={team.developers[1]} /></div>
          </div>

          <div className="lg:hidden flex flex-col gap-8 max-w-sm mx-auto">
            <TeamCard member={team.lead} isLead />
            <TeamCard member={team.developers[0]} />
            <TeamCard member={team.developers[1]} />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-primary-50 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-sora font-black text-4xl md:text-6xl text-gray-900 mb-6 tracking-tight">
            Ready to <span className="text-primary-600">Ignite</span> Your Potential?
          </h2>
          <p className="text-gray-600 text-xl mb-10">Register now and secure your spot at VSpark</p>
          <Link to="/register" className="btn-primary px-10 py-5 text-lg">Register Now</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}