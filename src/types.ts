export type UserRole = 'business_user' | 'department_staff' | 'inspection_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  designation?: string;
  phone?: string;
  status: 'active' | 'inactive';
  businessId?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  panNumber: string;
  gstin: string;
  sector: string;
  stage: string;
  investmentAmount: number;
  employeeCount: number;
  location: {
    state: string;
    district: string;
    city: string;
    zone: string;
    address: string;
  };
  projectSize: string;
  landBuildingInfo: {
    type: string;
    areaSqFt: number;
    plotNumber?: string;
  };
  expectedOperationalDate: string;
  environmentalCategory: 'White' | 'Green' | 'Orange' | 'Red';
  manufacturingCategory?: string;
  buildingType: string;
  riskCategory: 'Low' | 'Medium' | 'High';
  complianceScore: number;
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
  applicableSectors: string[];
  applicableLocations: string[];
  applicableStages: string[];
  minInvestment: number;
  maxInvestment?: number;
  minEmployees?: number;
  requiredDocuments: string[];
  inspectionRequired: boolean;
  renewalPeriod: string;
  processingTime: string;
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
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected' | 'Expired' | 'Expiring Soon' | 'Missing';
  verifiedBy?: string;
  verifiedAt?: string;
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
  applicationId: string;
  businessId: string;
  businessName: string;
  requirementId: string;
  requirementName: string;
  department: string;
  category: string;
  submittedDate: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Inspection' | 'Clarification Required' | 'Approved' | 'Rejected';
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  assignedOfficer?: string;
  assignedOfficerId?: string;
  progressPercentage: number;
  documents: { documentId: string; name: string; verified: boolean }[];
  comments: { by: string; role: string; date: string; message: string }[];
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
  passed: boolean | null;
  notes?: string;
}

export interface Inspection {
  id: string;
  inspectionId: string;
  businessId: string;
  businessName: string;
  applicationId: string;
  applicationRequirement: string;
  location: string;
  inspectionType: string;
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
  matchScore?: number;
  matchReasons?: string[];
}

export interface Grievance {
  id: string;
  grievanceId: string;
  businessId: string;
  businessName: string;
  category: string;
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
  requirementId?: string;
  department?: string;
  penaltyInfo?: string;
  dueDate: string;
  daysRemaining: number;
  status: 'Critical' | 'Upcoming' | 'Normal' | 'Completed';
  category: string;
  actionUrl: string;
}

export type InspectionRecord = any;
export type Scheme = GovernmentScheme | any;

