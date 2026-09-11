import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Coins,
  Users,
  ShieldCheck,
  Save,
  CheckCircle2,
  FileText,
  Clock,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';

export const BusinessProfilePage: React.FC = () => {
  const { business, updateBusinessProfile } = useAuth();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: business?.name || 'NovaTech Manufacturing Pvt. Ltd.',
    registrationNumber: business?.registrationNumber || 'U34102TN2026PTC158941',
    sector: business?.sector || 'Automobile & EV Manufacturing',
    stage: business?.stage || 'Pre-operation',
    environmentalCategory: business?.environmentalCategory || 'Orange',
    investmentAmount: business?.investmentAmount || 450000000,
    employeeCount: business?.employeeCount || 185,
    location: {
      state: business?.location?.state || 'Tamil Nadu',
      district: business?.location?.district || 'Kanchipuram',
      city: business?.location?.city || 'Sriperumbudur',
      zone: business?.location?.zone || 'Industrial',
      address: business?.location?.address || 'Plot 42, SIPCOT Industrial Park, Phase II',
    },
    gstin: '33AAACN8491K1Z2',
    pan: 'AAACN8491K',
    udyam: 'UDYAM-TN-02-0048192',
    powerLoadKva: 1500,
    waterConsumptionKld: 25,
    factoryManager: {
      name: 'Mr. Arvind Swaminathan',
      phone: '+91 94441 98231',
      email: 'arvind.plant@novatech.com',
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBusinessProfile(formData);
      toast('Enterprise dossier and statutory profile updated successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Statutory Enterprise Profile & Dossier
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Single master profile utilized across all state & central departmental application forms
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all self-start sm:self-auto"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Dossier</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Legal Entity Particulars */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Legal Identity & Registration Particulars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Registered Company Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Identification Number (CIN)
              </label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Goods & Services Tax ID (GSTIN)
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Permanent Account Number (PAN)
              </label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Udyam Registration Certificate Number
              </label>
              <input
                type="text"
                value={formData.udyam}
                onChange={(e) => setFormData({ ...formData, udyam: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Operational Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              >
                <option value="Pre-construction">Pre-construction</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Pre-operation">Pre-operation</option>
                <option value="Operational">Operational</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Operational Scale & Utilities */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Coins className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Industrial Scale & Utilities Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                CapEx in Plant & Machinery (₹)
              </label>
              <input
                type="number"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Workforce (Employees & Workers)
              </label>
              <input
                type="number"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pollution Index Classification
              </label>
              <select
                value={formData.environmentalCategory}
                onChange={(e) => setFormData({ ...formData, environmentalCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              >
                <option value="Red">Red Category</option>
                <option value="Orange">Orange Category</option>
                <option value="Green">Green Category</option>
                <option value="White">White Category</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Connected Power Sanction (kVA)
              </label>
              <input
                type="number"
                value={formData.powerLoadKva}
                onChange={(e) => setFormData({ ...formData, powerLoadKva: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Water Requirement (KLD - Kilo Litres / Day)
              </label>
              <input
                type="number"
                value={formData.waterConsumptionKld}
                onChange={(e) => setFormData({ ...formData, waterConsumptionKld: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Factory Manager Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Statutory Factory Manager / EHS Liaison
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Designated Manager Full Name
              </label>
              <input
                type="text"
                value={formData.factoryManager.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    factoryManager: { ...formData.factoryManager, name: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (for SMS Alerts)
              </label>
              <input
                type="text"
                value={formData.factoryManager.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    factoryManager: { ...formData.factoryManager, phone: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Liaison Email
              </label>
              <input
                type="email"
                value={formData.factoryManager.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    factoryManager: { ...formData.factoryManager, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
