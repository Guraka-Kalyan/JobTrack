import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import InterviewModal from '../components/interviews/InterviewModal';
import { interviewService } from '../services/interviewService';
import {
  Plus,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export default function InterviewsPage() {
  const { openMobileSidebar } = useOutletContext();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      let data = [];
      if (activeTab === 'upcoming') {
        data = await interviewService.getUpcoming();
      } else if (activeTab === 'past') {
        data = await interviewService.getPast();
      } else {
        data = await interviewService.getAll();
      }
      setInterviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [activeTab]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await interviewService.updateStatus(id, status);
      setSuccessMsg(`Interview status marked as ${status.toLowerCase()}`);
      fetchInterviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await interviewService.delete(deletingId);
      setSuccessMsg('Interview round deleted successfully.');
      setIsConfirmDeleteOpen(false);
      setDeletingId(null);
      fetchInterviews();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Interviews"
        subtitle="Schedule and track technical, HR, and managerial rounds"
        onOpenMobileSidebar={openMobileSidebar}
        primaryAction={{
          label: 'Schedule Interview',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            setEditingInterview(null);
            setIsModalOpen(true);
          },
        }}
      />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {successMsg && (
          <AlertMessage
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg('')}
          />
        )}
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Upcoming Interviews
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'past'
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Past Rounds
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Interviews
          </button>
        </div>

        {/* List of interviews */}
        {loading ? (
          <LoadingSpinner message="Loading scheduled interviews..." />
        ) : interviews.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={activeTab === 'upcoming' ? 'No Upcoming Interviews Scheduled' : 'No Interviews Found'}
            description="Keep applying and preparing! When companies reach out with interview dates, schedule your rounds here."
            actionLabel="+ Schedule an Interview"
            onAction={() => {
              setEditingInterview(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map((item) => {
              const dt = new Date(item.scheduledAt);
              const isPast = dt < new Date();

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{item.companyName}</h4>
                        <p className="text-xs text-slate-500">{item.jobTitle}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Round & Mode Badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.roundNameLabel || item.roundName}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {item.interviewModeLabel || item.interviewMode}
                      </span>
                    </div>

                    {/* Schedule Time */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>
                        {dt.toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Location or Meeting link */}
                    {item.meetingLink && (
                      <div className="text-xs">
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium underline break-all"
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Join Meeting Room</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}
                    {item.location && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="text-xs text-slate-600 bg-slate-50/70 p-2 rounded border border-slate-100 line-clamp-3">
                        <strong className="text-slate-700 block mb-0.5">Prep Notes:</strong>
                        {item.notes}
                      </div>
                    )}
                  </div>

                  {/* Footer Action buttons */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      {item.status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'COMPLETED')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Done
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'CANCELLED')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                            title="Cancel Interview"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingInterview(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(item.id);
                          setIsConfirmDeleteOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Schedule/Edit Modal */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInterview(null);
        }}
        interview={editingInterview}
        onSuccess={() => {
          setSuccessMsg(editingInterview ? 'Interview updated!' : 'Interview scheduled!');
          fetchInterviews();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Interview Round"
        message="Are you sure you want to delete this scheduled interview record?"
      />
    </div>
  );
}
