import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import {
  Activity,
  Database,
  Cpu,
  Layers,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Sparkles,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Info,
  Users,
  FilePlus,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  MessageSquare,
  Clock,
  ShieldCheck,
  Check,
  Filter
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'feedback' | 'templates'>('analytics');

  const [health, setHealth] = useState<any | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Users & Feedback states
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [feedbackTickets, setFeedbackTickets] = useState<any[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<'ALL' | 'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  // Analytics states
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [overview, setOverview] = useState<any | null>(null);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [templateStats, setTemplateStats] = useState<any[]>([]);
  const [aiStats, setAiStats] = useState<any | null>(null);

  const fetchSystemData = async () => {
    try {
      const [hRes, tRes, uRes, fRes] = await Promise.all([
        apiClient.getHealth().catch(() => null),
        apiClient.getTemplates({ status: 'all' }).catch(() => ({ templates: [] })),
        apiClient.getAdminUsers().catch(() => ({ users: [] })),
        apiClient.getAdminFeedback().catch(() => ({ feedbacks: [] }))
      ]);
      setHealth(hRes);
      setTemplates(Array.isArray(tRes?.templates) ? tRes.templates : []);
      setRegisteredUsers(Array.isArray(uRes?.users) ? uRes.users : []);
      setFeedbackTickets(Array.isArray(fRes?.feedbacks) ? fRes.feedbacks : []);
    } catch (e) {
      console.error('Failed to fetch system data:', e);
    }
  };

  const fetchAnalyticsData = async (range: 'today' | '7d' | '30d' | '90d') => {
    setAnalyticsLoading(true);
    try {
      const [ovRes, tsRes, tmRes, aiRes] = await Promise.all([
        apiClient.getAnalyticsOverview(range).catch(() => null),
        apiClient.getAnalyticsTimeseries(range).catch(() => ({ series: [] })),
        apiClient.getAnalyticsTemplates(range).catch(() => ({ templates: [] })),
        apiClient.getAnalyticsAi(range).catch(() => null)
      ]);

      setOverview(ovRes);
      setTimeseries(Array.isArray(tsRes?.series) ? tsRes.series : []);
      setTemplateStats(Array.isArray(tmRes?.templates) ? tmRes.templates : []);
      setAiStats(aiRes);
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchSystemData(), fetchAnalyticsData(dateRange)]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleRangeChange = (newRange: 'today' | '7d' | '30d' | '90d') => {
    setDateRange(newRange);
    fetchAnalyticsData(newRange);
  };

  const handleToggleStatus = async (templateId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiClient.updateTemplate(templateId, { status: nextStatus });
      setTemplates(prev =>
        prev.map(t => (t.id === templateId ? { ...t, status: nextStatus } : t))
      );
    } catch {
      alert('Failed to update template status.');
    }
  };

  const handleTogglePopular = async (templateId: string, currentPop: boolean) => {
    try {
      await apiClient.updateTemplate(templateId, { isPopular: !currentPop });
      setTemplates(prev =>
        prev.map(t => (t.id === templateId ? { ...t, isPopular: !currentPop } : t))
      );
    } catch {
      alert('Failed to update featured flag.');
    }
  };

  const handleUpdateFeedbackStatus = async (ticketId: string, status: string) => {
    try {
      await apiClient.updateFeedbackStatus(ticketId, status);
      setFeedbackTickets(prev =>
        prev.map(f => (f.id === ticketId ? { ...f, status } : f))
      );
    } catch {
      alert('Failed to update feedback ticket status.');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('notes', uploadNotes);

      const res = await apiClient.uploadTemplateReference(formData);
      setUploadSuccess(res.message || 'Reference file uploaded successfully!');
      setUploadFile(null);
      setUploadNotes('');
      fetchSystemData();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const safeTimeseries = Array.isArray(timeseries) ? timeseries : [];
  const safeTemplateStats = Array.isArray(templateStats) ? templateStats : [];
  const safeTemplates = Array.isArray(templates) ? templates : [];
  const maxDayVisitors = Math.max(...safeTimeseries.map(t => Number(t.visitors) || 0), 1);

  const filteredFeedback = feedbackTickets.filter(f =>
    feedbackFilter === 'ALL' ? true : f.status === feedbackFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-xs gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Administrator Control Center</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Logged in as <span className="font-semibold text-gray-800">{user?.email}</span> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || analyticsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto text-xs font-bold">
        {[
          { id: 'analytics', label: 'Overview & Analytics', icon: BarChart3 },
          { id: 'users', label: `Registered Users (${registeredUsers.length})`, icon: Users },
          { id: 'feedback', label: `Support Tickets (${feedbackTickets.filter(f => f.status === 'NEW').length} New)`, icon: MessageSquare },
          { id: 'templates', label: `Templates (${safeTemplates.length})`, icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Analytics & System Health */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* System Health Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>API Server</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-gray-900 capitalize">
                {health?.status || 'Online'}
              </div>
              <div className="text-[11px] text-gray-400">Node {health?.system?.nodeVersion || 'v20+'}</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>Database (Neon PostgreSQL)</span>
                <Database className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-xl font-extrabold text-gray-900 capitalize">
                {health?.database?.status || 'Healthy'}
              </div>
              <div className="text-[11px] text-gray-400">
                {health?.database?.totalTemplates || safeTemplates.length} Templates · {registeredUsers.length} Users
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>Gemini AI SDK</span>
                <Cpu className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-extrabold text-gray-900">
                {health?.aiService?.configured ? 'Active' : 'Standby'}
              </div>
              <div className="text-[11px] text-gray-400">Model: {health?.aiService?.model || 'gemini-2.5-flash'}</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>Active Live Templates</span>
                <Layers className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-gray-900">
                {safeTemplates.filter(t => t.status === 'ACTIVE').length} / {safeTemplates.length}
              </div>
              <div className="text-[11px] text-gray-400">Available to public users</div>
            </div>
          </div>

          {/* Analytics Date Filter & Controls */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-bold text-gray-900">Product Analytics & Telemetry</span>
              <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                Neon PostgreSQL
              </span>
            </div>

            {/* Date Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-200 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400 ml-1.5 mr-0.5" />
              {(['today', '7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    dateRange === range
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                >
                  {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>Unique Visitors</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                {overview?.uniqueVisitors ?? (analyticsLoading ? '...' : 0)}
              </div>
              <div className="text-[10px] text-gray-400">Distinct browser clients</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>Sessions</span>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                {overview?.sessions ?? (analyticsLoading ? '...' : 0)}
              </div>
              <div className="text-[10px] text-gray-400">30-min window timeout</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>Resumes Created</span>
                <FilePlus className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                {overview?.resumeCreations ?? (analyticsLoading ? '...' : 0)}
              </div>
              <div className="text-[10px] text-gray-400">Draft initializations</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>PDF Exports</span>
                <Download className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                {overview?.pdfExports ?? (analyticsLoading ? '...' : 0)}
              </div>
              <div className="text-[10px] text-gray-400">Print / PDF outputs</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>DOCX Exports</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                {overview?.docxExports ?? (analyticsLoading ? '...' : 0)}
              </div>
              <div className="text-[10px] text-gray-400">Word doc generations</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span>AI Requests</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                {overview?.aiRequests ?? (analyticsLoading ? '...' : 0)}
              </div>
              <div className="text-[10px] text-gray-400">
                {aiStats ? `${aiStats.successRate}% Success` : 'Gemini AI calls'}
              </div>
            </div>
          </div>

          {/* Timeseries Activity Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Activity Over Time ({dateRange})</h2>
                <p className="text-xs text-gray-500">Daily unique visitors, resume creations, exports, and AI invocations</p>
              </div>
              <span className="text-[11px] text-gray-400">
                {safeTimeseries.length} data points
              </span>
            </div>

            {safeTimeseries.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No activity recorded in this date range yet.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-end gap-1 h-36 border-b border-gray-200 pb-1 overflow-x-auto pt-4">
                  {safeTimeseries.map((day, idx) => {
                    const heightPct = Math.max(Math.round(((day.visitors || 0) / maxDayVisitors) * 100), 8);
                    const isCurrent = idx === safeTimeseries.length - 1;
                    return (
                      <div key={day.date || idx} className="flex-1 min-w-[20px] flex flex-col items-center group relative">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 z-20 pointer-events-none bg-gray-900 text-white text-[10px] rounded p-2 shadow-lg whitespace-nowrap">
                          <div className="font-bold">{day.date}</div>
                          <div>Visitors: {day.visitors}</div>
                          <div>Sessions: {day.sessions}</div>
                          <div>Resumes: {day.resumes}</div>
                          <div>Exports: {day.exports}</div>
                          <div>AI Requests: {day.aiRequests}</div>
                        </div>
                        {/* Multi-segment mini bar */}
                        <div className="w-full flex flex-col justify-end items-center h-full">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full max-w-[28px] rounded-t transition-all ${
                              isCurrent ? 'bg-sky-600' : 'bg-sky-400/80 hover:bg-sky-500'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>{safeTimeseries[0]?.date}</span>
                  <span>{safeTimeseries[Math.floor(safeTimeseries.length / 2)]?.date}</span>
                  <span>{safeTimeseries[safeTimeseries.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Registered Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Registered User Accounts ({registeredUsers.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage registered candidates and document ownership metadata. Passwords and hashes are strictly protected.
              </p>
            </div>
            <button
              onClick={fetchSystemData}
              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh users"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 font-semibold">
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Registered At</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3 text-right">Cloud Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registeredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No user accounts registered yet.
                    </td>
                  </tr>
                ) : (
                  registeredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-700 font-mono text-[11px]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.2 rounded-full uppercase">
                          {u.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-600">
                        {u.documentCount || 0} Docs
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: User Feedback & Support Tickets */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Support Inquiries & User Feedback ({feedbackTickets.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Direct tickets submitted via public support gateway and user dashboard.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {(['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFeedbackFilter(st)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    feedbackFilter === st
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'NEW' ? 'New' : st === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFeedback.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No feedback tickets matching this filter.
              </div>
            ) : (
              filteredFeedback.map(ticket => (
                <div
                  key={ticket.id}
                  className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          ticket.status === 'NEW'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="font-bold text-slate-900">{ticket.name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">&lt;{ticket.email}&gt;</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full font-medium">
                        {ticket.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                      {/* Status Action Buttons */}
                      <select
                        value={ticket.status}
                        onChange={e => handleUpdateFeedbackStatus(ticket.id, e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 cursor-pointer"
                      >
                        <option value="NEW">Mark as NEW</option>
                        <option value="IN_PROGRESS">Mark IN PROGRESS</option>
                        <option value="RESOLVED">Mark RESOLVED</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {ticket.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Template Registry & Reference Uploads */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Upload Reference Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-sky-600" />
                  <span>Upload New Template Reference PDF</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload source PDF designs. Uploads enter <span className="font-semibold text-amber-700">PENDING</span> state until a dynamic React/HTML template renderer is configured.
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Architecture Rule:</strong> Arbitrary uploaded PDFs cannot become dynamic editable templates without an explicit HTML/React template renderer. Once implemented, switch the template to <span className="font-semibold">ACTIVE</span>.
              </span>
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Reference PDF File (Max 15MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    required
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Template Design Notes / Target Audience
                  </label>
                  <input
                    type="text"
                    value={uploadNotes}
                    onChange={e => setUploadNotes(e.target.value)}
                    placeholder="e.g. 2-column Deedy style for research / academic resumes"
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Reference File'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Template Management Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">
                Template Registry & States ({safeTemplates.length} Total)
              </h2>
              <span className="text-xs text-gray-500">Managed via PostgreSQL / Prisma</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Template Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Page Size</th>
                    <th className="px-4 py-3 font-semibold">Columns</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Featured</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeTemplates.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-gray-500">{t.id}</td>
                      <td className="px-4 py-2.5 font-bold text-gray-900">{t.name}</td>
                      <td className="px-4 py-2.5 capitalize text-gray-600">{t.category}</td>
                      <td className="px-4 py-2.5 uppercase text-gray-500 font-mono">{t.pageSize}</td>
                      <td className="px-4 py-2.5 text-gray-600">{t.columns} Col</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => handleTogglePopular(t.id, t.isPopular)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            t.isPopular
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}
                        >
                          {t.isPopular ? 'Featured ★' : 'Standard'}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => handleToggleStatus(t.id, t.status)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            t.status === 'ACTIVE'
                              ? 'bg-red-50 hover:bg-red-100 text-red-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {t.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
