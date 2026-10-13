import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { studyService } from '../../services/studyService';

const SUBJECT_OPTIONS = [
  'Core Java',
  'OOP',
  'Data Structures and Algorithms',
  'SQL',
  'JDBC',
  'Servlets',
  'Spring Boot',
  'React',
  'Aptitude',
  'Interview Preparation',
  'Projects',
  'Other',
];

const INITIAL_FORM = {
  studyDate: new Date().toISOString().split('T')[0],
  subject: 'Core Java',
  topic: '',
  durationMinutes: 60,
  completed: true,
  activityDescription: '',
  notes: '',
};

export default function StudySessionModal({
  isOpen,
  onClose,
  session,
  onSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (session) {
      setFormData({
        studyDate: session.studyDate || new Date().toISOString().split('T')[0],
        subject: session.subject || 'Core Java',
        topic: session.topic || '',
        durationMinutes: session.durationMinutes || 60,
        completed: session.completed !== undefined ? session.completed : true,
        activityDescription: session.activityDescription || '',
        notes: session.notes || '',
      });
    } else {
      setFormData({
        ...INITIAL_FORM,
        studyDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
    setServerError('');
  }, [session, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.studyDate) {
      errs.studyDate = 'Study date is required';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required';
    }
    if (!formData.topic.trim()) {
      errs.topic = 'Topic is required';
    }
    const mins = Number(formData.durationMinutes);
    if (!mins || mins < 1 || mins > 1440) {
      errs.durationMinutes = 'Duration must be between 1 and 1440 minutes';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        durationMinutes: Number(formData.durationMinutes),
      };

      let saved;
      if (session && session.id) {
        saved = await studyService.update(session.id, payload);
      } else {
        saved = await studyService.create(payload);
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
      title={session ? 'Edit Preparation Session' : 'Record Preparation Session'}
      maxWidth="max-w-xl"
    >
      {serverError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Study Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="studyDate"
              value={formData.studyDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.studyDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white`}
            />
            {errors.studyDate && (
              <p className="mt-1 text-xs text-rose-600">{errors.studyDate}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white`}
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>
            )}
          </div>
        </div>

        {/* Topic & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topic Covered <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g. HashMap vs ConcurrentHashMap, PreparedStatement in JDBC"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.topic ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            {errors.topic && (
              <p className="mt-1 text-xs text-rose-600">{errors.topic}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duration (Minutes) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="1440"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.durationMinutes ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {Math.floor(formData.durationMinutes / 60)}h {formData.durationMinutes % 60}m
            </p>
            {errors.durationMinutes && (
              <p className="mt-1 text-xs text-rose-600">{errors.durationMinutes}</p>
            )}
          </div>
        </div>

        {/* Activity Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Activity Description
          </label>
          <input
            type="text"
            name="activityDescription"
            value={formData.activityDescription}
            onChange={handleChange}
            placeholder="e.g. Solved 3 LeetCode problems, built JDBC CRUD demo, revised notes"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Key Takeaways &amp; Interview Tips
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Important questions asked in interviews, tricky corner cases remembered..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Completed checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <label htmlFor="completed" className="text-xs font-medium text-slate-700">
            Session completed successfully
          </label>
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
            {loading ? 'Saving...' : session ? 'Update Session' : 'Save Session'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
