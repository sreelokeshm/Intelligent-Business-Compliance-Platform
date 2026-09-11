import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Building,
  Sparkles,
  ArrowRight,
  Activity,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { ProgressBar } from '../../components/common/ProgressBar.js';

interface RiskScoringPageProps {
  onNavigateTab: (tab: string) => void;
}

export const RiskScoringPage: React.FC<RiskScoringPageProps> = ({ onNavigateTab }) => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulation toggles
  const [simUploadPlan, setSimUploadPlan] = useState(false);
  const [simRenewFire, setSimRenewFire] = useState(false);
  const [simExpandWorkers, setSimExpandWorkers] = useState(false);

  const fetchRisk = async () => {
    setLoading(true);
    try {
      const res = await api.risk.get(business?.id || 'biz-novatech-01');
      setRiskData(res);
    } catch (err) {
      console.error('Error fetching risk score:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
  }, [business?.id]);

  // Dynamic simulation score calculation
  const baseScore = riskData?.complianceScore || 68;
  let simulatedScore = baseScore;
  if (simUploadPlan) simulatedScore += 12;
  if (simRenewFire) simulatedScore += 10;
  if (simExpandWorkers) simulatedScore -= 8;
  if (simulatedScore > 100) simulatedScore = 100;
  if (simulatedScore < 0) simulatedScore = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Explainable Compliance Risk & Health Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Transparent, deterministic multi-factor scoring of legal vulnerability, audit readiness, and penalty exposure
            </p>
          </div>

          <button
            onClick={fetchRisk}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto"
            title="Recalculate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Composite Health Metric
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {riskData?.riskLevel || 'Moderate Risk'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-6xl font-black tracking-tight">{simulatedScore}</span>
              <span className="text-2xl text-slate-400 font-semibold">/ 100</span>
              {simulatedScore !== baseScore && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${simulatedScore > baseScore ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {simulatedScore > baseScore ? `+${simulatedScore - baseScore}` : `${simulatedScore - baseScore}`} (Simulated)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed mt-3">
              Your business is currently in the <strong>Safe Buffer</strong> zone. Taking 2 key remediation actions
              will elevate your enterprise to <strong>100% Green Zone</strong> audit immunity.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Scoring Weightage Formula
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Document Verification (35%)</span>
                <span className="font-bold text-white">28 / 35</span>
              </div>
              <div className="flex justify-between">
                <span>Operational Clearances (30%)</span>
                <span className="font-bold text-white">18 / 30</span>
              </div>
              <div className="flex justify-between">
                <span>Deadline & Renewal Horizon (20%)</span>
                <span className="font-bold text-white">14 / 20</span>
              </div>
              <div className="flex justify-between">
                <span>Statutory Inspection Record (15%)</span>
                <span className="font-bold text-white">12 / 15</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dimension Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {riskData?.dimensions ? (
            riskData.dimensions.map((dim: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {dim.name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        dim.level === 'Low'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : dim.level === 'Medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {dim.level} Risk
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {dim.explanation}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <span>Factor Score:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{dim.score} / 100</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 text-center text-xs text-slate-400">Loading risk dimensions...</div>
          )}
        </div>
      </div>

      {/* Interactive What-If Simulation Sandbox */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            "What-If" Predictive Compliance Sandbox
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulate prospective operational shifts or compliance filings to see real-time score adjustments:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${simUploadPlan ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={simUploadPlan}
                onChange={(e) => setSimUploadPlan(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-bold text-xs text-emerald-600">+12 Points</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Upload Sanctioned Site Plan</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Resolves pending Factory Licence DISH query
            </p>
          </label>

          <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${simRenewFire ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={simRenewFire}
                onChange={(e) => setSimRenewFire(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-bold text-xs text-emerald-600">+10 Points</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Pre-Renew Fire NOC (45 Days Early)</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Eliminates expiry proximity risk factor
            </p>
          </label>

          <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${simExpandWorkers ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={simExpandWorkers}
                onChange={(e) => setSimExpandWorkers(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="font-bold text-xs text-rose-600">-8 Points</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Scale Workforce to 260 Workers</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Triggers mandatory statutory creche & canteen laws
            </p>
          </label>
        </div>
      </div>
    </div>
  );
};
