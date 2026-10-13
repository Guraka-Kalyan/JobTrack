import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Clock,
  BookOpen,
  BarChart3,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Job Applications', path: '/applications', icon: Briefcase },
  { name: 'Interviews', path: '/interviews', icon: Calendar },
  { name: 'Follow-ups', path: '/follow-ups', icon: Clock },
  { name: 'Preparation Tracker', path: '/preparation', icon: BookOpen },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar({ onItemClick }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">JobTrack</span>
          <span className="block text-[10px] uppercase font-semibold text-brand-600 tracking-wider">
            Career Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User / Student Profile Widget */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">Java Developer Aspirant</p>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-brand-600" /> QSpiders Fresher
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
