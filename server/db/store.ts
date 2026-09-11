import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Business,
  RequirementRule,
  ChecklistItem,
  DocumentRecord,
  Application,
  Inspection,
  GovernmentScheme,
  Grievance,
  NotificationItem,
  RiskAssessment,
  AuditLog,
  Department,
  DeadlineItem,
} from './schema.js';

interface DatabaseData {
  users: User[];
  businesses: Business[];
  rules: RequirementRule[];
  checklists: ChecklistItem[];
  documents: DocumentRecord[];
  applications: Application[];
  inspections: Inspection[];
  schemes: GovernmentScheme[];
  grievances: Grievance[];
  notifications: NotificationItem[];
  riskAssessments: RiskAssessment[];
  auditLogs: AuditLog[];
  departments: Department[];
  deadlines: DeadlineItem[];
  systemSettings: {
    platformName: string;
    maintenanceMode: boolean;
    requireInspectionForHighRisk: boolean;
    slaWarningDays: number;
    emailAlertsEnabled: boolean;
    autoAssignOfficers: boolean;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Helper to generate hash
const hashPassword = (plain: string) => {
  return bcrypt.hashSync(plain, 10);
};

export class DatabaseStore {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read from data/db.json, seeding fresh data...', e);
    }
    const seeded = this.generateSeedData();
    this.saveData(seeded);
    return seeded;
  }

