import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  UserCheck,
  Shield,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { UserRole } from '../../types.js';

interface LoginPageProps {
  onBackToHome: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onSuccess }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('business_user');
  const [email, setEmail] = useState('founder@novatech.com');
  const [password, setPassword] = useState('business123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'business_user') {
      setEmail('founder@novatech.com');
      setPassword('business123');
    } else if (role === 'department_staff') {
      setEmail('staff.fire@compliance.gov.in');
      setPassword('staff123');
    } else if (role === 'inspection_officer') {
      setEmail('officer.rajesh@compliance.gov.in');
      setPassword('officer123');
    } else if (role === 'admin') {
      setEmail('admin@compliance.gov.in');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      await login(email, password, selectedRole);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        {/* Top brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-600/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Single Window Access Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to access statutory approvals, licences and compliance dossiers
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleTabChange('business_user')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'business_user'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Business
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('department_staff')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'department_staff'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('inspection_officer')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'inspection_officer'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Inspector
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'admin'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Email ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@organization.gov.in"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Security Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Secure Token...</span>
              </>
            ) : (
              <>
                <span>Sign In as {selectedRole.replace('_', ' ').toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Switchers */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick 1-Click Demo Credential Fill
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleTabChange('business_user')}
              className="p-2 text-left rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-[11px] transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">🏢 NovaTech Business</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">founder@novatech.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('department_staff')}
              className="p-2 text-left rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-[11px] transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">⚖️ Fire/PCB Reviewer</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">staff.fire@compliance.gov.in</div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('inspection_officer')}
              className="p-2 text-left rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-[11px] transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">🔍 Field Inspector</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">officer.rajesh@compliance.gov.in</div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className="p-2 text-left rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-[11px] transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">👑 System Admin</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">admin@compliance.gov.in</div>
            </button>
          </div>
        </div>

        <div className="text-center mt-5">
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            ← Back to Platform Overview
          </button>
        </div>
      </div>
    </div>
  );
};
