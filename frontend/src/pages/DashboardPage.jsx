import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AlertMessage from '../components/common/AlertMessage';
import ApplicationModal from '../components/applications/ApplicationModal';
import ApplicationDetailModal from '../components/applications/ApplicationDetailModal';
import InterviewModal from '../components/interviews/InterviewModal';
import { dashboardService } from '../services/dashboardService';
import {
  Briefcase,
  Calendar,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const STATUS_COLORS = {
  WISHLIST: '#a855f7',
  APPLIED: '#3b82f6',
  ASSESSMENT: '#f59e0b',
  INTERVIEW: '#6366f1',
  OFFER: '#10b981',
  REJECTED: '#f43f5e',
  WITHDRAWN: '#94a3b8',
};

export default function DashboardPage() {
  const { openMobileSidebar } = useOutletContext();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewAppId, setInterviewAppId] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Format status counts for Recharts
  const statusChartData = summary?.statusCounts
    ? Object.entries(summary.statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          status,
          count,
          fill: STATUS_COLORS[status] || '#3b82f6',
        }))
    : [];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Job Search Dashboard"
        subtitle="Monitor applications, upcoming interviews, follow-ups, and preparation progress"
        onOpenMobileSidebar={openMobileSidebar}
        primaryAction={{
          label: 'Add Application',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => setIsAppModalOpen(true),
        }}
      />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {loading ? (
          <LoadingSpinner message="Calculating dashboard statistics from database..." />
        ) : !summary || summary.totalApplications === 0 ? (
          <div className="space-y-6">
            {/* Quick Metrics when empty */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard title="Total Applications" value="0" icon={Briefcase} color="blue" />
              <MetricCard title="This Week" value="0" icon={TrendingUp} color="indigo" />
              <MetricCard title="In Interview" value="0" icon={Calendar} color="amber" />
              <MetricCard title="Offers" value="0" icon={Award} color="emerald" />
              <MetricCard title="Follow-ups Due" value="0" icon={Clock} color="rose" />
              <MetricCard title="Study Hours" value={`${summary?.totalPreparationHours || 0}h`} icon={BookOpen} color="purple" />
            </div>

            <EmptyState
              icon={Briefcase}
              title="No Job Applications Tracked Yet"
              description="Welcome to JobTrack! Add your first job application to monitor interview rounds, schedule follow-ups, and review analytics."
              actionLabel="+ Add Your First Application"
              onAction={() => setIsAppModalOpen(true)}
            />
          </div>
        ) : (
          <>
            {/* 6 Key Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="Total Applications"
                value={summary.totalApplications}
                subtitle="All tracked positions"
                icon={Briefcase}
                color="blue"
              />
              <MetricCard
                title="This Week"
                value={summary.applicationsThisWeek}
                subtitle="Submitted recently"
                icon={TrendingUp}
                color="indigo"
              />
              <MetricCard
                title="In Interview"
                value={summary.interviewStageApplications}
                subtitle="Active discussions"
                icon={Calendar}
                color="amber"
              />
              <MetricCard
                title="Offers"
                value={summary.offersReceived}
                subtitle="Successful offers"
                icon={Award}
                color="emerald"
              />
              <MetricCard
                title="Follow-ups Due"
                value={summary.followUpsDue}
                subtitle="Overdue or due today"
                icon={Clock}
                color="rose"
              />
              <MetricCard
                title="Prep This Week"
                value={`${summary.preparationHoursThisWeek}h`}
                subtitle={`Total: ${summary.totalPreparationHours}h`}
                icon={BookOpen}
                color="purple"
              />
            </div>

            {/* Follow-up Alerts (Overdue / Today) */}
            {((summary.overdueFollowUps && summary.overdueFollowUps.length > 0) ||
              (summary.todayFollowUps && summary.todayFollowUps.length > 0)) && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Action Required: Follow-up Alerts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {summary.overdueFollowUps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-3 bg-white rounded-lg border border-rose-200 hover:border-rose-300 shadow-xs cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{app.companyName}</span>
                        <span className="text-slate-500 ml-1.5">({app.jobTitle})</span>
                        <p className="text-rose-600 mt-0.5">Overdue since: {app.nextFollowUpDate}</p>
                      </div>
                      <span className="text-brand-600 font-medium">View &rarr;</span>
                    </div>
                  ))}
                  {summary.todayFollowUps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 shadow-xs cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{app.companyName}</span>
                        <span className="text-slate-500 ml-1.5">({app.jobTitle})</span>
                        <p className="text-amber-700 mt-0.5 font-medium">Due Today!</p>
                      </div>
                      <span className="text-brand-600 font-medium">View &rarr;</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status Distribution */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Applications by Status</h3>
                    <p className="text-xs text-slate-500">Breakdown of current application pipeline</p>
                  </div>
                </div>
                {statusChartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="status"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                    No status distribution data
                  </div>
                )}
              </div>

              {/* Weekly Activity Trends */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Application Activity</h3>
                    <p className="text-xs text-slate-500">Weekly submission volume (last 4 weeks)</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={summary.weeklyActivity} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="weekLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#2563eb' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom 2 Columns: Recent Applications & Upcoming Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Recent Applications</h3>
                    <p className="text-xs text-slate-500">Last 5 submissions</p>
                  </div>
                  <button
                    onClick={() => navigate('/applications')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 flex-1">
                  {summary.recentApplications && summary.recentApplications.length > 0 ? (
                    summary.recentApplications.map((app) => (
                      <div
                        key={app.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedApp(app);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {app.companyName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {app.jobTitle} &bull; {app.applicationDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No applications recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Upcoming Interviews</h3>
                    <p className="text-xs text-slate-500">Scheduled rounds</p>
                  </div>
                  <button
                    onClick={() => navigate('/interviews')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Manage <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 flex-1">
                  {summary.upcomingInterviews && summary.upcomingInterviews.length > 0 ? (
                    summary.upcomingInterviews.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {item.companyName} — {item.roundNameLabel || item.roundName}
                          </p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-600" />
                            <span>{new Date(item.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span>{item.interviewModeLabel}</span>
                          </p>
                        </div>
                        <div className="shrink-0">
                          {item.meetingLink ? (
                            <a
                              href={item.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-md inline-flex items-center gap-1"
                            >
                              Join <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <StatusBadge status={item.status} />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No upcoming interviews scheduled.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Add/Edit Application Modal */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        application={null}
        onSuccess={() => fetchDashboard()}
      />

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        application={selectedApp}
        onEdit={(app) => {
          setSelectedApp(app);
          setIsAppModalOpen(true);
        }}
        onScheduleInterview={(app) => {
          setInterviewAppId(app.id);
          setIsInterviewModalOpen(true);
        }}
      />

      {/* Schedule Interview Modal */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        interview={null}
        preselectedApplicationId={interviewAppId}
        onSuccess={() => fetchDashboard()}
      />
    </div>
  );
}
