import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';
import MetricCard from '../components/common/MetricCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StudySessionModal from '../components/preparation/StudySessionModal';
import { studyService } from '../services/studyService';
import {
  Plus,
  BookOpen,
  Clock,
  CheckCircle,
  Calendar,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';

const SUBJECT_LIST = [
  'ALL',
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

export default function PreparationPage() {
  const { openMobileSidebar } = useOutletContext();

  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState({
    totalMinutes: 0,
    totalHours: 0,
    weeklyMinutes: 0,
    weeklyHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (subjectFilter !== 'ALL') params.subject = subjectFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [data, sum] = await Promise.all([
        studyService.getAll(params),
        studyService.getSummary(),
      ]);
      setSessions(data);
      setSummary(sum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [subjectFilter, startDate, endDate]);

  const handleToggleComplete = async (id) => {
    try {
      await studyService.toggleComplete(id);
      fetchSessions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await studyService.delete(deletingId);
      setSuccessMsg('Preparation session deleted.');
      setIsConfirmDeleteOpen(false);
      setDeletingId(null);
      fetchSessions();
    } catch (err) {
      setError(err.message);
    }
  };

  const completedCount = sessions.filter((s) => s.completed).length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Preparation Tracker"
        subtitle="Log coding sessions, Core Java &amp; JDBC concepts, and technical interview revision"
        onOpenMobileSidebar={openMobileSidebar}
        primaryAction={{
          label: 'Log Study Session',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            setEditingSession(null);
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

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title="Total Study Time"
            value={`${summary.totalHours} hrs`}
            subtitle={`${summary.totalMinutes} total minutes recorded`}
            icon={BookOpen}
            color="blue"
          />
          <MetricCard
            title="Prep This Week"
            value={`${summary.weeklyHours} hrs`}
            subtitle={`${summary.weeklyMinutes} mins this current week`}
            icon={Clock}
            color="indigo"
          />
          <MetricCard
            title="Sessions Completed"
            value={completedCount}
            subtitle={`Out of ${sessions.length} logged sessions`}
            icon={CheckCircle}
            color="emerald"
          />
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500/20 bg-white"
            >
              {SUBJECT_LIST.map((subj) => (
                <option key={subj} value={subj}>
                  {subj === 'ALL' ? 'All Subjects' : subj}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="From"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="To"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
            {(startDate || endDate || subjectFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSubjectFilter('ALL');
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Sessions Table */}
        {loading ? (
          <LoadingSpinner message="Loading study sessions..." />
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Preparation Sessions Logged"
            description="Consistency is key for Java technical interviews. Log your daily topics, practice problems, and study time here."
            actionLabel="+ Log First Study Session"
            onAction={() => {
              setEditingSession(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 w-12 text-center">Status</th>
                    <th className="px-4 py-3.5">Subject &amp; Topic</th>
                    <th className="px-4 py-3.5">Activity</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Duration</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(s.id)}
                          className="text-slate-400 hover:text-brand-600 transition-colors"
                          title="Toggle completion"
                        >
                          {s.completed ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                          {s.subject}
                        </span>
                        <p className={`font-semibold text-slate-900 ${s.completed ? '' : 'text-slate-700'}`}>
                          {s.topic}
                        </p>
                        {s.notes && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                            &ldquo;{s.notes}&rdquo;
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600 max-w-xs">
                        {s.activityDescription || '—'}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.studyDate}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs font-semibold text-slate-800 whitespace-nowrap">
                        {s.formattedDuration}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSession(s);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingId(s.id);
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
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      <StudySessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        session={editingSession}
        onSuccess={() => {
          setSuccessMsg(editingSession ? 'Session updated!' : 'New study session logged!');
          fetchSessions();
        }}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Study Session"
        message="Are you sure you want to delete this preparation session record?"
      />
    </div>
  );
}
