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
  MousePointerClick
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [health, setHealth] = useState<any | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Analytics states
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [overview, setOverview] = useState<any | null>(null);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [templateStats, setTemplateStats] = useState<any[]>([]);
  const [aiStats, setAiStats] = useState<any | null>(null);

  const fetchSystemData = async () => {
    try {
      const [hRes, tRes] = await Promise.all([
        apiClient.getHealth().catch(() => null),
        apiClient.getTemplates({ status: 'all' }).catch(() => ({ templates: [] }))
      ]);
      setHealth(hRes);
      setTemplates(tRes.templates || []);
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
      setTimeseries(tsRes?.series || []);
      setTemplateStats(tmRes?.templates || []);
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
    } catch (e) {
      alert('Failed to update template status.');
    }
  };

  const handleTogglePopular = async (templateId: string, currentPop: boolean) => {
    try {
      await apiClient.updateTemplate(templateId, { isPopular: !currentPop });
      setTemplates(prev =>
        prev.map(t => (t.id === templateId ? { ...t, isPopular: !currentPop } : t))
      );
    } catch (e) {
      alert('Failed to update featured flag.');
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

  // Find max value in timeseries for proportional bar rendering
  const maxDayVisitors = Math.max(...timeseries.map(t => t.visitors || 0), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-xl border border-gray-200 shadow-xs gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Admin Dashboard & Monitoring</span>
          </h1>
          <p className="text-xs text-gray-500">
            Logged in as <span className="font-semibold text-gray-800">{user?.email}</span> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || analyticsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh All</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
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
            {timeseries.length} data points
          </span>
        </div>

        {timeseries.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            No activity recorded in this date range yet.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-end gap-1 h-36 border-b border-gray-200 pb-1 overflow-x-auto pt-4">
              {timeseries.map((day, idx) => {
                const heightPct = Math.max(Math.round((day.visitors / maxDayVisitors) * 100), 8);
                const isCurrent = idx === timeseries.length - 1;
                return (
                  <div key={day.date} className="flex-1 min-w-[20px] flex flex-col items-center group relative">
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
            {/* Axis labels */}
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>{timeseries[0]?.date}</span>
              <span>{timeseries[Math.floor(timeseries.length / 2)]?.date}</span>
              <span>{timeseries[timeseries.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Template Analytics & AI Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Template Analytics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Template Performance & Usage</h2>
              <p className="text-xs text-gray-500">Telemetry aggregated across 28 templates</p>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              {templateStats.length} Active Templates
            </span>
          </div>

          <div className="overflow-x-auto max-h-[360px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Template ID</th>
                  <th className="px-4 py-2.5 font-semibold text-center">Views</th>
                  <th className="px-4 py-2.5 font-semibold text-center">Selected</th>
                  <th className="px-4 py-2.5 font-semibold text-center">Switches</th>
                  <th className="px-4 py-2.5 font-semibold text-center">PDF Exports</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Total Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templateStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No template interactions in this range.
                    </td>
                  </tr>
                ) : (
                  templateStats.map(stat => (
                    <tr key={stat.templateId} className="hover:bg-gray-50/50 font-mono text-[11px]">
                      <td className="px-4 py-2 font-bold text-gray-900">{stat.templateId}</td>
                      <td className="px-4 py-2 text-center text-gray-600">{stat.views}</td>
                      <td className="px-4 py-2 text-center text-sky-700 font-semibold">{stat.selections}</td>
                      <td className="px-4 py-2 text-center text-purple-700">{stat.switches}</td>
                      <td className="px-4 py-2 text-center text-emerald-700 font-semibold">{stat.pdfExports}</td>
                      <td className="px-4 py-2 text-right font-bold text-gray-900">{stat.totalUsage}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Tool Breakdown & Guardrails (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Assist & Tool Reliability</span>
              </h2>
              <p className="text-xs text-gray-500">Gemini model requests by feature</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {aiStats?.successRate ?? 100}% Success Rate
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">Summary Enhancements</span>
                <div className="text-[11px] text-gray-400">Executive & student profiles</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{aiStats?.breakdown?.summary?.total ?? 0}</span>
                <span className="text-[10px] text-emerald-600 block">
                  {aiStats?.breakdown?.summary?.success ?? 0} ok
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">Bullet Point Polish</span>
                <div className="text-[11px] text-gray-400">Action verb & metric optimizations</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{aiStats?.breakdown?.bullet?.total ?? 0}</span>
                <span className="text-[10px] text-emerald-600 block">
                  {aiStats?.breakdown?.bullet?.success ?? 0} ok
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">Skill Suggestions</span>
                <div className="text-[11px] text-gray-400">Role-targeted technical keywords</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{aiStats?.breakdown?.skills?.total ?? 0}</span>
                <span className="text-[10px] text-emerald-600 block">
                  {aiStats?.breakdown?.skills?.success ?? 0} ok
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">Job Description Matcher</span>
                <div className="text-[11px] text-gray-400">ATS keyword parsing & gaps</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{aiStats?.breakdown?.jobAnalysis?.total ?? 0}</span>
                <span className="text-[10px] text-emerald-600 block">
                  {aiStats?.breakdown?.jobAnalysis?.success ?? 0} ok
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <div className="text-[11px] text-gray-400">Node {health?.system?.nodeVersion || process.version}</div>
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
            {health?.database?.totalTemplates || templates.length} Total Templates
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
            {templates.filter(t => t.status === 'ACTIVE').length} / {templates.length}
          </div>
          <div className="text-[11px] text-gray-400">Available to public students</div>
        </div>
      </div>

      {/* Upload Reference Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900">
            Template Registry & States ({templates.length} Total)
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
              {templates.map(t => (
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
  );
};
