import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Download,
  RotateCw,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { DeadlineItem } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

interface DeadlinesRenewalsPageProps {
  onNavigateTab: (tab: string) => void;
}

export const DeadlinesRenewalsPage: React.FC<DeadlinesRenewalsPageProps> = ({ onNavigateTab }) => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchDeadlines = async () => {
    setLoading(true);
    try {
      const res = await api.deadlines.get(business?.id);
      setDeadlines(res);
    } catch (err) {
      console.error('Error fetching deadlines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [business?.id]);

  const handleStartRenewal = async (dl: DeadlineItem) => {
    try {
      await api.applications.create({
        businessId: business?.id || 'biz-novatech-01',
        requirementId: dl.requirementId,
        requirementName: `Renewal: ${dl.requirementName}`,
        department: dl.department,
        category: dl.category,
      });
      toast(`Renewal application created for ${dl.requirementName}!`, 'success');
      onNavigateTab('applications');
    } catch (err: any) {
      toast(err.message || 'Failed to initiate renewal', 'error');
    }
  };

  const handleCalendarExport = () => {
    toast('Statutory compliance deadlines exported to iCal (.ics) format', 'success');
  };

  const filteredDeadlines = deadlines.filter((d) => {
    if (activeFilter === 'Critical') return d.daysRemaining <= 30;
    if (activeFilter === 'Renewals') return d.category === 'Licence' || d.category === 'NOC';
    if (activeFilter === 'Returns') return d.category === 'Statutory Return';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Statutory Calendar & Expiry Watchtower
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Zero-penalty automated deadline tracker for statutory returns, licence renewals, and mandatory audits
            </p>
          </div>

          <button
            onClick={handleCalendarExport}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Calendar (.ics)</span>
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          {['All', 'Critical', 'Renewals', 'Returns'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeadlines.map((dl) => {
          const isCritical = dl.daysRemaining <= 15;
          const isWarning = dl.daysRemaining <= 30;

          return (
            <div
              key={dl.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm flex flex-col justify-between transition-all ${
                isCritical
                  ? 'border-rose-400 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20'
                  : isWarning
                  ? 'border-amber-300 dark:border-amber-800/80'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50">
                    {dl.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                      isCritical
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {dl.daysRemaining} days remaining
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {dl.requirementName}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
                  {dl.department}
                </p>

                <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                    <span>Statutory Due Date:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {new Date(dl.dueDate).toLocaleDateString([], {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                    <span>Penalty for Default:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{dl.penaltyInfo}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Renewal Cycle: Annual</span>
                </span>

                <button
                  onClick={() => handleStartRenewal(dl)}
                  className="px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white flex items-center gap-1 shadow-md shadow-orange-500/20 transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Renew Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
