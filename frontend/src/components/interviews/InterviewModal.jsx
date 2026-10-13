import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { interviewService } from '../../services/interviewService';
import { applicationService } from '../../services/applicationService';

const INITIAL_FORM = {
  jobApplicationId: '',
  roundName: 'TECHNICAL',
  scheduledAt: '',
  interviewMode: 'ONLINE',
  meetingLink: '',
  location: '',
  status: 'SCHEDULED',
  notes: '',
};

export default function InterviewModal({
  isOpen,
  onClose,
  interview, // null for create, object for edit
  preselectedApplicationId = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch applications list to populate dropdown
    if (isOpen) {
      applicationService.getAll()
        .then((data) => setApplications(data))
        .catch((err) => console.error('Failed to load applications for dropdown', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (interview) {
      // Format scheduledAt to local input format: "YYYY-MM-DDTHH:MM"
      let formattedDate = '';
      if (interview.scheduledAt) {
        const dt = new Date(interview.scheduledAt);
        formattedDate = dt.toISOString().slice(0, 16);
      }
      setFormData({
        jobApplicationId: interview.jobApplicationId || '',
        roundName: interview.roundName || 'TECHNICAL',
        scheduledAt: formattedDate,
        interviewMode: interview.interviewMode || 'ONLINE',
        meetingLink: interview.meetingLink || '',
        location: interview.location || '',
        status: interview.status || 'SCHEDULED',
        notes: interview.notes || '',
      });
    } else {
      // Create new interview
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
      defaultDate.setHours(10, 0, 0, 0);

      setFormData({
        ...INITIAL_FORM,
        jobApplicationId: preselectedApplicationId ? String(preselectedApplicationId) : '',
        scheduledAt: defaultDate.toISOString().slice(0, 16),
      });
    }
    setErrors({});
    setServerError('');
  }, [interview, preselectedApplicationId, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.jobApplicationId) {
      errs.jobApplicationId = 'Please select a job application';
    }
    if (!formData.scheduledAt) {
      errs.scheduledAt = 'Interview date and time is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        jobApplicationId: Number(formData.jobApplicationId),
        // Ensure ISO format without trailing Z if using LocalDateTime
        scheduledAt: formData.scheduledAt.length === 16 ? formData.scheduledAt + ':00' : formData.scheduledAt,
      };

      let saved;
      if (interview && interview.id) {
        saved = await interviewService.update(interview.id, payload);
      } else {
        saved = await interviewService.create(payload);
      }
      onSuccess(saved);
      onClose();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={interview ? 'Edit Interview Round' : 'Schedule Interview Round'}
      maxWidth="max-w-xl"
    >
      {serverError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Application Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Linked Job Application <span className="text-rose-500">*</span>
          </label>
          <select
            name="jobApplicationId"
            value={formData.jobApplicationId}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm rounded-lg border ${
              errors.jobApplicationId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
            } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white`}
          >
            <option value="">Select a Company / Position</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.companyName} — {app.jobTitle}
              </option>
            ))}
          </select>
          {errors.jobApplicationId && (
            <p className="mt-1 text-xs text-rose-600">{errors.jobApplicationId}</p>
          )}
        </div>

        {/* Round Name & Scheduled At */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interview Round <span className="text-rose-500">*</span>
            </label>
            <select
              name="roundName"
              value={formData.roundName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="ASSESSMENT">Online Assessment</option>
              <option value="TECHNICAL">Technical Round</option>
              <option value="HR">HR Round</option>
              <option value="MANAGERIAL">Managerial Round</option>
              <option value="FINAL">Final Round</option>
              <option value="OTHER">Other Round</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date &amp; Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.scheduledAt ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white`}
            />
            {errors.scheduledAt && (
              <p className="mt-1 text-xs text-rose-600">{errors.scheduledAt}</p>
            )}
          </div>
        </div>

        {/* Mode & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interview Mode
            </label>
            <select
              name="interviewMode"
              value={formData.interviewMode}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="ONLINE">Online (Google Meet, Zoom, Teams)</option>
              <option value="IN_PERSON">In-Person Office Visit</option>
              <option value="PHONE">Phone Screening</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="RESCHEDULED">Rescheduled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Link / Location */}
        {formData.interviewMode === 'ONLINE' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting URL Link
            </label>
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/... or zoom.us/..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Office Location / Address / Room
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Electronic City Campus, Tower 3"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Round Preparation &amp; Interviewer Notes
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key topics to revise: Collections, SQL Joins, JDBC connection steps, project questions..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
          >
            {loading ? 'Saving...' : interview ? 'Update Interview' : 'Schedule Interview'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
