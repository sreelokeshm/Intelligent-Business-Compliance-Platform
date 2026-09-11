export type UserRole = 'business_user' | 'department_staff' | 'inspection_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string; // For staff e.g. "Fire", "Environment", "Labour"
  designation?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  businessId?: string; // For business_user
  createdAt: string;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  panNumber: string;
  gstin: string;
  sector: string; // 'Manufacturing' | 'Retail' | 'Restaurant' | 'IT / Software' | 'Construction' | 'Logistics' | 'Education' | 'Other'
  stage: string; // 'Idea / Planning' | 'Establishment' | 'Construction' | 'Pre-operation' | 'Operational' | 'Expansion'
  investmentAmount: number; // in INR
  employeeCount: number;
  location: {
    state: string;
    district: string;
    city: string;
    zone: string; // 'Industrial Area / Zone' | 'Commercial' | 'SEZ' | 'Rural'
    address: string;
  };
  projectSize: string; // 'Micro' | 'Small' | 'Medium' | 'Large' | sq ft
  landBuildingInfo: {
    type: 'Owned' | 'Leased' | 'Industrial Park' | 'Agricultural Conversion';
    areaSqFt: number;
    plotNumber?: string;
  };
  expectedOperationalDate: string;
  environmentalCategory: 'White' | 'Green' | 'Orange' | 'Red';
  manufacturingCategory?: string;
  buildingType: 'Commercial Complex' | 'Industrial Factory' | 'Warehouse' | 'Office Space';
  riskCategory: 'Low' | 'Medium' | 'High';
  complianceScore: number; // 0 - 100
  status: 'Pending' | 'Compliant' | 'Action Required' | 'Non-Compliant';
  createdAt: string;
  updatedAt: string;
}

export interface RequirementRule {
  id: string;
  name: string;
  category: 'Registration' | 'Licence' | 'Permission' | 'NOC' | 'Inspection' | 'Renewal';
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low' | 'Medium' | 'High';
  applicableSectors: string[]; // empty or ['*'] for all
  applicableLocations: string[]; // states or zones
  applicableStages: string[];
  minInvestment: number;
  maxInvestment?: number;
  minEmployees?: number;
  environmentalCategories?: string[];
  requiredDocuments: string[];
  inspectionRequired: boolean;
  renewalPeriod: string; // 'Annual' | '3 Years' | '5 Years' | 'One-Time'
  processingTime: string; // '7-14 Days'
  feeInfo: string;
  issuingAuthority: string;
  description: string;
  whyRequired: string;
  applicationSteps: string[];
  status: 'active' | 'disabled';
}

export interface ChecklistItem {
  id: string;
  businessId: string;
  requirementId: string;
  name: string;
  category: string;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'completed' | 'pending' | 'expiring';
  documentId?: string;
  applicationId?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

export interface DocumentRecord {
  id: string;
  businessId: string;
  name: string;
  category: 'Registration' | 'Identity' | 'Financial' | 'Environmental' | 'Safety' | 'NOC' | 'Land/Property';
  fileName: string;
  fileType: 'application/pdf' | 'image/jpeg' | 'image/png';
  fileSize: number; // bytes
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected' | 'Expired' | 'Expiring Soon' | 'Missing';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  validationDetails: {
    formatValid: boolean;
    sizeValid: boolean;
    requiredDocumentFound: boolean;
    expiryApproaching: boolean;
    remarks: string;
  };
}

export interface ApplicationTimelineItem {
  stage: string;
  status: 'completed' | 'in_progress' | 'pending' | 'rejected';
  date: string;
  description: string;
  responsibleDepartment: string;
  officerName?: string;
}

export interface Application {
  id: string;
  applicationId: string; // Formatted ID e.g. "APP-2026-0842"
  businessId: string;
  businessName: string;
  requirementId: string;
  requirementName: string;
  department: string;
  category: string;
  submittedDate: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Inspection' | 'Clarification Required' | 'Approved' | 'Rejected';
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  assignedOfficer?: string;
  assignedOfficerId?: string;
  progressPercentage: number;
  documents: { documentId: string; name: string; verified: boolean }[];
  comments: { by: string; role: string; date: string; message: string; isInternal?: boolean }[];
  timeline: ApplicationTimelineItem[];
  parallelDepartments: {
    department: string;
    status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
    assignedDate: string;
    expectedCompletion: string;
    comments?: string;
  }[];
  decisionDocumentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionChecklistItem {
  id: string;
  item: string;
  category: string;
  passed: boolean | null; // null = pending
  notes?: string;
}

export interface Inspection {
  id: string;
  inspectionId: string; // e.g. "INSP-2026-019"
  businessId: string;
  businessName: string;
  applicationId: string;
  applicationRequirement: string;
  location: string;
  inspectionType: 'Pre-Approval Physical' | 'Environmental Compliance' | 'Fire Safety Audit' | 'Structural Verification' | 'Labour Safety';
  scheduledDate: string;
  completedDate?: string;
  officerId: string;
  officerName: string;
  officerPhone?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  checklist: InspectionChecklistItem[];
  evidenceFiles: { name: string; url: string; uploadTime: string }[];
  remarks: string;
  result: 'Pending' | 'Passed' | 'Failed' | 'Re-inspection Required';
  status: 'Scheduled' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  code: string;
  description: string;
  eligibleBusinessTypes: string[];
  location: string[];
  investmentRange: string;
  minInvestment: number;
  maxInvestment: number;
  benefits: string[];
  requiredDocuments: string[];
  applicationProcess: string;
  deadline: string;
  subsidyPercentage?: number;
  maxSubsidyAmount?: string;
  status: 'Active' | 'Closing Soon' | 'Archived';
  isFictionalDemo: boolean;
}

export interface Grievance {
  id: string;
  grievanceId: string; // e.g. "GRV-2026-0042"
  businessId: string;
  businessName: string;
  category: 'Delay in Processing' | 'Harassment / Corruption' | 'Technical Glitch' | 'Unreasonable Rejection' | 'Inspection Dispute' | 'Clarification Pending';
  applicationId?: string;
  applicationRequirement?: string;
  description: string;
  attachmentUrl?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Submitted' | 'Assigned' | 'Under Investigation' | 'Action Taken' | 'Resolved';
  assignedTo?: string;
  assignedOfficerName?: string;
  escalatedToSuperAdmin?: boolean;
  responses: {
    by: string;
    role: string;
    message: string;
    date: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface RiskAssessment {
  businessId: string;
  complianceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  breakdown: {
    documents: number;
    applications: number;
    renewals: number;
    missingRequirements: number;
  };
  riskFactors: {
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    actionRequired: string;
  }[];
  calculatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'Warning';
  timestamp: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  activeOfficers: number;
  pendingApplications: number;
  avgProcessingDays: number;
  approvalRate: number;
}

export interface DeadlineItem {
  id: string;
  businessId: string;
  title: string;
  requirementName: string;
  dueDate: string;
  daysRemaining: number;
  status: 'Critical' | 'Upcoming' | 'Normal' | 'Completed';
  category: string;
  actionUrl: string;
}
