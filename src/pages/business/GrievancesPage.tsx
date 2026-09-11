import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  Send,
  X,
  MessageSquare,
  FileText,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { Grievance } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

export const GrievancesPage: React.FC = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    applicationId: 'APP-2026-8492',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    subject: 'Application scrutiny pending beyond Citizen Charter SLA of 30 days',
    description: 'We submitted our architectural machine layout on Feb 18, 2026. SLA elapsed yesterday with no written queries.',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await api.grievances.get(business?.id);
      setGrievances(res);
    } catch (err) {
      console.error('Error fetching grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [business?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.grievances.create({
        businessId: business?.id || 'biz-novatech-01',
        ...formData,
      });
      setGrievances((prev) => [created, ...prev]);
      setShowModal(false);
      toast(`Grievance ticket ${created.ticketId} registered with the State Appellate Cell`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to submit grievance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Grievance & Statutory Appellate Redressal
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Direct escalation channel to Department Vigilance & Citizen Charter Appellate Officers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Escalation</span>
            </button>
            <button
              onClick={fetchGrievances}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SLA Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
            <span className="font-bold">Tamil Nadu Business Facilitation Act 2018 Statutory Right: </span>
            If any clearance is delayed beyond statutory SLA without justification, the Appellate Authority
            is mandated to review and resolve within 7 working days, or deemed approval is initiated.
          </div>
        </div>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {grievances.map((g) => (
          <div
            key={g.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                    {g.ticketId}
                  </span>
                  <StatusBadge status={g.status} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {g.subject}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Target Authority: {g.department} • Associated Application: {g.applicationId}
                </p>
              </div>

              <div className="text-right sm:self-center text-xs text-slate-400">
                <span>Raised on {new Date(g.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              {g.description}
            </p>

            {/* Appellate Actions Timeline */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-2">
                Actions Logged by Appellate Authority
              </h4>
              <div className="space-y-2">
                {g.actionsTaken.map((action, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 flex items-start justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{action.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">By {action.by}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(action.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Lodge Formal Escalation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Statutory escalation to District Collector / Single Window Appellate Cell
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
                >
                  <option value="Directorate of Industrial Safety & Health (DISH)">
                    Directorate of Industrial Safety & Health (DISH)
                  </option>
                  <option value="Tamil Nadu Pollution Control Board (TNPCB)">
                    Tamil Nadu Pollution Control Board (TNPCB)
                  </option>
                  <option value="Fire & Rescue Services Department">
                    Fire & Rescue Services Department
                  </option>
                  <option value="Town & Country Planning (DTCP)">
                    Town & Country Planning (DTCP)
                  </option>
                  <option value="Electricity Board (TANGEDCO)">
                    Electricity Board (TANGEDCO)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Application Reference ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.applicationId}
                  onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white font-mono"
                  placeholder="e.g. APP-2026-8492"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Escalation Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
                  placeholder="e.g. Delay beyond SLA without official query"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grievance Particulars & Facts
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
                  placeholder="Detail dates of application, communications, and statutory violations..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <span>Submit Escalation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
