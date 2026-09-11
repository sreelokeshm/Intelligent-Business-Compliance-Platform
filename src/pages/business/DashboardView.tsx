import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Send,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar,
  Award,
  Bot,
  Layers,
  ChevronRight,
  RefreshCw,
  QrCode,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../lib/api.js';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, onOpenAssistant }) => {
  const { user, business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [checklistStats, setChecklistStats] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appsRes, deadRes, schRes, chkRes, riskRes] = await Promise.all([
        api.applications.get(business?.id),
        api.deadlines.get(business?.id),
        api.schemes.getAll(),
        api.checklist.get(business?.id),
        api.risk.get(business?.id || 'biz-novatech-01'),
      ]);

      setApplications(appsRes);
      setDeadlines(deadRes);
      setSchemes(schRes.slice(0, 2));
      setChecklistStats(chkRes);
      setRiskData(riskRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [business?.id]);

  const score = riskData?.complianceScore ?? (business?.complianceScore || 68);
  const totalApps = applications.length;
  const underReviewApps = applications.filter((a) => a.status === 'Under Review' || a.status === 'Inspection').length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const actionRequiredApps = applications.filter((a) => a.status === 'Clarification Required').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar with Vibrant Palette */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Subtle colorful top gradient border line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-fuchsia-500 to-amber-500" />

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Entrepreneur'}
            </h1>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Active Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-2 flex-wrap">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {business?.name || 'NovaTech Manufacturing Pvt. Ltd.'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
              {business?.sector || 'Automotive & EV'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-[11px] text-slate-400">
              CIN: {business?.registrationNumber || 'U34102TN2026PTC158941'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('wizard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white shadow-md shadow-fuchsia-500/20 transition-all hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>What Do I Need?</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh dashboard stats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Health Score Card with Multi-Color Treatment */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white shadow-xl border border-purple-500/30 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-fuchsia-400">
                Compliance Health Engine
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  score >= 80
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : score >= 50
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {score >= 80 ? 'Compliant' : score >= 50 ? 'Action Required' : 'Critical Risk'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {score}
              </span>
              <span className="text-xl text-slate-400 font-bold">/ 100</span>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {score >= 80
                ? 'Your business meets state statutory standards. Keep documentation and renewals updated.'
                : '3 pending prerequisites detected before operational commissioning can proceed.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 relative z-10 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Verified Dossier Documents</span>
                <span className="font-bold text-emerald-400">82%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Department Clearances</span>
                <span className="font-bold text-cyan-400">65%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('risk')}
              className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Risk Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Glowing colorful background ambient circles */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 4 Application Status Summary Cards with distinct, vibrant jewel colors */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          {/* Total Filed - Indigo */}
          <div
            onClick={() => onNavigateTab('applications')}
            className="p-5 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 shadow-sm hover:border-indigo-500 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Dossiers
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{totalApps}</div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                Total Filed Applications
              </p>
            </div>
          </div>

          {/* Under Review - Amber */}
          <div
            onClick={() => onNavigateTab('approvals')}
            className="p-5 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 shadow-sm hover:border-amber-500 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                In Scrutiny
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {underReviewApps}
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                Under Review & Audit
              </p>
            </div>
          </div>

          {/* Approved - Emerald */}
          <div
            onClick={() => onNavigateTab('applications')}
            className="p-5 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 shadow-sm hover:border-emerald-500 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Granted
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {approvedApps}
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                Approved Licences & NOCs
              </p>
            </div>
          </div>

          {/* Clarifications / Action - Rose */}
          <div
            onClick={() => onNavigateTab('applications')}
            className="p-5 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 shadow-sm hover:border-rose-500 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Action Needed
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {actionRequiredApps}
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                Queries & Deficiencies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Action Required Items & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Urgent Compliance Actions with multi-color highlights */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="font-black text-sm text-slate-900 dark:text-white">
                Urgent Compliance Actions
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('checklist')}
              className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:underline flex items-center gap-1"
            >
              <span>View Checklist ({checklistStats?.pending || 4})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Item 1: Amber query */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5 ring-4 ring-amber-500/20" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Submit Clarification for Factory Licence Layout
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Joint Director of Industrial Safety (DISH) requested sanctioned setback verification.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('applications')}
                className="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Resolve
              </button>
            </div>

            {/* Item 2: Violet inspection */}
            <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/25 border border-violet-200 dark:border-violet-900/40 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0 mt-1.5 ring-4 ring-violet-500/20" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Joint Fire & Evacuation Field Inspection
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Scheduled for March 18, 2026 by Fire Safety Officer Rajesh K. Pillai.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('inspections')}
                className="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
              >
                View Protocol
              </button>
            </div>

            {/* Item 3: Emerald subsidy */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 ring-4 ring-emerald-500/20" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    TN Industrial Policy Capital Subsidy - 85% Matched
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Your CapEx and EV battery manufacturing sector qualify for 25% plant machinery subsidy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('schemes')}
                className="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Apply Scheme
              </button>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Deadlines & Expiry Countdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <h2 className="font-black text-sm text-slate-900 dark:text-white">
                Upcoming Deadlines & Renewals
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('deadlines')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              All Deadlines
            </button>
          </div>

          <div className="space-y-3">
            {deadlines.slice(0, 3).map((dl) => (
              <div
                key={dl.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {dl.requirementName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Due: {new Date(dl.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      dl.daysRemaining <= 15
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                    }`}
                  >
                    {dl.daysRemaining} days left
                  </span>
                  <span className="block text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
                    {dl.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Quick Launch Section - 4 Vivid Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('wizard')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-fuchsia-200/80 dark:border-fuchsia-900/40 hover:border-fuchsia-500 text-left transition-all group shadow-sm hover:shadow-md hover:shadow-fuchsia-500/10"
        >
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white">Discover Clearances</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Run rule engine to calculate all statutory NOCs
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('documents')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-500 text-left transition-all group shadow-sm hover:shadow-md hover:shadow-amber-500/10"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white">Upload Documents</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Pre-submission file scrutiny & cryptographic checks
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('passport')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-500 text-left transition-all group shadow-sm hover:shadow-md hover:shadow-emerald-500/10"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white">Business Passport</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            QR verified compliance credentials & trust badge
          </p>
        </button>

        <button
          onClick={onOpenAssistant}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-violet-200/80 dark:border-violet-900/40 hover:border-violet-500 text-left transition-all group shadow-sm hover:shadow-md hover:shadow-violet-500/10"
        >
          <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white">Ask AI Assistant</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Instant statutory acts & regulatory advice
          </p>
        </button>
      </div>
    </div>
  );
};
