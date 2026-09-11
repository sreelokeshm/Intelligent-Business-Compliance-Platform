import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Eye,
  Send,
  MessageSquare,
  UserCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { Application } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Review modal states
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'clarification' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.applications.get();
      setApplications(res);
    } catch (err) {
      console.error('Error loading staff queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleExecuteReview = async () => {
    if (!selectedApp || !reviewAction) return;
    if (!remarks.trim()) {
      toast('Please provide statutory review notes/remarks', 'error');
      return;
    }

    setProcessing(true);
    try {
      let statusToSet: Application['status'] = 'Under Review';
      if (reviewAction === 'approve') statusToSet = 'Approved';
      else if (reviewAction === 'reject') statusToSet = 'Rejected';
      else if (reviewAction === 'clarification') statusToSet = 'Clarification Required';

      const updated = await api.applications.review(selectedApp.id, {
        status: statusToSet,
        remarks,
      });

      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? updated : a)));
      toast(`Application ${selectedApp.applicationId} updated to '${statusToSet}'`, 'success');
      setSelectedApp(null);
      setReviewAction(null);
      setRemarks('');
    } catch (err: any) {
      toast(err.message || 'Review action failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'Under Review').length;
  const inspectionCount = applications.filter((a) => a.status === 'Inspection').length;
  const clarificationCount = applications.filter((a) => a.status === 'Clarification Required').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Department Review & Scrutiny Portal
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Reviewing Officer: <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong> • Department:{' '}
              <strong className="text-slate-700 dark:text-slate-200">{user?.department || 'Directorate of Fire & Rescue Services'}</strong>
            </p>
          </div>

          <button
            onClick={fetchQueue}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">
              Pending Scrutiny
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-fuchsia-50/60 dark:bg-fuchsia-950/20 border border-fuchsia-200/80 dark:border-fuchsia-800/40">
            <span className="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase">
              Site Inspection
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{inspectionCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
              Clarifications
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{clarificationCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              Clearances Granted
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Applications Scrutiny Queue Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Active Statutory Clearance Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                <th className="pb-3 pr-4">Application ID</th>
                <th className="pb-3 pr-4">Clearance Name</th>
                <th className="pb-3 pr-4">Filed Date</th>
                <th className="pb-3 pr-4">Risk Level</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {app.applicationId}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-slate-900 dark:text-white">{app.requirementName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.department}</div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(app.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {app.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setReviewAction('clarification');
                        setRemarks('');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                    >
                      Query
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setReviewAction('approve');
                        setRemarks('All statutory technical checks passed. Approved under state single window mandates.');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setReviewAction('reject');
                        setRemarks('');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Execute Review Decision: {reviewAction.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dossier {selectedApp.applicationId} • {selectedApp.requirementName}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Scrutiny Remarks / Justification
                </label>
                <textarea
                  rows={4}
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter statutory inspection findings, conditions of approval, or required clarifications..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(null);
                    setReviewAction(null);
                  }}
                  className="px-4 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleExecuteReview}
                  className={`px-5 py-2 rounded-xl font-bold text-white transition-all shadow-sm ${
                    reviewAction === 'approve'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                      : reviewAction === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {processing ? 'Processing...' : `Confirm ${reviewAction.toUpperCase()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
