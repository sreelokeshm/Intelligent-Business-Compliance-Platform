import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  UserCheck,
  Search,
  Bot,
  LogOut,
  ChevronDown,
  Check,
  Briefcase,
  AlertTriangle,
  FileCheck,
  Menu,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../lib/api.js';
import { NotificationItem, UserRole } from '../../types.js';

interface TopNavbarProps {
  onOpenAssistant: () => void;
  onToggleSidebar?: () => void;
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenAssistant,
  onToggleSidebar,
  activeTab,
  onNavigateTab,
}) => {
  const { user, business, role, logout, switchRoleDemo } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    if (user) {
      api.notifications
        .get()
        .then((res) => setNotifications(res))
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    try {
      await api.notifications.markRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
    setShowNotifications(false);
    if (notif.link && onNavigateTab) {
      const cleanRoute = notif.link.replace('/', '');
      onNavigateTab(cleanRoute || 'dashboard');
    }
  };

  const roleConfigs = {
    business_user: {
      label: 'Entrepreneur',
      badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    department_staff: {
      label: 'Department Staff',
      badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      dot: 'bg-indigo-500',
    },
    inspection_officer: {
      label: 'Field Officer',
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      dot: 'bg-amber-500',
    },
    admin: {
      label: 'State Admin',
      badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      dot: 'bg-purple-500',
    },
  };

  const currentRoleConfig = roleConfigs[role] || roleConfigs.business_user;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Left: Mobile Menu & Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {/* Radiant Multi-Color Brand Icon */}
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 text-white shadow-md shadow-fuchsia-500/20 ring-2 ring-white/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
                ComplianceOne
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-fuchsia-500/15 to-purple-500/15 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-300/40 dark:border-fuchsia-700/40">
                Single Window
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              One Business. One Digital Compliance Journey.
            </p>
          </div>
        </div>
      </div>

      {/* Center: Active Enterprise / Department Chip */}
      <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs">
        {role === 'business_user' && business && (
          <>
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-900 dark:text-white max-w-[190px] truncate">
              {business.name}
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{business.location.city}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black ml-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {business.complianceScore}% Safe
            </span>
          </>
        )}
        {role === 'department_staff' && (
          <>
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Scrutiny Desk:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
              {user?.department || 'Directorate of Fire & Rescue Services'}
            </span>
          </>
        )}
        {role === 'inspection_officer' && (
          <>
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span className="text-slate-500 dark:text-slate-400">Field Auditor:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">Joint Inspection Cell</span>
          </>
        )}
        {role === 'admin' && (
          <>
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-purple-600 dark:text-purple-400">
              State Facilitation Committee Command
            </span>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 1-Click Role Switcher (Vividly styled for Demo/Hackathon) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${currentRoleConfig.badge}`}
            title="Switch demo persona instantly"
          >
            <span className={`w-2 h-2 rounded-full ${currentRoleConfig.dot} animate-pulse`} />
            <span className="hidden sm:inline">Persona:</span>
            <span className="font-extrabold">{currentRoleConfig.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-1 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Role Persona
              </div>
              <button
                onClick={() => {
                  switchRoleDemo('business_user');
                  setShowRoleSwitcher(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  role === 'business_user'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Business User (NovaTech)</span>
                </div>
                {role === 'business_user' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  switchRoleDemo('department_staff');
                  setShowRoleSwitcher(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  role === 'department_staff'
                    ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Department Scrutiny Staff</span>
                </div>
                {role === 'department_staff' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
              <button
                onClick={() => {
                  switchRoleDemo('inspection_officer');
                  setShowRoleSwitcher(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  role === 'inspection_officer'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Field Inspection Officer</span>
                </div>
                {role === 'inspection_officer' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
              <button
                onClick={() => {
                  switchRoleDemo('admin');
                  setShowRoleSwitcher(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  role === 'admin'
                    ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>State Single Window Admin</span>
                </div>
                {role === 'admin' && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          )}
        </div>

        {/* AI Regulatory Advisor Button */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-md shadow-fuchsia-500/20 transition-all hover:scale-102"
        >
          <Bot className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden md:inline">Ask AI Advisor</span>
        </button>

        {/* Language selector (EN / TA / HI) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
          <button
            onClick={() => updateSettings({ language: 'en' })}
            className={`px-2 py-1 rounded-lg transition-all ${
              settings.language === 'en'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => updateSettings({ language: 'ta' })}
            className={`px-2 py-1 rounded-lg transition-all ${
              settings.language === 'ta'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle theme"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-black text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Compliance Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">
                    No active notifications
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-fuchsia-50/30 dark:bg-fuchsia-950/15' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="shrink-0 mt-0.5">
                          {notif.type === 'alert' && (
                            <span className="p-1 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {notif.type === 'success' && (
                            <span className="p-1 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <FileCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {notif.type === 'warning' && (
                            <span className="p-1 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {notif.type === 'info' && (
                            <span className="p-1 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Bell className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                            {new Date(notif.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Logout */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-fuchsia-500/40 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name?.[0] || 'U'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
