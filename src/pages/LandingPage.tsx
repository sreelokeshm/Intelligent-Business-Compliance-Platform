import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building2,
  FileCheck,
  Clock,
  Award,
  Users,
  CheckCircle,
  Cpu,
  Layers,
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  QrCode,
  Shield,
  Zap,
  Flame,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types.js';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenLogin?: () => void;
  onLoginClick?: () => void;
  onSelectRoleDemo?: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenLogin,
  onLoginClick,
  onSelectRoleDemo,
}) => {
  const { switchRoleDemo } = useAuth();
  const handleLogin = onLoginClick || onOpenLogin || onGetStarted;

  const handleDemoSelect = (role: UserRole) => {
    switchRoleDemo(role);
    if (onSelectRoleDemo) onSelectRoleDemo(role);
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner / GovTech Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50" />
            <span className="font-bold text-white">Government Single Window Clearance Authority</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 font-medium">
              Department of Industries, Investment Promotion & Commerce
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Live State Sandbox
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 font-bold border border-fuchsia-500/30">
              Tamil Nadu Facilitation Act 2018
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Radiant Multi-Color Logo */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/25 ring-2 ring-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
                  ComplianceOne
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 text-violet-700 dark:text-violet-300 border border-violet-300/40">
                  GovTech 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                One Business. One Digital Compliance Journey.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-1.5 hover:scale-102"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Vibrant Colorful Glows */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-fuchsia-50/20 to-slate-50 dark:from-slate-900 dark:via-fuchsia-950/10 dark:to-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-amber-500/10 border border-fuchsia-300/40 dark:border-fuchsia-700/40 text-fuchsia-700 dark:text-fuchsia-300 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400 animate-spin" />
            <span>Intelligent Explainable Statutory Compliance Engine</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                Intelligent Business Approvals, Licensing &{' '}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent">
                  Digital Compliance
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
                Empowering entrepreneurs to discover mandatory licences in minutes, pre-validate dossiers,
                track multi-department parallel clearances concurrently, coordinate joint site inspections,
                prevent renewal penalties, and claim capital subsidies—all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-2 hover:scale-102"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Compliance Discovery</span>
                </button>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 shadow-sm transition-all"
                >
                  Demo Persona Portals
                </button>
              </div>

              {/* 4 Quick Stat Badges with individual vivid colors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
                <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">14 Days</div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Avg Clearance Time</div>
                </div>
                <div className="p-3 rounded-2xl bg-fuchsia-50/80 dark:bg-fuchsia-950/30 border border-fuchsia-200/60 dark:border-fuchsia-800/40">
                  <div className="text-2xl font-black text-fuchsia-700 dark:text-fuchsia-300">92.4%</div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">SLA Adherence</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-300">₹0</div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Renewal Penalties</div>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
                  <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">1-Touch</div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Joint Inspection</div>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Compliance Passport Card */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white shadow-2xl border-2 border-fuchsia-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
                      State Digital Passport
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    UID: TN-2026-8819
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Enterprise Name</span>
                    <h3 className="text-base font-extrabold text-white">NovaTech EV Manufacturing Pvt. Ltd.</h3>
                    <p className="text-xs text-slate-300">SIPCOT Industrial Park, Phase II, Sriperumbudur</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] font-bold text-emerald-400 block">Health Score</span>
                      <span className="text-lg font-black text-white">88 / 100</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] font-bold text-amber-400 block">Clearances Granted</span>
                      <span className="text-lg font-black text-white">4 / 6 Active</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">TNPCB Consent to Establish</span>
                      <span className="text-emerald-400 font-bold font-mono">APPROVED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Fire Safety Provisional NOC</span>
                      <span className="text-amber-400 font-bold font-mono">INSPECTION DUE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Factory Plan Approval (DISH)</span>
                      <span className="text-fuchsia-400 font-bold font-mono">SCRUTINY</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white shadow-md transition-all text-center block"
                >
                  Inspect Live Interactive Demo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Dedicated Persona Cards (Color Coded for Demo Evaluation) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            4 Distinct User Journeys
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Evaluate Any Role with 1-Click Demo Personas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Jump directly into each role's specialized workspace with pre-populated statutory dockets:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Business User Card - Emerald Theme */}
          <div
            onClick={() => handleDemoSelect('business_user')}
            className="p-6 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500/30 hover:border-emerald-500 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Persona #1
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Business User
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Explore statutory requirements, validate document uploads, track parallel approvals, and claim state subsidies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Enter as Entrepreneur</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Department Staff Card - Indigo/Violet Theme */}
          <div
            onClick={() => handleDemoSelect('department_staff')}
            className="p-6 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-indigo-500/30 hover:border-indigo-500 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Persona #2
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Department Reviewer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Review CAF filings, examine CAD layouts, raise statutory queries, and grant official endorsements.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Enter Scrutiny Desk</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Field Inspection Officer Card - Amber/Orange Theme */}
          <div
            onClick={() => handleDemoSelect('inspection_officer')}
            className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-500/30 hover:border-amber-500 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center mb-4 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Persona #3
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Field Inspection Officer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Tablet-optimized site audit checklist, geo-tagged photo evidence capture, and instant inspection reporting.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Enter Field Terminal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. State Single Window Admin - Purple/Fuchsia Theme */}
          <div
            onClick={() => handleDemoSelect('admin')}
            className="p-6 rounded-3xl bg-gradient-to-b from-purple-500/10 via-white to-white dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-purple-500/30 hover:border-purple-500 shadow-md hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Persona #4
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                State Single Window Admin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Executive SLA adherence leaderboards, live rule engine editor, department onboarding, and audit logs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Enter State Command</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Grid (Each Card has a distinct jewel tone) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Comprehensive Statutory Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            End-to-End Enterprise Compliance Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Rule Engine (Fuchsia) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-fuchsia-200 dark:border-fuchsia-900/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Explainable Rule Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Deterministic inference maps your industry, workforce, power load, and chemical use to the exact acts and permits required.
            </p>
          </div>

          {/* Card 2: Document Vault (Amber) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Smart Pre-Upload Validation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated file validity checks and SHA-256 cryptographic hashing eliminate 80% of common document rejection delays.
            </p>
          </div>

          {/* Card 3: Parallel Clearances (Indigo) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Concurrent Department Pipelines
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Parallel review streams across Pollution Control, Fire Safety, DISH, and DTCP with statutory Citizen Charter countdowns.
            </p>
          </div>

          {/* Card 4: Joint Inspections (Orange) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Synchronized Joint Inspections
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Consolidates multi-department field visits into a single scheduled inspection with on-site digital checklist signing.
            </p>
          </div>

          {/* Card 5: Expiry Watchtower (Rose) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Automated Renewal Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tiered 90-60-30 day expiry alerts with 1-click re-licensing that auto-fills previously validated business documents.
            </p>
          </div>

          {/* Card 6: Subsidies & Schemes (Emerald) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Government Incentive Matcher
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instant matching against state capital subsidies, green power incentives, and MSME interest subvention programs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 text-center">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          ComplianceOne • Single Window Business Clearance Platform
        </p>
        <p className="mt-1 text-slate-400">
          Developed under the State Business Facilitation Act 2018 guidelines for transparent, timely, and corruption-free industrial governance.
        </p>
      </footer>
    </div>
  );
};