  private saveData(data: DatabaseData = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db.json:', e);
    }
  }

  public persist() {
    this.saveData(this.data);
  }

  public getData(): DatabaseData {
    return this.data;
  }

  // --- Seed Data Generator ---
  private generateSeedData(): DatabaseData {
    const adminPass = hashPassword('admin123');
    const staffPass = hashPassword('staff123');
    const officerPass = hashPassword('officer123');
    const bizPass = hashPassword('business123');

    const users: User[] = [
      {
        id: 'usr-admin-01',
        name: 'Devendra Sharma',
        email: 'admin@compliance.gov.in',
        password: adminPass,
        role: 'admin',
        designation: 'Chief Compliance Commissioner',
        phone: '+91 98110 22341',
        status: 'active',
        createdAt: '2026-01-01T08:00:00Z',
      },
      {
        id: 'usr-staff-fire',
        name: 'Rakesh Verma',
        email: 'staff.fire@compliance.gov.in',
        password: staffPass,
        role: 'department_staff',
        department: 'Fire Safety',
        designation: 'Divisional Fire Officer',
        phone: '+91 94220 55122',
        status: 'active',
        createdAt: '2026-01-10T09:00:00Z',
      },
      {
        id: 'usr-staff-env',
        name: 'Sunita Menon',
        email: 'staff.env@compliance.gov.in',
        password: staffPass,
        role: 'department_staff',
        department: 'Environment Department',
        designation: 'Senior Environmental Engineer',
        phone: '+91 98450 33412',
        status: 'active',
        createdAt: '2026-01-10T09:00:00Z',
      },
      {
        id: 'usr-staff-labour',
        name: 'Arun Sundaram',
        email: 'staff.labour@compliance.gov.in',
        password: staffPass,
        role: 'department_staff',
        department: 'Labour Department',
        designation: 'Assistant Labour Commissioner',
        phone: '+91 97230 44109',
        status: 'active',
        createdAt: '2026-01-10T09:00:00Z',
      },
      {
        id: 'usr-officer-01',
        name: 'Rajesh K. Pillai',
        email: 'officer.rajesh@compliance.gov.in',
        password: officerPass,
        role: 'inspection_officer',
        department: 'State Joint Inspection Cell',
        designation: 'Senior Field Compliance Inspector',
        phone: '+91 98211 44522',
        status: 'active',
        createdAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'usr-officer-02',
        name: 'Anita Roy',
        email: 'officer.anita@compliance.gov.in',
        password: officerPass,
        role: 'inspection_officer',
        department: 'Pollution Control & Safety',
        designation: 'Environmental Inspection Officer',
        phone: '+91 98300 77611',
        status: 'active',
        createdAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'usr-biz-01',
        name: 'Vikramaditya Rao',
        email: 'founder@novatech.com',
        password: bizPass,
        role: 'business_user',
        designation: 'Managing Director',
        phone: '+91 99001 88234',
        businessId: 'biz-novatech-01',
        status: 'active',
        createdAt: '2026-01-20T11:00:00Z',
      },
      {
        id: 'usr-biz-02',
        name: 'Pooja Agarwal',
        email: 'pooja@zenithlogistics.in',
        password: bizPass,
        role: 'business_user',
        designation: 'CEO & Co-founder',
        phone: '+91 98770 12345',
        businessId: 'biz-zenith-02',
        status: 'active',
        createdAt: '2026-02-01T10:00:00Z',
      }
    ];

    const businesses: Business[] = [
      {
        id: 'biz-novatech-01',
        userId: 'usr-biz-01',
        name: 'NovaTech Manufacturing Pvt. Ltd.',
        registrationNumber: 'U29100TN2026PTC149822',
        panNumber: 'AAACN9821K',
        gstin: '33AAACN9821K1Z5',
        sector: 'Manufacturing',
        stage: 'Construction',
        investmentAmount: 25000000, // INR 2.5 Crore
        employeeCount: 65,
        location: {
          state: 'Tamil Nadu',
          district: 'Kanchipuram',
          city: 'Sriperumbudur',
          zone: 'Industrial Area / Zone',
          address: 'Plot 42-B, SIPCOT Industrial Park, Phase II, Sriperumbudur',
        },
        projectSize: 'Medium',
        landBuildingInfo: {
          type: 'Industrial Park',
          areaSqFt: 45000,
          plotNumber: 'SIPCOT-B42',
        },
        expectedOperationalDate: '2026-11-30',
        environmentalCategory: 'Orange',
        manufacturingCategory: 'Precision Automotive & Engineering Components',
        buildingType: 'Industrial Factory',
        riskCategory: 'Medium',
        complianceScore: 68,
        status: 'Action Required',
        createdAt: '2026-01-20T11:30:00Z',
        updatedAt: '2026-03-01T09:00:00Z',
      },
      {
        id: 'biz-zenith-02',
        userId: 'usr-biz-02',
        name: 'Zenith Cold Chain & Logistics LLP',
        registrationNumber: 'AAQ-8912',
        panNumber: 'AABFZ4421P',
        gstin: '27AABFZ4421P1ZT',
        sector: 'Logistics',
        stage: 'Pre-operation',
        investmentAmount: 48000000, // INR 4.8 Crore
        employeeCount: 42,
        location: {
          state: 'Maharashtra',
          district: 'Raigad',
          city: 'Panvel',
          zone: 'Commercial',
          address: 'Survey 112/A, JNPT Corridor, Panvel',
        },
        projectSize: 'Medium',
        landBuildingInfo: {
          type: 'Owned',
          areaSqFt: 60000,
          plotNumber: 'JNPT-Logi-12',
        },
        expectedOperationalDate: '2026-08-15',
        environmentalCategory: 'Green',
        buildingType: 'Warehouse',
        riskCategory: 'Low',
        complianceScore: 84,
        status: 'Compliant',
        createdAt: '2026-02-01T10:30:00Z',
        updatedAt: '2026-03-05T12:00:00Z',
      },
      {
        id: 'biz-saffron-03',
        userId: 'usr-admin-01',
        name: 'Saffron Cloud Kitchens & Hospitality',
        registrationNumber: 'U55101KA2025PTC099124',
        panNumber: 'AALCS2290M',
        gstin: '29AALCS2290M1Z2',
        sector: 'Restaurant',
        stage: 'Operational',
        investmentAmount: 8500000,
        employeeCount: 28,
        location: {
          state: 'Karnataka',
          district: 'Bengaluru Urban',
          city: 'Bengaluru',
          zone: 'Commercial',
          address: '14th Main, Indiranagar',
        },
        projectSize: 'Small',
        landBuildingInfo: {
          type: 'Leased',
          areaSqFt: 8500,
        },
        expectedOperationalDate: '2025-10-01',
        environmentalCategory: 'Green',
        buildingType: 'Commercial Complex',
        riskCategory: 'Low',
        complianceScore: 92,
        status: 'Compliant',
        createdAt: '2025-10-01T08:00:00Z',
        updatedAt: '2026-02-28T14:00:00Z',
      }
    ];

    const departments: Department[] = [
      { id: 'dept-fire', name: 'Fire & Emergency Services', code: 'FIRE', headName: 'Chief Fire Officer S. Raman', activeOfficers: 8, pendingApplications: 14, avgProcessingDays: 12, approvalRate: 88 },
      { id: 'dept-env', name: 'State Pollution Control Board', code: 'SPCB', headName: 'Member Secretary Dr. P. Iyer', activeOfficers: 12, pendingApplications: 23, avgProcessingDays: 21, approvalRate: 76 },
      { id: 'dept-labour', name: 'Department of Labour & Employment', code: 'LABOUR', headName: 'Commissioner K. Natarajan', activeOfficers: 9, pendingApplications: 9, avgProcessingDays: 8, approvalRate: 94 },
      { id: 'dept-local', name: 'Urban Local Body / Municipal Corp', code: 'MUNI', headName: 'Zonal Commissioner V. Selvam', activeOfficers: 15, pendingApplications: 31, avgProcessingDays: 16, approvalRate: 82 },
      { id: 'dept-revenue', name: 'Revenue & Land Administration', code: 'REV', headName: 'District Collector Kanchipuram', activeOfficers: 6, pendingApplications: 11, avgProcessingDays: 25, approvalRate: 71 },
      { id: 'dept-building', name: 'Directorate of Town & Country Planning', code: 'DTCP', headName: 'Chief Town Planner M. Krishnan', activeOfficers: 10, pendingApplications: 18, avgProcessingDays: 19, approvalRate: 80 },
      { id: 'dept-power', name: 'State Electricity Distribution Corp', code: 'TANGEDCO', headName: 'Superintending Engineer T. Bala', activeOfficers: 11, pendingApplications: 12, avgProcessingDays: 10, approvalRate: 91 },
      { id: 'dept-industry', name: 'District Industries Centre (DIC)', code: 'DIC', headName: 'General Manager R. Subash', activeOfficers: 7, pendingApplications: 6, avgProcessingDays: 6, approvalRate: 96 }
    ];

    // Master Requirement Rules (Evaluated by backend rule engine)
    const rules: RequirementRule[] = [
      {
        id: 'rule-biz-reg',
        name: 'Incorporation & Business Registration (MCA / RoC)',
        category: 'Registration',
        department: 'District Industries Centre (DIC)',
        priority: 'High',
        riskLevel: 'Low',
        applicableSectors: ['*'],
        applicableLocations: ['*'],
        applicableStages: ['*'],
        minInvestment: 0,
        requiredDocuments: ['Certificate of Incorporation', 'Memorandum of Association (MoA)', 'PAN / Tax Card of Directors'],
        inspectionRequired: false,
        renewalPeriod: 'One-Time',
        processingTime: '3-7 Days',
        feeInfo: '₹1,000 - ₹5,000 based on authorized capital',
        issuingAuthority: 'Ministry of Corporate Affairs / Registrar of Companies',
        description: 'Mandatory legal registration granting legal corporate persona and operational rights.',
        whyRequired: 'Legal statutory mandate under Section 7 of the Companies Act before commencing commercial transactions.',
        applicationSteps: [
          'File SPICe+ form on corporate portal',
          'Submit digital signatures and director DINs',
          'Receive Certificate of Incorporation with PAN & TAN'
        ],
        status: 'active',
      },
      {
        id: 'rule-trade-lic',
        name: 'Municipal Trade License & Health Permit',
        category: 'Licence',
        department: 'Urban Local Body / Municipal Corp',
        priority: 'High',
        riskLevel: 'Medium',
        applicableSectors: ['*'],
        applicableLocations: ['*'],
        applicableStages: ['Establishment', 'Construction', 'Pre-operation', 'Operational', 'Expansion'],
        minInvestment: 0,
        requiredDocuments: ['Property Tax Receipt / Lease Deed', 'Building Sanction Plan', 'Incorporation Certificate'],
        inspectionRequired: true,
        renewalPeriod: 'Annual',
        processingTime: '7-14 Days',
        feeInfo: '₹3,500 annual municipal tariff',
        issuingAuthority: 'Municipal Corporation / Local Body Licensing Cell',
        description: 'Permission issued by the municipal body certifying that business premises do not breach urban zoning and public safety standards.',
        whyRequired: 'Mandatory under State Municipal Corporation Act to operate commercial or industrial premises within municipal boundaries.',
        applicationSteps: [
          'Submit municipal trade license online form',
          'Upload property ownership or registered lease agreement',
          'Field inspector physical verification of premises',
          'Fee deposit and instant digital license issuance'
        ],
        status: 'active',
      },
      {
        id: 'rule-fire-noc',
        name: 'Fire Safety Clearance & Preliminary NOC',
        category: 'NOC',
        department: 'Fire & Emergency Services',
        priority: 'High',
        riskLevel: 'High',
        applicableSectors: ['Manufacturing', 'Restaurant', 'Logistics', 'Construction', 'Education'],
        applicableLocations: ['*'],
        applicableStages: ['Construction', 'Pre-operation', 'Operational', 'Expansion'],
        minInvestment: 1000000,
        requiredDocuments: ['Site Layout & Floor Plan with Fire Escapes', 'Building Sanction Plan', 'Fire Fighting Equipment Layout & Vendor Certification'],
        inspectionRequired: true,
        renewalPeriod: 'Annual',
        processingTime: '15-21 Days',
        feeInfo: '₹12,500 assessment and safety inspection fee',
        issuingAuthority: 'Directorate of Fire and Rescue Services',
        description: 'Comprehensive statutory clearance verifying active and passive firefighting systems, setbacks, hydrants, and emergency evacuation exits.',
        whyRequired: 'Crucial life-safety statutory mandate under National Building Code (NBC Part IV) and State Fire Force Act.',
        applicationSteps: [
          'Upload engineering blueprints showing hydrant rings, smoke alarms, and exit routes',
          'On-site field audit by Divisional Fire Officer',
          'Demonstration of pressure tests and pump room functioning',
          'Issuance of formal Fire NOC'
        ],
        status: 'active',
      },
      {
        id: 'rule-env-cte',
        name: 'Consent to Establish (CTE) / Environmental Clearance',
        category: 'NOC',
        department: 'State Pollution Control Board',
        priority: 'High',
        riskLevel: 'High',
        applicableSectors: ['Manufacturing', 'Construction', 'Logistics'],
        applicableLocations: ['*'],
        applicableStages: ['Establishment', 'Construction', 'Expansion'],
        minInvestment: 2500000,
        environmentalCategories: ['Orange', 'Red', 'Green'],
        requiredDocuments: ['Detailed Project Report (DPR)', 'Land Possession / SIPCOT Allotment Order', 'Effluent & Air Emission Treatment Plan', 'Material Balance Flowchart'],
        inspectionRequired: true,
        renewalPeriod: '5 Years',
        processingTime: '30-45 Days',
        feeInfo: '₹35,000 tiered pollution consent fee',
        issuingAuthority: 'State Pollution Control Board (SPCB)',
        description: 'Mandatory statutory permission prior to initiating plant civil foundation and mechanical installations.',
        whyRequired: 'Statutory compliance under Water (Prevention and Control of Pollution) Act 1974 & Air Act 1981.',
        applicationSteps: [
          'Submit environmental flowcharts and waste treatment schemes',
          'Technical appraisal by Consent Committee',
          'Board site visit and baseline ambient air sampling',
          'Grant of Consent to Establish with environmental stipulations'
        ],
        status: 'active',
      },
      {
        id: 'rule-factory-lic',
        name: 'Factories Act Registration & License to Work',
        category: 'Licence',
        department: 'Department of Labour & Employment',
        priority: 'High',
        riskLevel: 'Medium',
        applicableSectors: ['Manufacturing'],
        applicableLocations: ['*'],
        applicableStages: ['Pre-operation', 'Construction', 'Operational', 'Expansion'],
        minInvestment: 5000000,
        minEmployees: 10,
        requiredDocuments: ['Factory Layout Plan approved by DISH', 'List of Machinery & Horsepower Ratings', 'Nomination of Factory Manager', 'Form 1 Application'],
        inspectionRequired: true,
        renewalPeriod: 'Annual',
        processingTime: '14-20 Days',
        feeInfo: '₹7,500 based on power connection and worker strength',
        issuingAuthority: 'Directorate of Industrial Safety and Health (DISH)',
        description: 'Licensing framework overseeing worker occupational welfare, machinery guarding, ventilation, and shift hours.',
        whyRequired: 'Enforced by Section 6 of the Factories Act 1948 for all manufacturing units employing 10+ workers with power.',
        applicationSteps: [
          'Approval of factory structural and machinery drawings',
          'Safety officer appointment declaration',
          'DISH Inspector physical audit for machine safety guards',
          'Digital Factory License registration'
        ],
        status: 'active',
      },
      {
        id: 'rule-building-plan',
        name: 'Industrial Building Sanction & Plan Approval',
        category: 'Permission',
        department: 'Directorate of Town & Country Planning',
        priority: 'High',
        riskLevel: 'Medium',
        applicableSectors: ['Manufacturing', 'Construction', 'Logistics'],
        applicableLocations: ['*'],
        applicableStages: ['Establishment', 'Construction'],
        minInvestment: 1000000,
        requiredDocuments: ['Architectural Elevation & Section CAD Drawings', 'Structural Stability Certificate by Chartered Engineer', 'Land Title Document / Sale Deed'],
        inspectionRequired: true,
        renewalPeriod: '3 Years',
        processingTime: '21-30 Days',
        feeInfo: '₹22,000 infrastructure development & scrutiny fee',
        issuingAuthority: 'Town & Country Planning Authority',
        description: 'Formal planning permission ensuring setback compliance, Floor Space Index (FSI), parking bays, and structural stability.',
        whyRequired: 'Mandatory under State Town and Country Planning Act before initiating any structural erection.',
        applicationSteps: [
          'Online scrutiny through automated CAD plan checker',
          'Verification of revenue titles and industrial zoning',
          'Joint site inspection by assistant town planner',
          'Issuance of building sanction order'
        ],
        status: 'active',
      },
      {
        id: 'rule-power-ht',
        name: 'High Tension (HT) Industrial Power Sanction & Line Drawal',
        category: 'Permission',
        department: 'State Electricity Distribution Corp',
        priority: 'Medium',
        riskLevel: 'Medium',
        applicableSectors: ['Manufacturing', 'Logistics', 'Construction'],
        applicableLocations: ['*'],
        applicableStages: ['Construction', 'Pre-operation', 'Operational'],
        minInvestment: 2000000,
        requiredDocuments: ['Connected Load Estimate & Single Line Diagram (SLD)', 'Electrical Inspectorate Safety Certificate', 'Proof of Premises Ownership'],
        inspectionRequired: true,
        renewalPeriod: 'One-Time',
        processingTime: '15-25 Days',
        feeInfo: '₹50,000 security deposit + infrastructure charges',
        issuingAuthority: 'State Electricity Distribution Corporation (Discom)',
        description: 'Grid connection feasibility, dedicated transformer yard setup, and high-tension feeder line sanction.',
        whyRequired: 'Required for power energization above 112 KW contracted demand.',
        applicationSteps: [
          'Feasibility study from nearest 110kV/33kV substation',
          'Transformer erection and earthing inspection by Electrical Inspectorate',
          'Meter installation, testing, and energization'
        ],
        status: 'active',
      },
      {
        id: 'rule-labour-clra',
        name: 'Contract Labour (Regulation & Abolition) Registration',
        category: 'Registration',
        department: 'Department of Labour & Employment',
        priority: 'Medium',
        riskLevel: 'Low',
        applicableSectors: ['*'],
        applicableLocations: ['*'],
        applicableStages: ['Construction', 'Pre-operation', 'Operational', 'Expansion'],
        minInvestment: 0,
        minEmployees: 20,
        requiredDocuments: ['Contractor Agreements (Form V)', 'Trade License', 'PF & ESI Registration Numbers'],
        inspectionRequired: false,
        renewalPeriod: 'Annual',
        processingTime: '7-10 Days',
        feeInfo: '₹2,000 registration fee',
        issuingAuthority: 'Office of the Registering Officer & Assistant Labour Commissioner',
        description: 'Principal Employer registration for engaging contract manpower or construction labor.',
        whyRequired: 'Statutory mandate under Section 7 of CLRA Act 1970 for establishments engaging 20+ contract workers.',
        applicationSteps: [
          'Register as Principal Employer on unified labour portal',
          'Submit contractor work order details',
          'Instant automatic certificate download'
        ],
        status: 'active',
      },
      {
        id: 'rule-boiler-noc',
        name: 'Industrial Boiler & Pressure Vessel Inspection Certificate',
        category: 'NOC',
        department: 'Directorate of Town & Country Planning',
        priority: 'Medium',
        riskLevel: 'High',
        applicableSectors: ['Manufacturing'],
        applicableLocations: ['*'],
        applicableStages: ['Construction', 'Pre-operation'],
        minInvestment: 5000000,
        requiredDocuments: ['Manufacturer Boiler Test Certificate', 'Welder Qualification Records', 'Hydrostatic Test Log'],
        inspectionRequired: true,
        renewalPeriod: 'Annual',
        processingTime: '14-20 Days',
        feeInfo: '₹8,000 boiler inspection tariff',
        issuingAuthority: 'Chief Inspector of Boilers',
        description: 'Safety hydrostatic pressure tests and steam piping integrity certification.',
        whyRequired: 'Mandatory under Indian Boilers Act 1923 for high pressure steam vessels.',
        applicationSteps: [
          'Submit boiler design calculations and piping isometrics',
          'Inspector physical witness of hydraulic pressure test',
          'Registration number stamping and steam permit grant'
        ],
        status: 'active',
      }
    ];

    // Checklists for NovaTech
    const checklists: ChecklistItem[] = [
      {
        id: 'chk-01',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-biz-reg',
        name: 'Certificate of Incorporation & Business ID',
        category: 'Registration',
        department: 'District Industries Centre (DIC)',
        priority: 'High',
        status: 'completed',
        documentId: 'doc-01',
        applicationId: 'APP-2026-0101',
        completedAt: '2026-01-25T14:00:00Z',
        notes: 'Verified and registered under MCA portal.',
      },
      {
        id: 'chk-02',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-trade-lic',
        name: 'Municipal Trade License & Urban Permit',
        category: 'Licence',
        department: 'Urban Local Body / Municipal Corp',
        priority: 'High',
        status: 'completed',
        documentId: 'doc-02',
        applicationId: 'APP-2026-0102',
        completedAt: '2026-02-05T10:00:00Z',
        notes: 'Annual license paid and cleared.',
      },
      {
        id: 'chk-03',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-building-plan',
        name: 'Industrial Building Sanction & Plan Approval',
        category: 'Permission',
        department: 'Directorate of Town & Country Planning',
        priority: 'High',
        status: 'completed',
        documentId: 'doc-03',
        applicationId: 'APP-2026-0103',
        completedAt: '2026-02-18T16:00:00Z',
        notes: 'Civil construction permitted as per SIPCOT plan.',
      },
      {
        id: 'chk-04',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-fire-noc',
        name: 'Fire Safety Clearance & Preliminary NOC',
        category: 'NOC',
        department: 'Fire & Emergency Services',
        priority: 'High',
        status: 'pending',
        documentId: 'doc-04',
        applicationId: 'APP-2026-0842',
        dueDate: '2026-03-15',
        notes: 'Inspection scheduled for sprinkler lines and pump head verification.',
      },
      {
        id: 'chk-05',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-env-cte',
        name: 'Consent to Establish (CTE) / Environmental Clearance',
        category: 'NOC',
        department: 'State Pollution Control Board',
        priority: 'High',
        status: 'pending',
        applicationId: 'APP-2026-0843',
        dueDate: '2026-03-22',
        notes: 'Clarification requested by SPCB engineer regarding ETP capacity.',
      },
      {
        id: 'chk-06',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-factory-lic',
        name: 'Factories Act Registration & License to Work',
        category: 'Licence',
        department: 'Department of Labour & Employment',
        priority: 'High',
        status: 'pending',
        dueDate: '2026-04-10',
        notes: 'Application draft in progress. Machinery list required.',
      },
      {
        id: 'chk-07',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-power-ht',
        name: 'High Tension (HT) Industrial Power Sanction',
        category: 'Permission',
        department: 'State Electricity Distribution Corp',
        priority: 'Medium',
        status: 'pending',
        dueDate: '2026-04-30',
        notes: 'Single Line Diagram uploaded, awaiting feeder feasibility.',
      },
      {
        id: 'chk-08',
        businessId: 'biz-novatech-01',
        requirementId: 'rule-labour-clra',
        name: 'Contract Labour (CLRA) Principal Employer Registration',
        category: 'Registration',
        department: 'Department of Labour & Employment',
        priority: 'Medium',
        status: 'pending',
        dueDate: '2026-05-15',
        notes: '65 workers on site, contractor Form V to be attached.',
      }
    ];

    // Documents for NovaTech
    const documents: DocumentRecord[] = [
      {
        id: 'doc-01',
        businessId: 'biz-novatech-01',
        name: 'Certificate of Incorporation (CIN)',
        category: 'Registration',
        fileName: 'NovaTech_Incorporation_MCA.pdf',
        fileType: 'application/pdf',
        fileSize: 1420500,
        fileUrl: '/uploads/NovaTech_Incorporation_MCA.pdf',
        uploadDate: '2026-01-22T10:00:00Z',
        verificationStatus: 'Verified',
        verifiedBy: 'Devendra Sharma (Admin)',
        verifiedAt: '2026-01-23T11:00:00Z',
        validationDetails: {
          formatValid: true,
          sizeValid: true,
          requiredDocumentFound: true,
          expiryApproaching: false,
          remarks: 'Valid MCA digital signature detected. CIN confirmed.',
        },
      },
      {
        id: 'doc-02',
        businessId: 'biz-novatech-01',
        name: 'Land Allotment Order & SIPCOT Lease Deed',
        category: 'Land/Property',
        fileName: 'SIPCOT_Plot_B42_Allotment.pdf',
        fileType: 'application/pdf',
        fileSize: 2840000,
        fileUrl: '/uploads/SIPCOT_Plot_B42_Allotment.pdf',
        uploadDate: '2026-01-24T12:00:00Z',
        verificationStatus: 'Verified',
        verifiedBy: 'V. Selvam (Local Body)',
        verifiedAt: '2026-01-25T14:30:00Z',
        validationDetails: {
          formatValid: true,
          sizeValid: true,
          requiredDocumentFound: true,
          expiryApproaching: false,
          remarks: 'Registered lease deed valid for 99 years.',
        },
      },
      {
        id: 'doc-03',
        businessId: 'biz-novatech-01',
        name: 'Approved Industrial Building Sanction Plan',
        category: 'Safety',
        fileName: 'DTCP_Sanctioned_Blueprint_v3.pdf',
        fileType: 'application/pdf',
        fileSize: 4520100,
        fileUrl: '/uploads/DTCP_Sanctioned_Blueprint_v3.pdf',
        uploadDate: '2026-02-10T09:30:00Z',
        verificationStatus: 'Verified',
        verifiedBy: 'M. Krishnan (DTCP)',
        verifiedAt: '2026-02-12T15:00:00Z',
        validationDetails: {
          formatValid: true,
          sizeValid: true,
          requiredDocumentFound: true,
          expiryApproaching: false,
          remarks: 'Complies with setbacks, FSI 1.5, and heavy vehicle bays.',
        },
      },
      {
        id: 'doc-04',
        businessId: 'biz-novatech-01',
        name: 'Fire Fighting System Layout & Blueprints',
        category: 'Safety',
        fileName: 'Fire_Hydrant_Network_Schematics.pdf',
        fileType: 'application/pdf',
        fileSize: 3120000,
        fileUrl: '/uploads/Fire_Hydrant_Network_Schematics.pdf',
        uploadDate: '2026-02-25T16:00:00Z',
        verificationStatus: 'Pending Verification',
        validationDetails: {
          formatValid: true,
          sizeValid: true,
          requiredDocumentFound: true,
          expiryApproaching: false,
          remarks: 'Awaiting field inspector physical verification.',
        },
      },
      {
        id: 'doc-05',
        businessId: 'biz-novatech-01',
        name: 'Environmental Management Plan & ETP Flowchart',
        category: 'Environmental',
        fileName: 'NovaTech_ETP_Scheme_and_DPR.pdf',
        fileType: 'application/pdf',
        fileSize: 5210000,
        fileUrl: '/uploads/NovaTech_ETP_Scheme_and_DPR.pdf',
        uploadDate: '2026-02-28T11:00:00Z',
        verificationStatus: 'Pending Verification',
        validationDetails: {
          formatValid: true,
          sizeValid: true,
          requiredDocumentFound: true,
          expiryApproaching: false,
          remarks: 'Clarification pending on daily sludge disposal.',
        },
      },
      {
        id: 'doc-06',
        businessId: 'biz-novatech-01',
        name: 'Previous Trade License Certificate',
        category: 'Registration',
        fileName: 'Trade_License_Expired_2025.pdf',
        fileType: 'application/pdf',
        fileSize: 840000,
        fileUrl: '/uploads/Trade_License_Expired_2025.pdf',
        uploadDate: '2026-01-20T10:00:00Z',
        expiryDate: '2026-03-31',
        verificationStatus: 'Expiring Soon',
        validationDetails: {
          formatValid: true,
          sizeValid: true,
          requiredDocumentFound: true,
          expiryApproaching: true,
          remarks: 'Expires in less than 30 days. Renewal application initiated.',
        },
      }
    ];

    // Applications for NovaTech
    const applications: Application[] = [
      {
        id: 'app-01',
        applicationId: 'APP-2026-0842',
        businessId: 'biz-novatech-01',
        businessName: 'NovaTech Manufacturing Pvt. Ltd.',
        requirementId: 'rule-fire-noc',
        requirementName: 'Fire Safety Clearance & Preliminary NOC',
        department: 'Fire Safety',
        category: 'NOC',
        submittedDate: '2026-02-25',
        status: 'Inspection',
        riskScore: 65,
        riskLevel: 'High',
        assignedOfficer: 'Rajesh K. Pillai',
        assignedOfficerId: 'usr-officer-01',
        progressPercentage: 70,
        documents: [
          { documentId: 'doc-03', name: 'Approved Building Plan', verified: true },
          { documentId: 'doc-04', name: 'Fire Fighting System Layout', verified: false }
        ],
        comments: [
          { by: 'Rakesh Verma', role: 'department_staff', date: '2026-02-27T10:00:00Z', message: 'Documents scrutinized. Preliminary safety schematics meet basic setbacks. Site physical inspection scheduled.' },
          { by: 'Vikramaditya Rao', role: 'business_user', date: '2026-02-27T14:30:00Z', message: 'Diesel pump backup and 50KL water reservoir are ready on site for pressure testing.' }
        ],
        timeline: [
          { stage: 'Submitted', status: 'completed', date: '2026-02-25', description: 'Application filed online with attached safety drawings', responsibleDepartment: 'Business User' },
          { stage: 'Documents Scrutinized', status: 'completed', date: '2026-02-27', description: 'Fire engineering desk audit completed', responsibleDepartment: 'Fire Safety', officerName: 'Rakesh Verma' },
          { stage: 'Department Review', status: 'completed', date: '2026-03-01', description: 'Assigned to Joint Inspection Cell for on-site physical audit', responsibleDepartment: 'Fire Safety' },
          { stage: 'Risk Assessment', status: 'completed', date: '2026-03-02', description: 'Risk Engine flagged High Priority: Industrial paint/welding hazard', responsibleDepartment: 'Risk Engine' },
          { stage: 'Site Inspection', status: 'in_progress', date: '2026-03-12', description: 'Physical audit and pressure testing by Officer Rajesh Pillai', responsibleDepartment: 'Inspection Cell', officerName: 'Rajesh K. Pillai' },
          { stage: 'Final Decision', status: 'pending', date: '2026-03-16', description: 'Issuance of Provisional Fire NOC upon inspection sign-off', responsibleDepartment: 'Fire Safety' }
        ],
        parallelDepartments: [
          { department: 'Fire Safety', status: 'Under Review', assignedDate: '2026-02-25', expectedCompletion: '2026-03-16' },
          { department: 'Building Authority', status: 'Approved', assignedDate: '2026-02-25', expectedCompletion: '2026-02-28', comments: 'Building structural clearance confirmed.' }
        ],
        createdAt: '2026-02-25T09:00:00Z',
        updatedAt: '2026-03-02T16:00:00Z',
      },
      {
        id: 'app-02',
        applicationId: 'APP-2026-0843',
        businessId: 'biz-novatech-01',
        businessName: 'NovaTech Manufacturing Pvt. Ltd.',
        requirementId: 'rule-env-cte',
        requirementName: 'Consent to Establish (CTE) / Environmental Clearance',
        department: 'Environment Department',
        category: 'NOC',
        submittedDate: '2026-02-28',
        status: 'Clarification Required',
        riskScore: 78,
        riskLevel: 'High',
        assignedOfficer: 'Sunita Menon',
        assignedOfficerId: 'usr-staff-env',
        progressPercentage: 45,
        documents: [
          { documentId: 'doc-05', name: 'Environmental Management Plan & ETP', verified: false }
        ],
        comments: [
          { by: 'Sunita Menon', role: 'department_staff', date: '2026-03-03T11:20:00Z', message: 'Clarification required: Please provide daily chemical oxygen demand (COD) estimates and tie-up letter with Common Effluent Treatment Plant (CETP) or solid hazardous waste management facility.' }
        ],
        timeline: [
          { stage: 'Submitted', status: 'completed', date: '2026-02-28', description: 'Application filed for Orange Category manufacturing unit', responsibleDepartment: 'Business User' },
          { stage: 'Desk Appraisal', status: 'completed', date: '2026-03-02', description: 'SPCB technical scrutiny noted missing CETP hazardous waste MoU', responsibleDepartment: 'Environment Department', officerName: 'Sunita Menon' },
          { stage: 'Clarification Notice', status: 'in_progress', date: '2026-03-03', description: 'Applicant notified to upload CETP authorization within 15 days', responsibleDepartment: 'Environment Department' },
          { stage: 'Inspection', status: 'pending', date: '2026-03-25', description: 'Sampling and ambient emission monitoring', responsibleDepartment: 'SPCB Field Office' },
          { stage: 'Approval', status: 'pending', date: '2026-04-05', description: 'Board order issuance', responsibleDepartment: 'Environment Department' }
        ],
        parallelDepartments: [
          { department: 'Environment Department', status: 'Under Review', assignedDate: '2026-02-28', expectedCompletion: '2026-04-05' }
        ],
        createdAt: '2026-02-28T10:00:00Z',
        updatedAt: '2026-03-03T11:20:00Z',
      },
      {
        id: 'app-03',
        applicationId: 'APP-2026-0101',
        businessId: 'biz-novatech-01',
        businessName: 'NovaTech Manufacturing Pvt. Ltd.',
        requirementId: 'rule-biz-reg',
        requirementName: 'Incorporation & Business Registration (MCA / RoC)',
        department: 'District Industries Centre (DIC)',
        category: 'Registration',
        submittedDate: '2026-01-22',
        status: 'Approved',
        riskScore: 12,
        riskLevel: 'Low',
        assignedOfficer: 'Devendra Sharma',
        progressPercentage: 100,
        documents: [{ documentId: 'doc-01', name: 'Certificate of Incorporation', verified: true }],
        comments: [{ by: 'Devendra Sharma', role: 'admin', date: '2026-01-23T11:00:00Z', message: 'All documents verified and compliant. Registered.' }],
        timeline: [
          { stage: 'Submitted', status: 'completed', date: '2026-01-22', description: 'Form SPICe+ filed', responsibleDepartment: 'Business User' },
          { stage: 'Approved', status: 'completed', date: '2026-01-23', description: 'Certificate of Incorporation issued', responsibleDepartment: 'MCA / RoC' }
        ],
        parallelDepartments: [],
        createdAt: '2026-01-22T08:00:00Z',
        updatedAt: '2026-01-23T11:00:00Z',
      }
    ];

    // Inspections
    const inspections: Inspection[] = [
      {
        id: 'insp-01',
        inspectionId: 'INSP-2026-019',
        businessId: 'biz-novatech-01',
        businessName: 'NovaTech Manufacturing Pvt. Ltd.',
        applicationId: 'APP-2026-0842',
        applicationRequirement: 'Fire Safety Clearance & Preliminary NOC',
        location: 'Plot 42-B, SIPCOT Industrial Park, Phase II, Sriperumbudur',
        inspectionType: 'Fire Safety Audit',
        scheduledDate: '2026-03-12T10:30:00Z',
        officerId: 'usr-officer-01',
        officerName: 'Rajesh K. Pillai',
        officerPhone: '+91 98211 44522',
        riskLevel: 'High',
        checklist: [
          { id: 'item-1', item: 'Adequate setback distance (minimum 6 meters clear path for fire tender)', category: 'Setbacks & Access', passed: true, notes: 'Clear 7.2 meter peripheral concrete driveway.' },
          { id: 'item-2', item: 'Functional dedicated fire water reservoir (min 50,000 liters storage)', category: 'Water Storage', passed: true, notes: 'Underground 75KL tank verified with level indicators.' },
          { id: 'item-3', item: 'Diesel backup pump starts automatically on main pressure drop', category: 'Pump House', passed: null, notes: 'Pending test during live demonstration.' },
          { id: 'item-4', item: 'Overhead wet sprinkler grid covers entire assembly bay', category: 'Sprinklers', passed: true, notes: 'UL-listed bulb sprinklers installed at 3.5m spacing.' },
          { id: 'item-5', item: 'Illuminated emergency exit signs & panic hardware on egress doors', category: 'Evacuation', passed: true, notes: 'Photoluminescent signage equipped with 3-hr battery.' },
          { id: 'item-6', item: 'Certified Class ABC & CO2 dry chemical portable extinguishers installed', category: 'Extinguishers', passed: null, notes: 'Hydrostatic date tags to be inspected.' }
        ],
        evidenceFiles: [
          { name: 'Driveway_Clearance_Photo.jpg', url: '/evidence/Driveway_Clearance_Photo.jpg', uploadTime: '2026-03-02T14:10:00Z' },
          { name: 'Pump_Room_Control_Panel.jpg', url: '/evidence/Pump_Room_Control_Panel.jpg', uploadTime: '2026-03-02T14:15:00Z' }
        ],
        remarks: 'Preliminary physical readiness is satisfactory. Main sprinkler hydraulic flow test and automatic diesel pump cutoff scheduled for final sign-off.',
        result: 'Pending',
        status: 'Scheduled',
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-02T14:20:00Z',
      },
      {
        id: 'insp-02',
        inspectionId: 'INSP-2026-014',
        businessId: 'biz-novatech-01',
        businessName: 'NovaTech Manufacturing Pvt. Ltd.',
        applicationId: 'APP-2026-0103',
        applicationRequirement: 'Industrial Building Sanction & Plan Approval',
        location: 'Plot 42-B, SIPCOT Industrial Park, Sriperumbudur',
        inspectionType: 'Structural Verification',
        scheduledDate: '2026-02-15T11:00:00Z',
        completedDate: '2026-02-16T15:00:00Z',
        officerId: 'usr-officer-01',
        officerName: 'Rajesh K. Pillai',
        officerPhone: '+91 98211 44522',
        riskLevel: 'Medium',
        checklist: [
          { id: 'str-1', item: 'Boundary demarcation matches revenue cadastre', category: 'Boundary', passed: true, notes: 'SIPCOT corner stones matched.' },
          { id: 'str-2', item: 'Structural steel columns anchored to Grade M30 reinforced concrete', category: 'Foundation', passed: true, notes: 'Cube strength certificates verified.' },
          { id: 'str-3', item: 'Rainwater harvesting percolation pits constructed', category: 'Drainage', passed: true, notes: '4 recharge pits completed.' }
        ],
        evidenceFiles: [
          { name: 'Site_Corner_Stones.jpg', url: '/evidence/Site_Corner_Stones.jpg', uploadTime: '2026-02-16T12:00:00Z' }
        ],
        remarks: 'Civil foundation and column alignment conform fully to sanctioned plans. Permitted for superstructure.',
        result: 'Passed',
        status: 'Completed',
        createdAt: '2026-02-14T09:00:00Z',
        updatedAt: '2026-02-16T16:00:00Z',
      }
    ];

    // Realistic Government Schemes (with Demo labeling)
    const schemes: GovernmentScheme[] = [
      {
        id: 'sch-01',
        name: 'Production Linked Incentive (PLI) for Auto Components',
        code: 'PLI-AUTO-2026',
        description: 'Financial incentive of 8% to 13% on incremental sales of advanced automotive technology components and precision engineering to boost domestic manufacturing.',
        eligibleBusinessTypes: ['Manufacturing'],
        location: ['Tamil Nadu', 'Maharashtra', 'Gujarat', 'Haryana', 'Karnataka', 'All States'],
        investmentRange: '₹2 Cr - ₹50 Cr',
        minInvestment: 20000000,
        maxInvestment: 500000000,
        benefits: [
          'Direct cash subsidy of 8% to 13% on incremental sales over base year',
          'Fast-track single window clearance for greenfield plants',
          'Export logistics concession reimbursement up to ₹25 Lakhs'
        ],
        requiredDocuments: [
          'Audited Net Worth Certificate (> ₹5 Crore)',
          'Factory License & Consent to Establish (CTE)',
          'Detailed Project Report (DPR) highlighting Advanced Automotive Tech'
        ],
        applicationProcess: 'Online application via National Single Window Portal with quarterly milestone validation.',
        deadline: '2026-09-30',
        subsidyPercentage: 11,
        maxSubsidyAmount: '₹5 Crore',
        status: 'Active',
        isFictionalDemo: false,
      },
      {
        id: 'sch-02',
        name: 'SIPCOT Industrial Capital Investment Subsidy (TN)',
        code: 'TN-SIPCOT-CAP-2026',
        description: 'Special capital subsidy of 25% on eligible plant and machinery investments for manufacturing units located in designated SIPCOT industrial estates.',
        eligibleBusinessTypes: ['Manufacturing', 'Logistics'],
        location: ['Tamil Nadu'],
        investmentRange: '₹1 Cr - ₹25 Cr',
        minInvestment: 10000000,
        maxInvestment: 250000000,
        benefits: [
          '25% Capital Subsidy on Plant & Machinery (up to ₹75 Lakhs)',
          '100% Stamp duty exemption on lease deed registration',
          'Subsidized power tariff of ₹1.50/unit rebate for initial 3 years'
        ],
        requiredDocuments: [
          'SIPCOT Land Allotment Letter',
          'Invoices of purchased machinery stamped by Chartered Engineer',
          'GST registration & Commercial Invoicing copy'
        ],
        applicationProcess: 'Apply through Tamil Nadu Guidance Single Window portal within 6 months of commencement of commercial production.',
        deadline: '2026-12-31',
        subsidyPercentage: 25,
        maxSubsidyAmount: '₹75 Lakhs',
        status: 'Active',
        isFictionalDemo: false,
      },
      {
        id: 'sch-03',
        name: 'MSME Green Energy & Rooftop Solar Adoption Scheme',
        code: 'MSME-SOLAR-GOV',
        description: 'Financial assistance of up to 40% capital grant for installing on-grid industrial rooftop solar panels and waste heat recovery systems.',
        eligibleBusinessTypes: ['Manufacturing', 'Restaurant', 'Logistics', 'Retail', 'Education'],
        location: ['All States'],
        investmentRange: '₹25 Lakhs - ₹5 Cr',
        minInvestment: 2500000,
        maxInvestment: 50000000,
        benefits: [
          '40% upfront subsidy on solar capacity up to 100 kVA',
          'Accelerated 40% depreciation in Year 1 for tax savings',
          'Net-metering priority approval from state distribution discom'
        ],
        requiredDocuments: [
          'Electricity Bill of Industrial Connection',
          'Rooftop Structural Stability Certificate',
          'Discom Net-metering feasibility report'
        ],
        applicationProcess: 'Submit quotation through National Rooftop Solar Portal with Discom sanction letter.',
        deadline: '2026-11-15',
        subsidyPercentage: 40,
        maxSubsidyAmount: '₹20 Lakhs',
        status: 'Active',
        isFictionalDemo: false,
      },
      {
        id: 'sch-04',
        name: 'Credit Guarantee Fund Trust for Micro & Small Enterprises (CGTMSE)',
        code: 'CGTMSE-COLLATERAL-FREE',
        description: 'Collateral-free credit facility up to ₹5 Crore for manufacturing and service enterprises with 85% sovereign guarantee coverage.',
        eligibleBusinessTypes: ['Manufacturing', 'Retail', 'Restaurant', 'IT / Software', 'Logistics'],
        location: ['All States'],
        investmentRange: '₹10 Lakhs - ₹5 Cr',
        minInvestment: 1000000,
        maxInvestment: 50000000,
        benefits: [
          'Collateral-free bank term loan and working capital credit',
          'Concessional guarantee fee rate of 0.37% per annum',
          'Immediate loan disbursement via partner PSU and private banks'
        ],
        requiredDocuments: [
          'Udyam Registration Certificate',
          'Project Financial Model & 3-Year Cash Flow Projections',
          'Business PAN & GST Returns'
        ],
        applicationProcess: 'Apply directly through any participating bank branch with CGTMSE guarantee endorsement.',
        deadline: '2026-12-31',
        subsidyPercentage: 0,
        maxSubsidyAmount: '₹5 Crore Credit Facility',
        status: 'Active',
        isFictionalDemo: false,
      }
    ];

    // Grievances
    const grievances: Grievance[] = [
      {
        id: 'grv-01',
        grievanceId: 'GRV-2026-0042',
        businessId: 'biz-novatech-01',
        businessName: 'NovaTech Manufacturing Pvt. Ltd.',
        category: 'Delay in Processing',
        applicationId: 'APP-2026-0843',
        applicationRequirement: 'Consent to Establish (CTE)',
        description: 'Application was submitted on Feb 28th and desk clarification raised without specifying CETP tie-up template. Seeking immediate guidance to prevent construction delay.',
        attachmentUrl: '/uploads/Clarification_Response_Draft.pdf',
        priority: 'High',
        status: 'Under Investigation',
        assignedTo: 'usr-admin-01',
        assignedOfficerName: 'Devendra Sharma (Commissioner)',
        escalatedToSuperAdmin: true,
        responses: [
          {
            by: 'Devendra Sharma',
            role: 'admin',
            message: 'Grievance reviewed and marked as high priority. Instructed SPCB Senior Engineer Sunita Menon to provide standardized CETP format within 24 hours.',
            date: '2026-03-04T09:30:00Z',
          }
        ],
        createdAt: '2026-03-03T16:00:00Z',
        updatedAt: '2026-03-04T09:30:00Z',
      }
    ];

    // Notifications
    const notifications: NotificationItem[] = [
      {
        id: 'notif-01',
        userId: 'usr-biz-01',
        role: 'business_user',
        title: 'Inspection Scheduled: Fire NOC',
        message: 'Officer Rajesh K. Pillai has scheduled on-site inspection for March 12, 2026 at 10:30 AM.',
        type: 'alert',
        link: '/inspections',
        read: false,
        createdAt: '2026-03-02T10:00:00Z',
      },
      {
        id: 'notif-02',
        userId: 'usr-biz-01',
        role: 'business_user',
        title: 'Clarification Required: Environmental CTE',
        message: 'SPCB requested CETP tie-up letter for chemical effluent management.',
        type: 'warning',
        link: '/applications',
        read: false,
        createdAt: '2026-03-03T11:25:00Z',
      },
      {
        id: 'notif-03',
        userId: 'usr-biz-01',
        role: 'business_user',
        title: 'Eligible Scheme Identified: SIPCOT Capital Subsidy',
        message: 'Your business profile matches 25% Capital Subsidy on Plant & Machinery (up to ₹75 Lakhs).',
        type: 'success',
        link: '/schemes',
        read: true,
        createdAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'notif-04',
        userId: 'usr-biz-01',
        role: 'business_user',
        title: 'Renewal Approaching: Trade License',
        message: 'Municipal Trade License expires in 25 days. Click to initiate renewal.',
        type: 'info',
        link: '/deadlines',
        read: false,
        createdAt: '2026-03-04T07:00:00Z',
      },
      {
        id: 'notif-05',
        userId: 'usr-staff-fire',
        role: 'department_staff',
        title: 'New High-Risk Application Assigned',
        message: 'NovaTech Manufacturing APP-2026-0842 flagged as High Risk. Fast-track inspection assigned.',
        type: 'alert',
        link: '/applications',
        read: false,
        createdAt: '2026-03-01T09:00:00Z',
      },
      {
        id: 'notif-06',
        userId: 'usr-officer-01',
        role: 'inspection_officer',
        title: 'Field Audit Assigned: Sriperumbudur',
        message: 'You have an on-site Fire Safety Audit scheduled for NovaTech on March 12, 2026.',
        type: 'info',
        link: '/inspections',
        read: false,
        createdAt: '2026-03-01T09:15:00Z',
      }
    ];

    // Deadlines
    const deadlines: DeadlineItem[] = [
      {
        id: 'dl-01',
        businessId: 'biz-novatech-01',
        title: 'Fire NOC Compliance Action & Pump Testing',
        requirementName: 'Fire Safety Clearance',
        dueDate: '2026-03-15',
        daysRemaining: 5,
        status: 'Critical',
        category: 'Inspection & Approval',
        actionUrl: '/inspections',
      },
      {
        id: 'dl-02',
        businessId: 'biz-novatech-01',
        title: 'SPCB Clarification Response Deadline',
        requirementName: 'Consent to Establish (CTE)',
        dueDate: '2026-03-18',
        daysRemaining: 8,
        status: 'Critical',
        category: 'Document Clarification',
        actionUrl: '/applications',
      },
      {
        id: 'dl-03',
        businessId: 'biz-novatech-01',
        title: 'Trade License Annual Renewal',
        requirementName: 'Municipal Trade License',
        dueDate: '2026-03-31',
        daysRemaining: 21,
        status: 'Upcoming',
        category: 'Licence Renewal',
        actionUrl: '/deadlines',
      },
      {
        id: 'dl-04',
        businessId: 'biz-novatech-01',
        title: 'Factories Act Pre-Operational Filing',
        requirementName: 'Factories Act Registration',
        dueDate: '2026-04-10',
        daysRemaining: 31,
        status: 'Normal',
        category: 'Registration',
        actionUrl: '/checklist',
      }
    ];

    // Risk Assessment for NovaTech
    const riskAssessments: RiskAssessment[] = [
      {
        businessId: 'biz-novatech-01',
        complianceScore: 68,
        riskLevel: 'MEDIUM',
        breakdown: {
          documents: 82,
          applications: 65,
          renewals: 75,
          missingRequirements: 50,
        },
        riskFactors: [
          {
            title: 'High-Temperature & Flammable Paint Spraying Operations',
            severity: 'High',
            description: 'Proposed spray painting booth requires explosion-proof ventilation and automated FM200 gas suppression.',
            actionRequired: 'Ensure live pressure test on March 12 passes all 6 checklist points.',
          },
          {
            title: 'Pending Hazardous Sludge CETP Authorization',
            severity: 'High',
            description: 'Orange Category unit cannot operate without written common treatment plant agreement.',
            actionRequired: 'Upload signed CETP membership certificate within 8 days.',
          },
          {
            title: 'Expiring Municipal Trade License Certificate',
            severity: 'Medium',
            description: 'Current premise trade certificate reaches expiration on March 31, 2026.',
            actionRequired: 'Submit online renewal fee receipt.',
          }
        ],
        calculatedAt: '2026-03-05T08:00:00Z',
      }
    ];

    // Audit logs
    const auditLogs: AuditLog[] = [
      {
        id: 'log-01',
        userId: 'usr-biz-01',
        userName: 'Vikramaditya Rao',
        role: 'business_user',
        action: 'Business Onboarding Completed',
        module: 'Business Profile',
        details: 'NovaTech Manufacturing registered with sector Manufacturing, Stage Construction, ₹2.5 Crore investment.',
        ipAddress: '103.21.14.82',
        status: 'Success',
        timestamp: '2026-01-20T11:35:00Z',
      },
      {
        id: 'log-02',
        userId: 'usr-biz-01',
        userName: 'Vikramaditya Rao',
        role: 'business_user',
        action: 'Analyzed Business Requirements',
        module: 'Requirement Rule Engine',
        details: 'Evaluated 9 statutory compliance requirements and generated interactive checklist.',
        ipAddress: '103.21.14.82',
        status: 'Success',
        timestamp: '2026-01-20T11:42:00Z',
      },
      {
        id: 'log-03',
        userId: 'usr-admin-01',
        userName: 'Devendra Sharma',
        role: 'admin',
        action: 'Verified Document: Incorporation Certificate',
        module: 'Document Verification',
        details: 'Verified NovaTech_Incorporation_MCA.pdf with confirmed CIN U29100TN2026PTC149822.',
        ipAddress: '164.100.24.12',
        status: 'Success',
        timestamp: '2026-01-23T11:00:00Z',
      },
      {
        id: 'log-04',
        userId: 'usr-biz-01',
        userName: 'Vikramaditya Rao',
        role: 'business_user',
        action: 'Submitted Application APP-2026-0842',
        module: 'Applications',
        details: 'Submitted Fire Safety Clearance application for Sriperumbudur manufacturing factory.',
        ipAddress: '103.21.14.82',
        status: 'Success',
        timestamp: '2026-02-25T09:00:00Z',
      },
      {
        id: 'log-05',
        userId: 'usr-staff-fire',
        userName: 'Rakesh Verma',
        role: 'department_staff',
        action: 'Application Scrutinized & Inspection Triggered',
        module: 'Department Approvals',
        details: 'Fire Safety review completed. Triggered Joint Cell physical inspection for high-risk component.',
        ipAddress: '164.100.28.45',
        status: 'Success',
        timestamp: '2026-02-27T10:00:00Z',
      },
      {
        id: 'log-06',
        userId: 'usr-officer-01',
        userName: 'Rajesh K. Pillai',
        role: 'inspection_officer',
        action: 'Completed Inspection INSP-2026-014',
        module: 'Inspection Cell',
        details: 'Structural verification passed for DTCP Building Sanction. Signed off foundation stability.',
        ipAddress: '117.200.41.9',
        status: 'Success',
        timestamp: '2026-02-16T15:00:00Z',
      },
      {
        id: 'log-07',
        userId: 'usr-staff-env',
        userName: 'Sunita Menon',
        role: 'department_staff',
        action: 'Issued Clarification Notice',
        module: 'Department Approvals',
        details: 'Notice issued for APP-2026-0843 regarding CETP sludge handling agreement.',
        ipAddress: '164.100.33.19',
        status: 'Warning',
        timestamp: '2026-03-03T11:20:00Z',
      }
    ];

    const systemSettings = {
      platformName: 'One Digital Compliance Journey',
      maintenanceMode: false,
      requireInspectionForHighRisk: true,
      slaWarningDays: 3,
      emailAlertsEnabled: true,
      autoAssignOfficers: true,
    };

    return {
      users,
      businesses,
      rules,
      checklists,
      documents,
      applications,
      inspections,
      schemes,
      grievances,
      notifications,
      riskAssessments,
      auditLogs,
      departments,
      deadlines,
      systemSettings,
    };
  }
}

export const dbStore = new DatabaseStore();
