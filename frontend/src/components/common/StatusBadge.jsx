import React from 'react';

const STATUS_CONFIGS = {
  // Application statuses
  WISHLIST: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Wishlist' },
  APPLIED: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Applied' },
  ASSESSMENT: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Assessment' },
  INTERVIEW: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Interview' },
  OFFER: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Offer' },
  REJECTED: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Rejected' },
  WITHDRAWN: { bg: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Withdrawn' },

  // Interview statuses
  SCHEDULED: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Scheduled' },
  COMPLETED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
  CANCELLED: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Cancelled' },
  RESCHEDULED: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Rescheduled' },

  // Work modes
  ON_SITE: { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: 'On-site' },
  HYBRID: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: 'Hybrid' },
  REMOTE: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Remote' },
};

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {config.label}
    </span>
  );
}
