import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';
import MetricCard from '../components/common/MetricCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { dashboardService } from '../services/dashboardService';
import {
  Briefcase,
  Calendar,
  Award,
  BookOpen,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

const STATUS_COLORS = [
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#a855f7', // purple
  '#f43f5e', // rose
  '#94a3b8', // slate
];

export default function AnalyticsPage() {
  const { openMobileSidebar } = useOutletContext();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getAnalyticsOverview();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Format Status Distribution for Pie Chart
  const statusPieData = analytics?.statusDistribution
    ? Object.entries(analytics.statusDistribution)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status,
          value: count,
        }))
    : [];

  // Format Subject preparation data for Bar Chart
  const subjectChartData = analytics?.preparationBySubject || [];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Job Search &amp; Preparation Analytics"
        subtitle="Data-driven insights on applications, interview pipeline conversion, and study time"
        onOpenMobileSidebar={openMobileSidebar}
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
          <LoadingSpinner message="Aggregating performance analytics from MySQL..." />
        ) : !analytics ? (
          <div className="text-center py-12 text-slate-500">No analytics data available.</div>
        ) : (
          <>
            {/* Top Key Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MetricCard
                title="Total Applications"
                value={analytics.totalApplications}
                subtitle="All tracked submissions"
                icon={Briefcase}
                color="blue"
              />
              <MetricCard
                title="Interview Rounds"
                value={analytics.totalInterviews}
                subtitle="Total scheduled rounds"
                icon={Calendar}
                color="indigo"
              />
              <MetricCard
                title="Job Offers"
                value={analytics.totalOffers}
                subtitle="Offers received"
                icon={Award}
                color="emerald"
              />
              <MetricCard
                title="Follow-up Rate"
                value={`${analytics.followUpCompletionRate}%`}
                subtitle={`${analytics.followUpsCompleted} of ${analytics.followUpsTotal} completed`}
                icon={Clock}
                color="amber"
              />
              <MetricCard
                title="Total Study Hours"
                value={`${analytics.totalStudyHours} hrs`}
                subtitle={`${analytics.totalStudyMinutes} minutes total`}
                icon={BookOpen}
                color="purple"
              />
            </div>

            {/* Middle Section: Monthly Trend & Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Submissions */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Monthly Application Volume</h3>
                    <p className="text-xs text-slate-500">Submissions over the last 6 months</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.monthlyApplications || []} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Distribution Pie Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Application Pipeline Share</h3>
                    <p className="text-xs text-slate-500">Proportion of applications across stages</p>
                  </div>
                  <PieIcon className="w-4 h-4 text-brand-600" />
                </div>
                {statusPieData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {statusPieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                    No applications recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Preparation Hours by Subject */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Preparation Hours by Technical Subject</h3>
                  <p className="text-xs text-slate-500">Hours dedicated to Core Java, SQL, JDBC, Spring Boot, etc.</p>
                </div>
                <BookOpen className="w-4 h-4 text-brand-600" />
              </div>
              {subjectChartData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={subjectChartData}
                      margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" unit="h" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis
                        type="category"
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: '#334155' }}
                        width={90}
                      />
                      <Tooltip
                        formatter={(val) => [`${val} hours`, 'Hours Studied']}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <Bar dataKey="hours" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                  No preparation sessions logged yet. Log sessions in the Preparation Tracker!
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
