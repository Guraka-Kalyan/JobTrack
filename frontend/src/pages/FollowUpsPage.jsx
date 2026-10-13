import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AlertMessage from '../components/common/AlertMessage';
import Modal from '../components/common/Modal';
import { applicationService } from '../services/applicationService';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building2,
  Mail,
  User,
  MessageSquare,
  Edit2,
} from 'lucide-react';

export default function FollowUpsPage() {
  const { openMobileSidebar } = useOutletContext();

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Follow-up date / note Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalCompleted, setModalCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await applicationService.getFollowUps();
      setFollowUps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Group applications
  const overdueList = followUps.filter(
    (a) => !a.followUpCompleted && a.nextFollowUpDate && a.nextFollowUpDate < todayStr
  );
  const todayList = followUps.filter(
    (a) => !a.followUpCompleted && a.nextFollowUpDate && a.nextFollowUpDate === todayStr
  );
  const upcomingList = followUps.filter(
    (a) => !a.followUpCompleted && a.nextFollowUpDate && a.nextFollowUpDate > todayStr
  );
  const completedList = followUps.filter((a) => Boolean(a.followUpCompleted));

  const handleToggleComplete = async (app) => {
    try {
      const newStatus = !app.followUpCompleted;
      await applicationService.updateFollowUp(app.id, {
        followUpCompleted: newStatus,
      });
      setSuccessMsg(`Follow-up marked as ${newStatus ? 'completed' : 'pending'}.`);
      fetchFollowUps();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (app) => {
    setSelectedApp(app);
    setModalDate(app.nextFollowUpDate || todayStr);
    setModalCompleted(Boolean(app.followUpCompleted));
    setModalNotes('');
    setIsEditModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSaving(true);
    try {
      await applicationService.updateFollowUp(selectedApp.id, {
        nextFollowUpDate: modalDate,
        followUpCompleted: modalCompleted,
        notes: modalNotes,
      });
      setSuccessMsg('Follow-up updated successfully.');
      setIsEditModalOpen(false);
      fetchFollowUps();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (title, count, items, badgeColor, icon) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
          {count}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 italic text-center">No applications in this category.</p>
      ) : (
        <div className="space-y-3">
          {items.map((app) => (
            <div
              key={app.id}
              className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 text-sm">{app.companyName}</h4>
                  <span className="text-xs text-slate-500">&bull; {app.jobTitle}</span>
                  <StatusBadge status={app.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Target: {app.nextFollowUpDate}
                  </span>
                  {app.recruiterName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {app.recruiterName}
                    </span>
                  )}
                  {app.recruiterEmail && (
                    <span className="flex items-center gap-1 truncate max-w-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {app.recruiterEmail}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(app)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    app.followUpCompleted
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {app.followUpCompleted ? 'Mark Pending' : 'Mark Done'}
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(app)}
                  className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-md"
                  title="Edit Date or Add Note"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Follow-ups"
        subtitle="Stay proactive with recruiters: keep track of thank-you emails and check-ins"
        onOpenMobileSidebar={openMobileSidebar}
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

        {loading ? (
          <LoadingSpinner message="Loading follow-up schedules..." />
        ) : followUps.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Follow-ups Configured"
            description="When adding or editing job applications, set a 'Next Follow-up Date' to track recruiter check-ins."
          />
        ) : (
          <div className="space-y-6">
            {/* Overdue */}
            {renderSection(
              'Overdue Follow-ups',
              overdueList.length,
              overdueList,
              'bg-rose-100 text-rose-700',
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}

            {/* Due Today */}
            {renderSection(
              'Due Today',
              todayList.length,
              todayList,
              'bg-amber-100 text-amber-800',
              <Clock className="w-4 h-4 text-amber-600" />
            )}

            {/* Upcoming */}
            {renderSection(
              'Upcoming Follow-ups',
              upcomingList.length,
              upcomingList,
              'bg-blue-100 text-blue-700',
              <Calendar className="w-4 h-4 text-blue-600" />
            )}

            {/* Completed */}
            {renderSection(
              'Completed Follow-ups',
              completedList.length,
              completedList,
              'bg-emerald-100 text-emerald-700',
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            )}
          </div>
        )}
      </main>

      {/* Edit Follow-up Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Follow-up: ${selectedApp?.companyName || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Next Follow-up Date
            </label>
            <input
              type="date"
              value={modalDate}
              onChange={(e) => setModalDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500/20 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="modalDone"
              checked={modalCompleted}
              onChange={(e) => setModalCompleted(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300"
            />
            <label htmlFor="modalDone" className="text-xs font-medium text-slate-700">
              Mark follow-up as completed
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add Follow-up Note (appended to application log)
            </label>
            <textarea
              rows="3"
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder="e.g. Sent email to HR asking about assessment result; recruiter replied interview next Monday..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Follow-up'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
