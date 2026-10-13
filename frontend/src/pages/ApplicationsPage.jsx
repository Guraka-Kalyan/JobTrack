import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ApplicationModal from '../components/applications/ApplicationModal';
import ApplicationDetailModal from '../components/applications/ApplicationDetailModal';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import InterviewModal from '../components/interviews/InterviewModal';
import { applicationService } from '../services/applicationService';
import {
  Plus,
  Briefcase,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Clock,
  ArrowUpDown,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { openMobileSidebar } = useOutletContext();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering & Sorting state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    workMode: '',
    startDate: '',
    endDate: '',
    sortBy: 'applicationDate',
    sortDir: 'desc',
  });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Scheduling interview from application
  const [schedulingAppId, setSchedulingAppId] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.workMode) params.workMode = filters.workMode;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      params.sortBy = filters.sortBy;
      params.sortDir = filters.sortDir;

      const data = await applicationService.getAll(params);
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      workMode: '',
      startDate: '',
      endDate: '',
      sortBy: 'applicationDate',
      sortDir: 'desc',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await applicationService.delete(deletingId);
      setSuccessMsg('Job application deleted successfully.');
      setIsConfirmDeleteOpen(false);
      setDeletingId(null);
      fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Job Applications"
        subtitle="Manage and track company submissions, statuses, and recruiter contacts"
        onOpenMobileSidebar={openMobileSidebar}
        primaryAction={{
          label: 'Add Application',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            setEditingApp(null);
            setIsModalOpen(true);
          },
        }}
      />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-5">
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

        {/* Filter Toolbar */}
        <ApplicationFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Content Table / Cards */}
        {loading ? (
          <LoadingSpinner message="Loading applications from database..." />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No job applications match your criteria"
            description={
              filters.search || filters.status || filters.workMode
                ? 'Try adjusting your search filters to find what you are looking for.'
                : 'Start tracking your career journey by adding your first job application.'
            }
            actionLabel="+ Add Application"
            onAction={() => {
              setEditingApp(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Company &amp; Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Work Mode</th>
                    <th className="px-4 py-3.5 cursor-pointer select-none" onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        sortDir: prev.sortDir === 'desc' ? 'asc' : 'desc'
                      }));
                    }}>
                      <div className="flex items-center gap-1">
                        <span>Applied Date</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Follow-up</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{app.companyName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{app.jobTitle}</span>
                          {app.location && (
                            <>
                              <span className="text-slate-300">&bull;</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {app.location}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={app.workMode} />
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                        {app.applicationDate}
                      </td>

                      <td className="px-4 py-4 text-xs whitespace-nowrap">
                        {app.nextFollowUpDate ? (
                          <span className={`inline-flex items-center gap-1 font-medium ${
                            app.followUpCompleted
                              ? 'text-emerald-700'
                              : new Date(app.nextFollowUpDate) < new Date().setHours(0,0,0,0)
                              ? 'text-rose-600 font-semibold'
                              : 'text-amber-700'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {app.nextFollowUpDate}
                            {app.followUpCompleted && ' (Done)'}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setViewingApp(app);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingApp(app);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(app.id);
                              setIsConfirmDeleteOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{app.companyName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{app.jobTitle}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {app.applicationDate}
                    </span>
                    {app.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.location}
                      </span>
                    )}
                    <StatusBadge status={app.workMode} />
                  </div>

                  {app.nextFollowUpDate && (
                    <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-md flex items-center justify-between">
                      <span>Follow-up: {app.nextFollowUpDate}</span>
                      <span>{app.followUpCompleted ? 'Completed' : 'Pending'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setViewingApp(app);
                        setIsDetailOpen(true);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setEditingApp(app);
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(app.id);
                        setIsConfirmDeleteOpen(true);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {applications.length} applications</span>
              <span>Sorted by {filters.sortBy} ({filters.sortDir.toUpperCase()})</span>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApp(null);
        }}
        application={editingApp}
        onSuccess={() => {
          setSuccessMsg(editingApp ? 'Application updated successfully!' : 'New application created!');
          fetchApplications();
        }}
      />

      {/* Detail Modal */}
      <ApplicationDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingApp(null);
        }}
        application={viewingApp}
        onEdit={(app) => {
          setEditingApp(app);
          setIsModalOpen(true);
        }}
        onScheduleInterview={(app) => {
          setSchedulingAppId(app.id);
          setIsScheduleOpen(true);
        }}
      />

      {/* Schedule Interview Modal */}
      <InterviewModal
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setSchedulingAppId(null);
        }}
        interview={null}
        preselectedApplicationId={schedulingAppId}
        onSuccess={() => {
          setSuccessMsg('Interview round scheduled successfully!');
          fetchApplications();
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message="Are you sure you want to delete this job application? Any associated interview records will also be removed."
      />
    </div>
  );
}
