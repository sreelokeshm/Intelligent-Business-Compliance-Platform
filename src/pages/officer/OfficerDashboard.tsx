import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Check,
  Phone,
  FileText,
  Send,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { InspectionRecord } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInspection, setActiveInspection] = useState<InspectionRecord | null>(null);

  // Field Checklist Report Form State
  const [checklistState, setChecklistState] = useState<{ [id: string]: 'passed' | 'flagged' | 'pending' }>({});
  const [findings, setFindings] = useState('All mandatory life-safety systems verified in working order.');
  const [recommendation, setRecommendation] = useState('Recommended for grant of statutory clearance.');
  const [submitting, setSubmitting] = useState(false);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await api.inspections.get();
      setInspections(res);
      if (res.length > 0 && !activeInspection) {
        setActiveInspection(res[0]);
        // initialize checklist
        const initMap: any = {};
        res[0].checklistItems.forEach((c: any) => {
          initMap[c.id] = c.status;
        });
        setChecklistState(initMap);
      }
    } catch (err) {
      console.error('Error loading officer inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleSelectInspection = (insp: InspectionRecord) => {
    setActiveInspection(insp);
    const initMap: any = {};
    insp.checklistItems.forEach((c: any) => {
      initMap[c.id] = c.status;
    });
    setChecklistState(initMap);
  };

  const handleChecklistToggle = (itemId: string, status: 'passed' | 'flagged') => {
    setChecklistState((prev) => ({ ...prev, [itemId]: status }));
  };

  const handleSubmitAuditReport = async () => {
    if (!activeInspection) return;
    setSubmitting(true);
    try {
      const updatedChecklist = activeInspection.checklistItems.map((c) => ({
        ...c,
        status: checklistState[c.id] || c.status,
      }));

      const res = await api.inspections.submitReport(activeInspection.id, {
        checklistItems: updatedChecklist,
        findings,
        recommendation,
      });

      setInspections((prev) => prev.map((i) => (i.id === activeInspection.id ? res : i)));
      setActiveInspection(res);
      toast('Field Inspection Report & Geo-tag submitted to State Single Window Portal!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Field Inspection & Mobile Audit Portal
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Inspecting Officer: <strong className="text-slate-700 dark:text-slate-200">{user?.name || 'Officer Rajesh K. Pillai'}</strong> • Designation:{' '}
              <strong className="text-slate-700 dark:text-slate-200">Divisional Fire & Safety Officer</strong>
            </p>
          </div>

          <button
            onClick={fetchInspections}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Inspection Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scheduled Audits List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Assigned Site Inspections ({inspections.length})
          </h3>

          {inspections.map((insp) => (
            <div
              key={insp.id}
              onClick={() => handleSelectInspection(insp)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                activeInspection?.id === insp.id
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200/50">
                  {insp.inspectionId}
                </span>
                <StatusBadge status={insp.status} size="sm" />
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                {insp.title}
              </h4>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {new Date(insp.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {insp.scheduledTime}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active Field Audit Form & Checklist */}
        {activeInspection ? (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-extrabold text-amber-600 dark:text-amber-400">
                  {activeInspection.inspectionId}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Geo: 12.9716° N, 79.9482° E (SIPCOT Zone)
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {activeInspection.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{activeInspection.location}</span>
              </p>
            </div>

            {/* Checklist items to verify */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Mandatory Physical Verification Criteria
              </h3>

              <div className="space-y-2.5">
                {activeInspection.checklistItems.map((c) => {
                  const state = checklistState[c.id] || c.status;

                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {c.item}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleChecklistToggle(c.id, 'passed')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            state === 'passed'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChecklistToggle(c.id, 'flagged')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            state === 'flagged'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Flag Defect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Findings and Recommendation */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Inspector Findings / Observations
                </label>
                <textarea
                  rows={3}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Final Official Recommendation
                </label>
                <input
                  type="text"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => toast('Simulated camera shutter: Geo-tagged photo stored', 'info')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-100"
              >
                <Camera className="w-4 h-4" />
                <span>Attach Photographic Evidence</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitAuditReport}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Sign & Submit Audit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-xs text-slate-400">
            Select an inspection from the schedule to proceed.
          </div>
        )}
      </div>
    </div>
  );
};
