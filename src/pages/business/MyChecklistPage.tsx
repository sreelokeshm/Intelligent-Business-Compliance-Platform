import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Send,
  Sparkles,
  Filter,
  Check,
  Building,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { ChecklistItem } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { ProgressBar } from '../../components/common/ProgressBar.js';

interface MyChecklistPageProps {
  onNavigateTab: (tab: string) => void;
}

export const MyChecklistPage: React.FC<MyChecklistPageProps> = ({ onNavigateTab }) => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, completed: 0, progressPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('all');

  const fetchChecklist = async () => {
    setLoading(true);
    try {
      const res = await api.checklist.get(business?.id);
      setItems(res.items || []);
      setStats({
        total: res.total || 0,
        completed: res.completed || 0,
        progressPercentage: res.progressPercentage || 0,
      });
    } catch (err) {
      console.error('Error fetching checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [business?.id]);

  const handleToggleStatus = async (item: ChecklistItem) => {
    const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await api.checklist.update(item.id, {
        status: nextStatus,
        completedAt: nextStatus === 'completed' ? new Date().toISOString() : null,
      });

      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      toast(
        nextStatus === 'completed'
          ? `Marked '${item.name}' as completed! Compliance score recalculated.`
          : `Marked '${item.name}' as pending.`,
        'success'
      );
      fetchChecklist();
    } catch (err: any) {
      toast(err.message || 'Failed to update item', 'error');
    }
  };

  const handleApply = async (item: ChecklistItem) => {
    try {
      await api.applications.create({
        businessId: business?.id || 'biz-novatech-01',
        requirementId: item.requirementId,
        requirementName: item.name,
        department: item.department,
        category: item.category,
      });
      toast(`Application filed for ${item.name}!`, 'success');
      onNavigateTab('applications');
    } catch (err: any) {
      toast(err.message || 'Error creating application', 'error');
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'pending') return item.status !== 'completed';
    if (activeFilter === 'completed') return item.status === 'completed';
    if (activeFilter === 'high') return item.priority === 'High';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Progress */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                My Statutory Checklist
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Enterprise compliance roadmap customized for {business?.name || 'NovaTech Manufacturing'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('wizard')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white shadow-sm shadow-fuchsia-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Rule Engine</span>
            </button>
            <button
              onClick={fetchChecklist}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2">
          <ProgressBar
            percentage={stats.progressPercentage}
            label={`Compliance Readiness: ${stats.completed} of ${stats.total} Mandates Fulfilled`}
            color="emerald"
            size="lg"
          />
        </div>

        {/* Filter buttons with vibrant styling */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'pending', label: `Pending (${items.filter((i) => i.status !== 'completed').length})` },
            { id: 'completed', label: `Completed (${items.filter((i) => i.status === 'completed').length})` },
            { id: 'high', label: `High Priority (${items.filter((i) => i.priority === 'High').length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                  }`}
                  title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                    <StatusBadge status={item.priority} size="sm" />
                    <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-200/40">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{item.department}</span>
                    {item.dueDate && (
                      <>
                        <span>•</span>
                        <span>Due: {new Date(item.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </>
                    )}
                  </p>

                  {item.notes && (
                    <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onNavigateTab('documents')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Doc</span>
                </button>

                {!isCompleted && (
                  <button
                    onClick={() => handleApply(item)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1 transition-all shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Apply</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
