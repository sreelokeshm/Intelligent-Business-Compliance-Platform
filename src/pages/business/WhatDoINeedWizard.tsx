import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  MapPin,
  Coins,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ChevronRight,
  HelpCircle,
  X,
  Plus,
  Send,
  Loader2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { RequirementRule } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

interface WhatDoINeedWizardProps {
  onNavigateTab: (tab: string) => void;
}

export const WhatDoINeedWizard: React.FC<WhatDoINeedWizardProps> = ({ onNavigateTab }) => {
  const { business } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementRule | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Multi-step form state
  const [formData, setFormData] = useState({
    businessId: business?.id || 'biz-novatech-01',
    sector: business?.sector || 'Automobile & EV Manufacturing',
    location: {
      state: business?.location?.state || 'Tamil Nadu',
      district: business?.location?.district || 'Kanchipuram',
      city: business?.location?.city || 'Sriperumbudur',
      zone: business?.location?.zone || 'Industrial',
      address: business?.location?.address || 'Plot 42, SIPCOT Industrial Park',
    },
    investmentAmount: business?.investmentAmount || 450000000, // 45 Cr
    employeeCount: business?.employeeCount || 185,
    stage: business?.stage || 'Pre-operation',
    projectSize: 'Medium',
    environmentalCategory: business?.environmentalCategory || 'Orange',
    manufacturingCategory: 'High Voltage EV Battery Assembly',
    buildingType: 'Industrial Shed',
    hasHazardousMaterials: true,
    hasHighTensionPower: true,
    hasWorkerCanteen: true,
    hasBoilerOrPressureVessel: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.requirements.analyze(formData);
      setEvaluationResult(res);
      setCurrentStep(7); // Show results view
      toast('Requirement Rule Engine successfully analyzed your enterprise profile!', 'success');
    } catch (err: any) {
      toast(err.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddToChecklist = async (reqItem: RequirementRule) => {
    try {
      toast(`'${reqItem.name}' added to your compliance checklist.`, 'success');
    } catch {
      toast('Failed to update checklist', 'error');
    }
  };

  const handleStartApplication = async (reqItem: RequirementRule) => {
    try {
      toast(`Initiating Common Application Form for '${reqItem.name}'...`, 'info');
      onNavigateTab('applications');
    } catch {
      toast('Failed to initiate application', 'error');
    }
  };

  const requirementsList: RequirementRule[] = evaluationResult?.requirements || [];
  const filteredRequirements =
    filterCategory === 'All'
      ? requirementsList
      : requirementsList.filter((r) => r.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Top Header Card with Radiant Gradient Icon */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-amber-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-fuchsia-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Statutory Requirement Discovery Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Deterministic rule-based evaluation of state & central statutory mandates, clearances,
              and pre-requisites
            </p>
          </div>

          {currentStep === 7 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Reconfigure Parameters
            </button>
          )}
        </div>

        {/* Colorful Step Indicator Bar (Steps 1 to 6) */}
        {currentStep < 7 && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-6 gap-2 text-center text-xs">
              {[
                { step: 1, title: 'Sector', color: 'fuchsia' },
                { step: 2, title: 'Location', color: 'violet' },
                { step: 3, title: 'Investment', color: 'amber' },
                { step: 4, title: 'Workforce', color: 'indigo' },
                { step: 5, title: 'Operations', color: 'orange' },
                { step: 6, title: 'Review', color: 'emerald' },
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`cursor-pointer pb-2 border-b-2 transition-all ${
                    currentStep === s.step
                      ? 'border-fuchsia-600 text-fuchsia-600 dark:border-fuchsia-400 dark:text-fuchsia-400 font-black'
                      : currentStep > s.step
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-extrabold">Step 0{s.step}</div>
                  <div className="hidden sm:block text-xs truncate font-bold">{s.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STEP 1: SECTOR SELECTION */}
      {currentStep === 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Select Your Primary Industry Sector
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Statutory requirements differ significantly based on industrial hazards and product classification.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { id: 'Automobile & EV Manufacturing', icon: '🚗', desc: 'Battery, chassis, motor assembly' },
              { id: 'Pharmaceuticals & API', icon: '💊', desc: 'Drug formulations, active chemical synthesis' },
              { id: 'Food Processing & Beverage', icon: '🍲', desc: 'Packaged foods, dairy, beverages' },
              { id: 'Textiles & Garments', icon: '🧵', desc: 'Spinning, weaving, dyeing, apparel' },
              { id: 'IT, ITES & Software Technology', icon: '💻', desc: 'Data centers, SaaS, BPO facilities' },
              { id: 'Renewable Energy & Solar', icon: '⚡', desc: 'Solar PV, wind components, storage' },
              { id: 'Chemicals & Petrochemicals', icon: '🧪', desc: 'Specialty chemicals, polymers, gases' },
              { id: 'Logistics & Warehousing', icon: '📦', desc: 'Cold storage, fulfillment hubs' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleInputChange('sector', sec.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  formData.sector === sec.id
                    ? 'border-fuchsia-500 bg-fuchsia-50/70 dark:bg-fuchsia-950/40 ring-2 ring-fuchsia-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="text-2xl mb-2">{sec.icon}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{sec.id}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{sec.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 hover:scale-102"
            >
              <span>Next: Location Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION DETAILS */}
      {currentStep === 2 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Facility Location & Land Classification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Municipal planning zone, setback laws and state-specific industrial corridor regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                State
              </label>
              <select
                value={formData.location.state}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium dark:text-white"
              >
                <option value="Tamil Nadu">Tamil Nadu (SIPCOT / TIDCO)</option>
                <option value="Maharashtra">Maharashtra (MIDC)</option>
                <option value="Karnataka">Karnataka (KIADB)</option>
                <option value="Gujarat">Gujarat (GIDC)</option>
                <option value="Telangana">Telangana (TSIIC)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District / Industrial Zone
              </label>
              <input
                type="text"
                value={formData.location.district}
                onChange={(e) => handleLocationChange('district', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium dark:text-white"
                placeholder="e.g. Kanchipuram, Pune, Bengaluru Rural"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Zoning Category
              </label>
              <select
                value={formData.location.zone}
                onChange={(e) => handleLocationChange('zone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium dark:text-white"
              >
                <option value="Industrial">Designated Industrial Park / Estate</option>
                <option value="Commercial">Commercial Zone</option>
                <option value="Mixed">Mixed-Use Commercial / Residential</option>
                <option value="Agricultural">Agricultural Land (Requires Conversion)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Site Address / Plot Number
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium dark:text-white"
                placeholder="Plot 42, Industrial Area Phase II"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Next: Investment & Size</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INVESTMENT & SIZE */}
      {currentStep === 3 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Capital Investment (CapEx) & Built-up Area
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Determines MSME vs Large Enterprise classification, PCB fees, and scheme limits.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Capital Investment (Plant & Machinery):</span>
                <span className="text-fuchsia-600 dark:text-fuchsia-400 font-black text-sm">
                  ₹{(formData.investmentAmount / 10000000).toFixed(2)} Crores
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="1000000000"
                step="5000000"
                value={formData.investmentAmount}
                onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
                className="w-full accent-fuchsia-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹50 Lakhs (Micro/Small)</span>
                <span>₹25 Crores (Medium)</span>
                <span>₹100+ Crores (Mega Project)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enterprise Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium dark:text-white"
                >
                  <option value="Pre-construction">Pre-construction (Planning & Approvals)</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Pre-operation">Pre-operation (Commissioning Trial)</option>
                  <option value="Operational">Operational (Routine Monitoring & Renewals)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pollution Index Category
                </label>
                <select
                  value={formData.environmentalCategory}
                  onChange={(e) => handleInputChange('environmentalCategory', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium dark:text-white"
                >
                  <option value="White">White Category (Non-polluting, CTE Exempt)</option>
                  <option value="Green">Green Category (Low pollution score 21-40)</option>
                  <option value="Orange">Orange Category (Medium score 41-59)</option>
                  <option value="Red">Red Category (Heavy Industry score 60+)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Next: Workforce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: WORKFORCE & LABOUR */}
      {currentStep === 4 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Workforce & Factory Act Thresholds
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Determines Factories Act 1948 applicability, contract labour licences, and welfare mandates.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Peak Headcount (Direct + Contract Workers):</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">
                  {formData.employeeCount} Personnel
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>&lt; 10 (Shops & Estb)</span>
                <span>20+ with Power (Factories Act)</span>
                <span>100+ (Canteen & Crèche)</span>
                <span>500+ (Safety Officer)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Next: Operational Triggers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: OPERATIONAL TRIGGERS */}
      {currentStep === 5 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Specialized Operational Triggers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Check all equipment, chemicals, or utilities operating at your facility.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'hasHazardousMaterials',
                label: 'Storage of Hazardous Chemicals / Toxic Solvents',
                desc: 'Requires Petroleum & Explosives Safety Org (PESO) licence and hazardous waste authorization.',
              },
              {
                id: 'hasHighTensionPower',
                label: 'High Tension Electricity Connection (> 11 kV / 100 kVA)',
                desc: 'Requires Electrical Inspectorate CEIG safety certificate and HT connection sanction.',
              },
              {
                id: 'hasBoilerOrPressureVessel',
                label: 'Industrial Boilers or Unfired Pressure Vessels Installed',
                desc: 'Mandates Indian Boiler Regulations (IBR) registration and annual hydrostatic test.',
              },
              {
                id: 'hasWorkerCanteen',
                label: 'Dedicated In-House Canteen / Kitchen Facility',
                desc: 'Requires Food Safety and Standards Authority of India (FSSAI) state food licence.',
              },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(formData as any)[item.id]}
                  onChange={(e) => handleInputChange(item.id, e.target.checked)}
                  className="mt-1 w-4 h-4 text-fuchsia-600 rounded focus:ring-fuchsia-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Next: Review & Evaluate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SUMMARY & RUN ANALYSIS */}
      {currentStep === 6 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Profile Summary & Rule Engine Trigger
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Confirm your enterprise parameters before executing deterministic statutory rule queries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Sector</span>
              <span className="font-bold text-slate-900 dark:text-white">{formData.sector}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formData.location.city}, {formData.location.state}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Capital Investment</span>
              <span className="font-black text-fuchsia-600 dark:text-fuchsia-400">
                ₹{(formData.investmentAmount / 10000000).toFixed(2)} Cr
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Personnel</span>
              <span className="font-bold text-slate-900 dark:text-white">{formData.employeeCount} Employees</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Environmental Status</span>
              <span className="font-bold text-amber-600">{formData.environmentalCategory} Category</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Stage</span>
              <span className="font-bold text-slate-900 dark:text-white">{formData.stage}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Back
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-8 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 hover:from-violet-700 hover:to-amber-600 text-white shadow-xl shadow-fuchsia-500/25 flex items-center gap-2 transition-all disabled:opacity-50 hover:scale-102"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating 45+ Statutory Rules...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze My Requirements</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: RESULTS VIEW (REQUIREMENTS DISCOVERY) */}
      {currentStep === 7 && evaluationResult && (
        <div className="space-y-6">
          {/* Summary Banner with Rich Purple/Fuchsia Gradient */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-950 text-white shadow-xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                Rule Engine Evaluation Concluded
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-2">
                {evaluationResult.totalIdentified} Mandatory Statutory Clearances Identified
              </h2>
              <p className="text-xs text-purple-200 mt-1 max-w-xl">
                Based on your {formData.sector} unit in {formData.location.state} with CapEx of ₹
                {(formData.investmentAmount / 10000000).toFixed(2)} Cr, our rules identified{' '}
                {evaluationResult.highPriorityCount} critical path approvals.
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6 shrink-0 relative z-10">
              <div>
                <div className="text-2xl font-black text-white">{evaluationResult.estimatedOverallDays}</div>
                <div className="text-[10px] uppercase text-purple-200 font-bold">Estimated Days</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">
                  ₹{(evaluationResult.estimatedTotalFees / 1000).toFixed(0)}k
                </div>
                <div className="text-[10px] uppercase text-purple-200 font-bold">Statutory Fees</div>
              </div>
            </div>

            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'NOC', 'Licence', 'Registration', 'Permission'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  filterCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat} ({cat === 'All' ? requirementsList.length : requirementsList.filter((r) => r.category === cat).length})
              </button>
            ))}
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-fuchsia-500 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50">
                      {req.category}
                    </span>
                    <StatusBadge status={req.priority === 'High' ? 'High Risk' : 'Medium'} size="sm" />
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {req.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1">
                    {req.department}
                  </p>

                  <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    {req.whyRequired}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {req.processingTime}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{req.feeInfo}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedRequirement(req)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleStartApplication(req)}
                    className="px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm flex items-center gap-1 transition-all"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED REQUIREMENT MODAL */}
      {selectedRequirement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300">
                    {selectedRequirement.category}
                  </span>
                  <StatusBadge status={selectedRequirement.priority} size="sm" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedRequirement.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Issuing Authority: {selectedRequirement.issuingAuthority}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequirement(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white mb-1 uppercase tracking-wider text-[10px] text-slate-400">
                  Why is this Statutory Clearance Required?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {selectedRequirement.whyRequired}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">SLA Turnaround</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedRequirement.processingTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Statutory Fee</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedRequirement.feeInfo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Site Inspection</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {selectedRequirement.inspectionRequired ? 'Mandatory Joint Field Inspection' : 'Desk Scrutiny Only'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Renewal Validity</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedRequirement.renewalPeriod}</span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  Mandatory Prerequisite Documents
                </h4>
                <div className="space-y-1.5">
                  {selectedRequirement.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  Step-by-Step Approval Lifecycle
                </h4>
                <div className="space-y-1.5">
                  {selectedRequirement.applicationSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
                      <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  handleAddToChecklist(selectedRequirement);
                  setSelectedRequirement(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
              >
                Add to My Checklist
              </button>
              <button
                onClick={() => {
                  handleStartApplication(selectedRequirement);
                  setSelectedRequirement(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>Initiate Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
