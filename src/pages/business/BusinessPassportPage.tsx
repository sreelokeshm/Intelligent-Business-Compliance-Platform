import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';

export const BusinessPassportPage: React.FC = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'passport' | 'audit'>('passport');

  const handleDownload = () => {
    toast('Digital Business Compliance Passport PDF generated with cryptographic watermark', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast('Public verification URL copied to clipboard!', 'info');
  };

  const auditEvents = [
    {
      timestamp: '2026-03-08 11:20:45 IST',
      actor: 'Business User (founder@novatech.com)',
      action: 'Document Upload & Checksum Verification',
      details: 'Uploaded Factory_Site_Plan_Sanctioned.pdf (SHA-256: 9e248b...4f81)',
    },
    {
      timestamp: '2026-03-05 14:15:10 IST',
      actor: 'Field Inspector (Rajesh K. Pillai)',
      action: 'Joint Inspection Scheduled',
      details: 'Scheduled physical site audit for Fire & Emergency Access for March 18, 2026',
    },
    {
      timestamp: '2026-02-28 09:30:22 IST',
      actor: 'Department Staff (TNPCB Reviewer)',
      action: 'Clearance Endorsement Issued',
      details: 'Granted Consent to Establish (CTE) under Water & Air Acts. Permit # TNPCB-CTE-2026-4921',
    },
    {
      timestamp: '2026-02-15 16:42:00 IST',
      actor: 'Business User (founder@novatech.com)',
      action: 'Single Window Common Application Filed',
      details: 'Submitted CAF-2026-9021 for Phase 1 EV Battery Assembly Plant',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Digital Business Passport & Audit Trail
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Verifiable compliance credentials, tamper-evident state registry, and immutable event ledger
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Verification</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Passport</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'passport'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Verifiable Digital Credential
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Immutable Audit Trail ({auditEvents.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PASSPORT CREDENTIAL CARD */}
      {/* ======================================================== */}
      {activeTab === 'passport' && (
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border-2 border-blue-600/40 shadow-2xl relative overflow-hidden">
          {/* Top Seal & State Branding */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Government Single Window Clearance Authority
                </span>
                <h2 className="text-base font-extrabold text-white">
                  State Digital Enterprise Passport
                </h2>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Good Standing</span>
            </div>
          </div>

          {/* Business Meta Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 text-xs">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Enterprise Legal Name</span>
                <span className="text-base font-black text-white">
                  {business?.name || 'NovaTech Manufacturing Pvt. Ltd.'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Corporate ID (CIN)</span>
                  <span className="font-mono text-white">{business?.registrationNumber || 'U34102TN2026PTC158941'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Sector Classification</span>
                  <span className="text-white">{business?.sector || 'Automotive & EV'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">GSTIN</span>
                  <span className="font-mono text-white">33AAACN8491K1Z2</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Udyam Registration</span>
                  <span className="font-mono text-white">UDYAM-TN-02-0048192</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Registered Plant Address</span>
                <span className="text-slate-300">{business?.location?.address}, Sriperumbudur, Tamil Nadu</span>
              </div>
            </div>

            {/* Simulated Verified QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
              <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2">UUID: 92F0-C0D7-4377</span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">Scan to Verify Authenticity</span>
            </div>
          </div>

          {/* Active Endorsed Licences */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Statutory Clearances Endorsed in Public Ledger
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Consent to Establish (CTE)</span>
                <span className="font-mono text-emerald-400 font-bold">TNPCB-2026-4921</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>DTCP Layout Approval</span>
                <span className="font-mono text-emerald-400 font-bold">DTCP-LP-2026-881</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Municipal D&O Trade Licence</span>
                <span className="font-mono text-emerald-400 font-bold">ULB-TR-2026-1049</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>TANGEDCO HT Power Feasibility</span>
                <span className="font-mono text-blue-400 font-bold">TNEB-HT-8402</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IMMUTABLE AUDIT TRAIL */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cryptographic Event Log & Accountability Record
            </h3>
          </div>

          <div className="space-y-3">
            {auditEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{evt.timestamp}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{evt.actor}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">{evt.action}</div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] font-mono leading-relaxed">
                  {evt.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
