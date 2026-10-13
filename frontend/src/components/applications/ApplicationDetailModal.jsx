import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  ExternalLink,
  Mail,
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onEdit,
  onScheduleInterview,
}) {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{application.jobTitle}</h2>
            </div>
            <div className="flex items-center gap-2 text-slate-600 mt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-sm">{application.companyName}</span>
              {application.companyWebsite && (
                <a
                  href={application.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:text-brand-700 inline-flex items-center text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={application.status} />
            <StatusBadge status={application.workMode} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/70">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Applied Date</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{application.applicationDate}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Location</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{application.location || 'Not specified'}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Employment Type</span>
            <span className="font-medium text-slate-800">
              {application.employmentTypeLabel || 'Full-time'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Salary / CTC</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <IndianRupee className="w-4 h-4 text-slate-400" />
              <span>{application.salaryRange || 'Not disclosed'}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Recruiter</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <User className="w-4 h-4 text-slate-400" />
              <span>{application.recruiterName || 'None listed'}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Recruiter Email</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-800 truncate">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{application.recruiterEmail || 'None listed'}</span>
            </div>
          </div>
        </div>

        {/* Next Follow Up */}
        {application.nextFollowUpDate && (
          <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Next Follow-up scheduled for: <strong>{application.nextFollowUpDate}</strong></span>
            </div>
            {application.followUpCompleted ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                Pending
              </span>
            )}
          </div>
        )}

        {/* Job URL Link */}
        {application.jobUrl && (
          <div>
            <span className="text-xs text-slate-500 block mb-1">Job Posting Link</span>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-brand-600 hover:text-brand-700 underline flex items-center gap-1 break-all"
            >
              <span>{application.jobUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        )}

        {/* Notes */}
        <div>
          <span className="text-xs text-slate-500 block mb-1">Notes &amp; Preparation Log</span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-line leading-relaxed min-h-[60px]">
            {application.notes || 'No notes added yet.'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onScheduleInterview) onScheduleInterview(application);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
          >
            + Schedule Interview Round
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              Edit Application
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
