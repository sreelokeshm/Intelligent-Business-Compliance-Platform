import React, { useState, useEffect } from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../lib/api.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { ProgressBar } from '../../components/common/ProgressBar.js';

interface DepartmentApprovalsViewProps {
  onNavigateTab: (tab: string) => void;
}

export const DepartmentApprovalsView: React.FC<DepartmentApprovalsViewProps> = ({ onNavigateTab }) => {
  const { business } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptRes, appsRes] = await Promise.all([
        api.admin.getDepartments(),
        api.applications.get(business?.id),
      ]);
      setDepartments(deptRes);
      setApplications(appsRes);
    } catch (err) {
      console.error('Error loading department approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [business?.id]);

  // Map departments with their active application status
  const deptCards = [
    {
      name: 'Tamil Nadu Pollution Control Board (TNPCB)',
      code: 'TNPCB',
      head: 'Thiru. M. Jayakumar, I.A.S.',
      licence: 'Consent to Establish (CTE) & Consent to Operate (CTO)',
      status: 'Approved',
      slaDaysTotal: 30,
      slaDaysElapsed: 16,
      officer: 'Er. S. Radhakrishnan (District Env. Engineer)',
      remarks: 'CTE granted under Section 25 of Water Act 1974. Valid for construction period.',
    },
    {
      name: 'Directorate of Industrial Safety & Health (DISH)',
      code: 'DISH',
      head: 'Dr. V. Rajeshwari',
      licence: 'Factory Registration & Machinery Layout Approval',
      status: 'Clarification Required',
      slaDaysTotal: 30,
      slaDaysElapsed: 22,
      officer: 'Mr. Ananthakrishnan (Joint Director)',
      remarks: 'Architectural setback verification required for transformer yard.',
    },
    {
      name: 'Fire & Rescue Services Department',
      code: 'FIRE',
      head: 'Director of Fire Operations',
      licence: 'Fire Safety Certificate & High Rise Building NOC',
      status: 'Inspection',
      slaDaysTotal: 21,
      slaDaysElapsed: 12,
      officer: 'Mr. Rajesh K. Pillai (Divisional Fire Officer)',
      remarks: 'Joint site inspection scheduled for March 18, 2026.',
    },
    {
      name: 'Town & Country Planning (DTCP)',
      code: 'DTCP',
      head: 'Chief Town Planner',
      licence: 'Master Plan Land Use & Sanctioned Industrial Layout',
      status: 'Approved',
      slaDaysTotal: 45,
      slaDaysElapsed: 28,
      officer: 'Smt. K. Bhavani (Member Secretary)',
      remarks: 'Layout approval and plot allotment order confirmed.',
    },
    {
      name: 'Tamil Nadu Electricity Board (TANGEDCO)',
      code: 'TANGEDCO',
      head: 'Superintending Engineer',
      licence: 'High Tension (HT) 11 kV / 1500 kVA Power Sanction',
      status: 'Under Review',
      slaDaysTotal: 20,
      slaDaysElapsed: 8,
      officer: 'Er. P. Srinivasan (Executive Engineer)',
      remarks: 'Substation feasibility study completed. Metering cubicle installation in progress.',
    },
    {
      name: 'Municipal Corporation / Local Body Administration',
      code: 'ULB',
      head: 'Municipal Commissioner',
      licence: 'Dangerous & Offensive (D&O) Trade Licence',
      status: 'Approved',
      slaDaysTotal: 14,
      slaDaysElapsed: 7,
      officer: 'Health Officer & Revenue Inspector',
      remarks: 'Property tax assessment and trade licence fee credited.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Parallel Department Approvals Tracker
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Real-time multi-department scrutiny, SLA compliance timers, and bottleneck detection
            </p>
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* SLA Escrow Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Nodal Authorities</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">6 Departments</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Concurrently engaged</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
              Clearances Granted
            </span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              3 of 6 Approved
            </div>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">
              TNPCB, DTCP & Municipal Corporation
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold">
              Bottleneck Alert
            </span>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-0.5">
              1 Clarification
            </div>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">
              Industrial Safety (DISH) - 22/30 Days Elapsed
            </p>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deptCards.map((dept, idx) => {
          const slaPct = Math.round((dept.slaDaysElapsed / dept.slaDaysTotal) * 100);
          const daysLeft = dept.slaDaysTotal - dept.slaDaysElapsed;

          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-violet-400 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50 font-mono">
                    {dept.code}
                  </span>
                  <StatusBadge status={dept.status} size="sm" />
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Statutory Focus: {dept.licence}
                </p>

                {/* SLA Meter */}
                <div className="my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Statutory SLA Countdown:</span>
                    <span
                      className={`font-black ${
                        daysLeft <= 8 ? 'text-amber-600' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {daysLeft} days remaining ({dept.slaDaysElapsed}/{dept.slaDaysTotal} days)
                    </span>
                  </div>
                  <ProgressBar
                    percentage={slaPct}
                    size="sm"
                    color={daysLeft <= 8 ? 'amber' : 'emerald'}
                    showText={false}
                  />
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Latest Note: </span>
                  {dept.remarks}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate max-w-[200px] font-medium">Officer: {dept.officer}</span>
                <button
                  onClick={() => onNavigateTab('applications')}
                  className="px-3 py-1 rounded-xl text-xs font-black text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/50 transition-colors"
                >
                  View Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
