import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logos & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-6 mb-6">
              <img
                src="/images/csdep.png"
                alt="CS Department"
                className="h-16 w-auto object-contain drop-shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="w-px h-12 bg-gray-300"></div>
              <img
                src="/images/vspark.png"
                alt="VSpark"
                className="h-20 md:h-20 w-auto object-contain drop-shadow-sm"
              />
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 max-w-sm">
              COMSATS University Islamabad, Vehari Campus — CS Department's premier
              national-level innovation event. Connecting minds and shaping the future.
            </p>

            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: 'https://web.facebook.com/people/Department-of-Computer-Science-CUI-Vehari/61582504795576/' },
                { Icon: Instagram, href: 'https://www.instagram.com/comsats_vehari_official/' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sora font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[
                ['/', 'Home'],
                ['/competitions', 'Competitions'],
                ['/events', 'Events'],
                ['/highlights', 'Highlights'],
                ['/blogs', 'Blogs'],
                ['/department', 'CS Department'],
              ].map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  className="text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-transform inline-flex font-medium text-sm w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sora font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              {[
                [MapPin, 'CUI Vehari, Punjab, Pakistan'],
                [Mail, 'hodcs@cuivehari.edu.pk'],
                [Phone, '(067) 3602803'],
                [Globe, (
                  <a
                    href="http://ww2.comsats.edu.pk/cs_vhr"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary-600 transition-colors"
                  >
                    ww2.comsats.edu.pk/cs_vhr
                  </a>
                )],
              ].map(([Icon, text], i) => (
                <div key={i} className="flex gap-3 items-start text-sm">
                  <Icon size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} VSpark — COMSATS University Islamabad, Vehari Campus.
          </p>
          <Link
            to="/admin/login"
            className="text-gray-400 text-xs font-mono hover:text-primary-500 transition-colors"
          >
            Admin Panel Login
          </Link>
        </div>
      </div>
    </footer>
  );
}