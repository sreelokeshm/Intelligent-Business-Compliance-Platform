import React, { useState, useEffect } from 'react';
import {
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building,
  Coins,
  Send,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { Scheme } from '../../types.js';

export const SchemesPage: React.FC = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.schemes.getAll();
      setSchemes(res);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleApplyScheme = (scheme: Scheme) => {
    toast(`Scheme incentive dossier registered for '${scheme.name}'! Reference generated.`, 'success');
    setSelectedScheme(null);
  };

  const filteredSchemes = schemes.filter((s) => {
    if (activeFilter === 'Central') return s.type === 'Central';
    if (activeFilter === 'State') return s.type === 'State';
    if (activeFilter === 'HighMatch') return (s.matchScore || 0) >= 80;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Government Scheme & Subsidies Matcher
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Profile-matched fiscal incentives, capital subsidies, and interest subvention programs
            </p>
          </div>

          <button
            onClick={fetchSchemes}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          {['All', 'HighMatch', 'State', 'Central'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f === 'HighMatch' ? 'High Match (>80%)' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/50">
                  {scheme.type} Scheme • {scheme.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{scheme.matchScore}% Match</span>
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {scheme.name}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {scheme.description}
              </p>

              <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Fiscal Benefit:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {scheme.benefitSummary}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Application Window:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{scheme.deadline}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(scheme)}
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
              >
                View Eligibility Details
              </button>

              <button
                onClick={() => handleApplyScheme(scheme)}
                className="px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
              >
                <span>Apply Scheme</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {selectedScheme.matchScore}% Profile Compatibility
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedScheme.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-1">
                  Scheme Scope & Subsidy
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedScheme.benefitSummary}
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400 mb-2">
                  Mandatory Eligibility Prerequisites
                </h4>
                <div className="space-y-1.5">
                  {selectedScheme.eligibilityCriteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => handleApplyScheme(selectedScheme)}
                className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>Proceed with Application</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
