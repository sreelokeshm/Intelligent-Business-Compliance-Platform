import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Settings,
  TrendingUp,
  Cpu,
  RefreshCw,
  Plus,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { ProgressBar } from '../../components/common/ProgressBar.js';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'rules'>('overview');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, deptRes, rulesRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getDepartments(),
        api.admin.getRules(),
      ]);
      setStats(statsRes);
      setDepartments(deptRes);
      setRules(rulesRes);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRule = (ruleId: string, currentStatus: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !currentStatus } : r))
    );
    toast(`Statutory Rule ${ruleId} ${!currentStatus ? 'Activated' : 'Deactivated'} in Engine`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                State Single Window Executive Command Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Administrator: <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong> • Jurisdiction:{' '}
              <strong className="text-slate-700 dark:text-slate-200">State Single Window Facilitation Committee</strong>
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SLA Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'departments'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Department Onboarding ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Rule Engine Config ({rules.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* OVERVIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Registered Enterprises</span>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {stats?.totalEnterprises || 1248}
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">+18% this quarter</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Clearances Granted</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats?.totalApprovalsProcessed || 8920}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">92.4% success rate</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Processing Time</span>
              <div className="text-3xl font-black text-amber-500 dark:text-amber-400 mt-1">
                {stats?.avgProcessingTimeDays || 18} Days
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">vs 30-day statutory SLA</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Deemed Approvals</span>
              <div className="text-3xl font-black text-fuchsia-600 dark:text-fuchsia-400 mt-1">
                {stats?.deemedApprovalsCount || 14}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Zero-harassment trigger</p>
            </div>
          </div>

          {/* Department Leaderboard */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              State Department SLA Adherence Leaderboard
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Town & Country Planning (DTCP)', adherence: 96, avgDays: 14, rank: 1 },
                { name: 'Tamil Nadu Pollution Control Board (TNPCB)', adherence: 91, avgDays: 19, rank: 2 },
                { name: 'Fire & Rescue Services Department', adherence: 88, avgDays: 12, rank: 3 },
                { name: 'Directorate of Industrial Safety & Health (DISH)', adherence: 81, avgDays: 24, rank: 4 },
                { name: 'Electricity Board (TANGEDCO)', adherence: 74, avgDays: 27, rank: 5 },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                      #{item.rank}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Average Clearance SLA: {item.avgDays} days
                      </p>
                    </div>
                  </div>

                  <div className="w-36 text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.adherence}% On-Time</span>
                    <ProgressBar percentage={item.adherence} size="sm" color="emerald" showText={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEPARTMENTS TAB */}
      {/* ======================================================== */}
      {activeTab === 'departments' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Connected Line Ministries & Nodal Agencies
            </h3>
            <button
              onClick={() => toast('Department onboarding modal initiated', 'info')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard Agency</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 space-y-2 text-xs hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/50">
                    {d.code}
                  </span>
                  <span className="text-emerald-600 font-bold text-[10px] uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    API Integrated
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{d.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Head: {d.head}</p>
                <p className="text-[11px] text-slate-400 font-mono">Contact: {d.contact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RULE ENGINE CONFIG TAB */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Statutory Rule Engine Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deterministic decision tables governing mandatory clearances and risk weights
              </p>
            </div>
            <button
              onClick={() => toast('Rule definition builder opened', 'info')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Define New Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">
                      {rule.id}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{rule.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Condition: {rule.condition}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Trigger Action: <strong className="text-purple-700 dark:text-purple-300">{rule.mandate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleRule(rule.id, rule.active)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      rule.active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {rule.active ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
