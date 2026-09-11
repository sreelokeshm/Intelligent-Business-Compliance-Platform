import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  Files,
  Send,
  Building,
  CalendarClock,
  Award,
  ShieldAlert,
  QrCode,
  MessageSquareWarning,
  Bell,
  Bot,
  Settings,
  ClipboardCheck,
  Users,
  Layers,
  BarChart3,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext.js';

interface SidebarProps {
  activeTab: string;
  onTabSelect?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  onOpenAssistant?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabSelect,
  onSelectTab,
  onOpenAssistant,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { role } = useAuth();
  const { settings, toggleSidebar } = useSettings();
  const collapsed = settings.sidebarCollapsed;

  const handleSelect = (id: string) => {
    if (onTabSelect) onTabSelect(id);
    else if (onSelectTab) onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  // Vivid, distinct color assignments for every single navigation item
  const businessNav = [
    {
      id: 'dashboard',
      label: 'Compliance Overview',
      icon: LayoutDashboard,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'wizard',
      label: 'What Do I Need?',
      icon: Sparkles,
      badge: 'AI Engine',
      badgeColor: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300',
      color: 'text-fuchsia-500 dark:text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
    },
    {
      id: 'checklist',
      label: 'My Checklist',
      icon: CheckSquare,
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      id: 'documents',
      label: 'My Documents',
      icon: Files,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'applications',
      label: 'Applications Tracker',
      icon: Send,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      id: 'approvals',
      label: 'Department Approvals',
      icon: Building,
      color: 'text-cyan-500 dark:text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      id: 'inspections',
      label: 'Site Inspections',
      icon: ClipboardCheck,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      id: 'deadlines',
      label: 'Deadlines & Renewals',
      icon: CalendarClock,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      id: 'schemes',
      label: 'Government Schemes',
      icon: Award,
      badge: 'Subsidies',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      color: 'text-yellow-500 dark:text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      id: 'risk',
      label: 'Risk & Scoring',
      icon: ShieldAlert,
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      id: 'passport',
      label: 'Business Passport',
      icon: QrCode,
      badge: 'Verified',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'grievances',
      label: 'Grievance Redressal',
      icon: MessageSquareWarning,
      color: 'text-pink-500 dark:text-pink-400',
      bg: 'bg-pink-500/10',
    },
    {
      id: 'profile',
      label: 'Enterprise Dossier',
      icon: FileText,
      color: 'text-violet-500 dark:text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      id: 'assistant',
      label: 'AI Advisor',
      icon: Bot,
      isAction: true,
      color: 'text-fuchsia-500 dark:text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
    },
  ];

  const staffNav = [
    {
      id: 'staff-queue',
      label: 'Reviewer Queue',
      icon: LayoutDashboard,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      id: 'staff-scrutiny',
      label: 'Desk Scrutiny',
      icon: FileCheck2,
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      id: 'staff-documents',
      label: 'Document Verification',
      icon: Files,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'staff-inspections',
      label: 'Joint Inspections',
      icon: ClipboardCheck,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      id: 'staff-grievances',
      label: 'Grievance Cases',
      icon: MessageSquareWarning,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ];

  const officerNav = [
    {
      id: 'officer-schedule',
      label: 'Field Audits',
      icon: LayoutDashboard,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'officer-checklist',
      label: 'Audit Checklist',
      icon: ClipboardCheck,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      id: 'officer-history',
      label: 'Completed Reports',
      icon: FileText,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  const adminNav = [
    {
      id: 'admin-overview',
      label: 'SLA Analytics',
      icon: BarChart3,
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      id: 'admin-departments',
      label: 'Department Onboarding',
      icon: Building,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      id: 'admin-rules',
      label: 'Rule Engine Matrix',
      icon: Layers,
      color: 'text-fuchsia-500 dark:text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
    },
    {
      id: 'admin-audit',
      label: 'Cryptographic Ledger',
      icon: Shield,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  let currentNav = businessNav;
  if (role === 'department_staff') currentNav = staffNav;
  else if (role === 'inspection_officer') currentNav = officerNav;
  else if (role === 'admin') currentNav = adminNav;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar toggle button (desktop) */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex absolute -right-3 top-5 z-20 items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Title Section */}
      <div className="px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                role === 'business_user'
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                  : role === 'department_staff'
                  ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50'
                  : role === 'inspection_officer'
                  ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                  : 'bg-purple-500 shadow-sm shadow-purple-500/50'
              }`}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {role === 'business_user'
                ? 'Enterprise Journey'
                : role === 'department_staff'
                ? 'Department Scrutiny'
                : role === 'inspection_officer'
                ? 'Field Audit Terminal'
                : 'State Command'}
            </span>
          </div>
        ) : (
          <div className="w-full text-center">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block" />
          </div>
        )}

        {isMobileOpen && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links with vibrant individual colors */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {currentNav.map((item: any) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction && onOpenAssistant) {
                  onOpenAssistant();
                } else {
                  handleSelect(item.id);
                }
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-1 ring-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              }`}
            >
              {/* Colorful icon container */}
              <div
                className={`flex items-center justify-center rounded-lg transition-colors ${
                  collapsed ? 'w-7 h-7 mx-auto' : 'w-7 h-7'
                } ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : `${item.bg} ${item.color}`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Colorful State Ribbon */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-fuchsia-500/10 border border-emerald-500/20 dark:border-emerald-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse" />
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Single Window Live Portal
            </p>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Tamil Nadu Business Facilitation Act 2018
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex relative flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-300 shrink-0 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          />
          <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
