import React, { useState, useEffect } from 'react';
import {
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ChevronRight,
  X,
  MessageSquare,
  Shield,
  Building,
  Calendar,
  Download,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { Application } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { ProgressBar } from '../../components/common/ProgressBar.js';

interface ApplicationsPageProps {
  onNavigateTab: (tab: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onNavigateTab }) => {
  const { business, user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);

  // New comment state inside detail drawer
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.applications.get(business?.id);
      setApplications(res);
      // If active application is open, refresh it as well
      if (activeApplication) {
        const updated = res.find((a: Application) => a.id === activeApplication.id);
        if (updated) setActiveApplication(updated);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [business?.id]);

  const handlePostComment = async () => {
    if (!activeApplication || !newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const updated = await api.applications.addComment(activeApplication.id, newComment);
      setActiveApplication(updated);
      setNewComment('');
      toast('Comment posted to application review thread', 'success');
      fetchApplications();
    } catch (err: any) {
      toast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesSearch =
      app.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.requirementName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Single Window Applications Tracker
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Real-time multi-department scrutiny, parallel approvals, and site inspection status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('wizard')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <span>+ New Application</span>
            </button>
            <button
              onClick={fetchApplications}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID (e.g. APP-2026-8492) or clearance name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Under Review', 'Inspection', 'Clarification Required', 'Approved'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border border-violet-200/50 px-2 py-0.5 rounded-lg">
                  {app.applicationId}
                </span>
                <StatusBadge status={app.status} size="sm" />
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {app.requirementName}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
                {app.department}
              </p>

              <div className="my-4">
                <ProgressBar
                  percentage={app.progressPercentage}
                  label="Scrutiny Progress"
                  size="sm"
                  color="auto"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Filed: {new Date(app.submittedDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Risk Score: {app.riskScore}/100</span>
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold">
                {app.timeline.length} milestones logged
              </span>

              <button
                onClick={() => setActiveApplication(app)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-800 dark:text-slate-200 hover:text-emerald-600 flex items-center gap-1 transition-all"
              >
                <span>Track Lifecycle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lifecycle Tracking Modal / Drawer */}
      {activeApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-extrabold text-violet-600 dark:text-violet-400">
                    {activeApplication.applicationId}
                  </span>
                  <StatusBadge status={activeApplication.status} size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeApplication.requirementName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Nodal Authority: {activeApplication.department}
                </p>
              </div>
              <button
                onClick={() => setActiveApplication(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              {/* Progress Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <ProgressBar
                  percentage={activeApplication.progressPercentage}
                  label="Lifecycle Completion"
                  size="md"
                  color="auto"
                />
              </div>

              {/* Parallel Department Processing Status */}
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-2">
                  Parallel Department Processing Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeApplication.parallelDepartments.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{p.department}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          SLA target: {p.expectedCompletion}
                        </p>
                      </div>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Timeline */}
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-3">
                  Statutory Clearance Lifecycle Timeline
                </h4>
                <div className="space-y-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                  {activeApplication.timeline.map((step, sIdx) => {
                    const isDone = step.status === 'completed';
                    const isInProgress = step.status === 'in_progress';
                    const isRejected = step.status === 'rejected';

                    return (
                      <div key={sIdx} className="relative pl-5">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[11px] top-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isDone
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                              : isInProgress
                              ? 'bg-fuchsia-600 text-white ring-4 ring-fuchsia-100 dark:ring-fuchsia-950 animate-pulse'
                              : isRejected
                              ? 'bg-rose-600 text-white ring-4 ring-rose-100 dark:ring-rose-950'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          {isDone ? '✓' : sIdx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {step.stage}
                            </span>
                            {step.date && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({new Date(step.date).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                          {step.officerName && (
                            <span className="inline-block mt-1 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                              Officer: {step.officerName}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Communications Thread */}
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-2">
                  Officer Remarks & Clarifications Thread
                </h4>
                <div className="space-y-2 mb-3">
                  {activeApplication.comments.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{c.by} ({c.role})</span>
                        <span>{new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">{c.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Submit reply or clarification to reviewing officer..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handlePostComment}
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white disabled:opacity-50 transition-all shadow-sm"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <div>
                {activeApplication.status === 'Approved' && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Statutory Clearance Granted</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeApplication.status === 'Approved' && (
                  <button
                    onClick={() => toast('Simulated digital certificate download with QR verification', 'info')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Signed Permit</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveApplication(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
