import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { applicationService } from '../../services/applicationService';

const INITIAL_FORM = {
  companyName: '',
  jobTitle: '',
  status: 'APPLIED',
  workMode: 'HYBRID',
  employmentType: 'FULL_TIME',
  applicationDate: new Date().toISOString().split('T')[0],
  salaryRange: '',
  location: '',
  jobUrl: '',
  companyWebsite: '',
  recruiterName: '',
  recruiterEmail: '',
  nextFollowUpDate: '',
  followUpCompleted: false,
  notes: '',
};

export default function ApplicationModal({
  isOpen,
  onClose,
  application, // if provided, we are editing; if null, creating
  onSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName || '',
        jobTitle: application.jobTitle || '',
        status: application.status || 'APPLIED',
        workMode: application.workMode || 'HYBRID',
        employmentType: application.employmentType || 'FULL_TIME',
        applicationDate: application.applicationDate || new Date().toISOString().split('T')[0],
        salaryRange: application.salaryRange || '',
        location: application.location || '',
        jobUrl: application.jobUrl || '',
        companyWebsite: application.companyWebsite || '',
        recruiterName: application.recruiterName || '',
        recruiterEmail: application.recruiterEmail || '',
        nextFollowUpDate: application.nextFollowUpDate || '',
        followUpCompleted: Boolean(application.followUpCompleted),
        notes: application.notes || '',
      });
    } else {
      setFormData({
        ...INITIAL_FORM,
        applicationDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
    setServerError('');
  }, [application, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.companyName.trim()) {
      errs.companyName = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      errs.jobTitle = 'Job title is required';
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
      // Clean empty string dates to null for backend LocalDate parsing
      const payload = {
        ...formData,
        nextFollowUpDate: formData.nextFollowUpDate ? formData.nextFollowUpDate : null,
      };

      let saved;
      if (application && application.id) {
        saved = await applicationService.update(application.id, payload);
      } else {
        saved = await applicationService.create(payload);
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
      title={application ? 'Edit Job Application' : 'Add New Job Application'}
      maxWidth="max-w-2xl"
    >
      {serverError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core required fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Infosys, TCS, Amazon"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.companyName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-rose-600">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Java Developer Fresher"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.jobTitle ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            {errors.jobTitle && (
              <p className="mt-1 text-xs text-rose-600">{errors.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Status, Date, Work Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Application Status <span className="text-rose-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="WISHLIST">Wishlist</option>
              <option value="APPLIED">Applied</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Applied Date
            </label>
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
            </input>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Mode
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="HYBRID">Hybrid</option>
              <option value="ON_SITE">On-site</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
        </div>

        {/* Employment Type, Location, Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="FULL_TIME">Full-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
              <option value="PART_TIME">Part-time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore, Hyderabad"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Salary / CTC Range
            </label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g. ₹4.5 - ₹6 LPA"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Job URL, Company Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Posting URL
            </label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/jobs/..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Website
            </label>
            <input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://company.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Recruiter info & Follow-up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recruiter Name
            </label>
            <input
              type="text"
              name="recruiterName"
              value={formData.recruiterName}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recruiter Email
            </label>
            <input
              type="email"
              name="recruiterEmail"
              value={formData.recruiterEmail}
              onChange={handleChange}
              placeholder="recruiter@company.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Next Follow-up Date
            </label>
            <input
              type="date"
              name="nextFollowUpDate"
              value={formData.nextFollowUpDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            />
          </div>
        </div>

        {/* Follow up completed checkbox (only shown if follow up date exists) */}
        {formData.nextFollowUpDate && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="followUpCompleted"
              name="followUpCompleted"
              checked={formData.followUpCompleted}
              onChange={handleChange}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <label htmlFor="followUpCompleted" className="text-xs font-medium text-slate-700">
              Mark follow-up as completed
            </label>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Questions / Preparation Highlights
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add relevant notes: skills required, interview rounds mentioned, recruiter feedback..."
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
            {loading ? 'Saving...' : application ? 'Update Application' : 'Save Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
