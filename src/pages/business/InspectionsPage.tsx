import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Phone,
  Mail,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { InspectionRecord } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

export const InspectionsPage: React.FC = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await api.inspections.get(business?.id);
      setInspections(res);
    } catch (err) {
      console.error('Error fetching inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [business?.id]);

  const handleDownloadChecklist = () => {
    toast('Joint Inspection Readiness Dossier downloaded (PDF format)', 'success');
  };

  const handleReschedule = () => {
    toast('Rescheduling request submitted to Nodal Joint Inspection Committee', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Synchronized Joint Inspection Hub
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Eliminating harassment and duplicate visits via single-day coordinated inter-departmental audits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadChecklist}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Readiness Dossier</span>
            </button>
            <button
              onClick={fetchInspections}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coordinated Audit Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                Joint Inspection Policy Enforced (Standard Operating Procedure #2026/TN-SOP-09)
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Fire & Rescue, TNPCB and DISH officers conduct an integrated simultaneous inspection on the same day.
              </p>
            </div>
          </div>
          <button
            onClick={handleReschedule}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 shrink-0 shadow-sm"
          >
            Request Reschedule
          </button>
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.map((insp) => (
          <div
            key={insp.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/50 px-2 py-0.5 rounded-lg">
                    {insp.inspectionId}
                  </span>
                  <StatusBadge status={insp.status} size="sm" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {insp.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Associated Application: {insp.applicationId}
                </p>
              </div>

              <div className="text-right sm:self-center">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:justify-end">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>
                    {new Date(insp.scheduledDate).toLocaleDateString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 sm:justify-end mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{insp.scheduledTime}</span>
                </div>
              </div>
            </div>

            {/* Officers Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {insp.assignedOfficer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {insp.assignedOfficer.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {insp.assignedOfficer.designation} • {insp.assignedOfficer.department}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-violet-600 dark:text-violet-400 font-semibold mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {insp.assignedOfficer.contact}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {insp.assignedOfficer.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Audit Location:</span>
                  <span>{insp.location}</span>
                </div>
              </div>
            </div>

            {/* Checklist items to prepare */}
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-2">
                Mandatory Physical Checklist Items Evaluated On-Site
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {insp.checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.item}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.status === 'passed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'flagged'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {insp.report && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Audit Outcome: {insp.report.findings}</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Recommendation: {insp.report.recommendation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
