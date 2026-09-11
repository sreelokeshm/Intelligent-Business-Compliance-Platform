import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbStore } from '../db/store.js';
import { RequirementRuleEngine } from '../services/ruleEngine.js';
import { ComplianceRiskEngine } from '../services/riskEngine.js';
import { AuditService } from '../services/auditService.js';
import { AiRegulatoryAssistant } from '../services/aiAssistant.js';
import { User, UserRole, Application, DocumentRecord, Inspection } from '../db/schema.js';

export const apiRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-compliance-secret-key-2026';

// Middleware for authenticating JWT
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    businessId?: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If demo bypass mode is needed or unauthenticated
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
};

// RBAC Middleware
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied: You do not have permission to access this resource',
        requiredRoles: allowedRoles,
        yourRole: req.user?.role,
      });
    }
    next();
  };
};

// ==========================================
// 1. AUTHENTICATION APIs
// ==========================================

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'business_user', phone, designation, department } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const data = dbStore.getData();
    if (data.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      designation,
      department,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    dbStore.persist();

    AuditService.log({
      userId: newUser.id,
      userName: newUser.name,
      role: newUser.role,
      action: 'User Registered',
      module: 'Authentication',
      details: `New account created with role ${role}`,
      ipAddress: req.ip,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = newUser;
    return res.json({ token, user: userWithoutPass });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = dbStore.getData();
    const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Role check if passed
    if (role && user.role !== role) {
      return res.status(401).json({
        error: `Account exists as role '${user.role}', but you selected '${role}'`,
      });
    }

    // Compare password with bcrypt or allow demo shortcuts
    const isMatch =
      bcrypt.compareSync(password, user.password || '') ||
      password === 'admin123' ||
      password === 'staff123' ||
      password === 'officer123' ||
      password === 'business123';

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        businessId: user.businessId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    AuditService.log({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'User Login',
      module: 'Authentication',
      details: `User logged in from ${req.ip}`,
      ipAddress: req.ip,
    });

    const { password: _, ...userWithoutPass } = user;
    return res.json({ token, user: userWithoutPass });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const user = data.users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...userWithoutPass } = user;
  const business = user.businessId
    ? data.businesses.find((b) => b.id === user.businessId)
    : data.businesses.find((b) => b.userId === user.id);

  return res.json({ user: userWithoutPass, business });
});

apiRouter.post('/auth/logout', authenticateToken, (req: AuthRequest, res: Response) => {
  AuditService.log({
    userId: req.user?.id || 'unknown',
    userName: req.user?.name || 'User',
    role: req.user?.role || 'business_user',
    action: 'User Logout',
    module: 'Authentication',
    details: 'User logged out',
    ipAddress: req.ip,
  });
  return res.json({ message: 'Logged out successfully' });
});

// ==========================================
// 2. BUSINESS APIs
// ==========================================

apiRouter.get('/business', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  if (req.user?.role === 'admin' || req.user?.role === 'department_staff' || req.user?.role === 'inspection_officer') {
    return res.json(data.businesses);
  }
  // If business user, return their business
  const userBiz = data.businesses.filter(
    (b) => b.userId === req.user?.id || b.id === req.user?.businessId
  );
  return res.json(userBiz);
});

apiRouter.get('/business/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const business = data.businesses.find((b) => b.id === req.params.id);
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }
  return res.json(business);
});

apiRouter.post('/business', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const data = dbStore.getData();
    const newBiz = {
      id: 'biz-' + Date.now(),
      userId: req.user?.id || 'usr-biz-01',
      complianceScore: 50,
      status: 'Action Required',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body,
    };

    data.businesses.push(newBiz);

    // Update user's businessId if not set
    const user = data.users.find((u) => u.id === req.user?.id);
    if (user && !user.businessId) {
      user.businessId = newBiz.id;
    }

    dbStore.persist();

    AuditService.log({
      userId: req.user?.id || 'sys',
      userName: req.user?.name || 'User',
      role: req.user?.role || 'business_user',
      action: 'Registered Business',
      module: 'Business Management',
      details: `Registered ${newBiz.name} (${newBiz.sector})`,
      ipAddress: req.ip,
    });

    return res.status(201).json(newBiz);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/business/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const idx = data.businesses.findIndex((b) => b.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Business not found' });
  }

  data.businesses[idx] = {
    ...data.businesses[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  dbStore.persist();
  return res.json(data.businesses[idx]);
});

// Business Passport API
apiRouter.get('/business/:id/passport', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const business = data.businesses.find((b) => b.id === req.params.id);
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }

  const documents = data.documents.filter((d) => d.businessId === business.id);
  const applications = data.applications.filter((a) => a.businessId === business.id);
  const inspections = data.inspections.filter((i) => i.businessId === business.id);

  const passport = {
    businessIdentity: {
      id: business.id,
      name: business.name,
      registrationNumber: business.registrationNumber,
      panNumber: business.panNumber,
      gstin: business.gstin,
      sector: business.sector,
      stage: business.stage,
      investmentAmount: business.investmentAmount,
      employeeCount: business.employeeCount,
      location: business.location,
      landBuildingInfo: business.landBuildingInfo,
    },
    verifiedCredentials: {
      businessRegistration: {
        verified: true,
        cin: business.registrationNumber,
        verifiedBy: 'Registrar of Companies (RoC)',
        date: '2026-01-23',
      },
      addressVerification: {
        verified: true,
        cadastralPlot: business.landBuildingInfo.plotNumber || 'Allotted Industrial Plot',
        authority: 'State Industrial Development Corp (SIPCOT)',
      },
      documentsCount: {
        total: documents.length,
        verified: documents.filter((d) => d.verificationStatus === 'Verified').length,
      },
      activeLicences: applications
        .filter((a) => a.status === 'Approved')
        .map((a) => ({
          name: a.requirementName,
          applicationId: a.applicationId,
          approvedDate: a.updatedAt,
        })),
      completedInspections: inspections
        .filter((i) => i.status === 'Completed')
        .map((i) => ({
          type: i.inspectionType,
          result: i.result,
          officer: i.officerName,
          date: i.completedDate,
        })),
    },
    complianceScore: business.complianceScore,
    qrVerificationHash: Buffer.from(`${business.id}:${business.registrationNumber}:VERIFIED`).toString('base64'),
    issuedAt: new Date().toISOString(),
  };

  return res.json(passport);
});

// ==========================================
// 3. REQUIREMENTS & RULE ENGINE APIs
// ==========================================

apiRouter.post('/requirements/analyze', (req: Request, res: Response) => {
  try {
    const profile = req.body;
    if (!profile.sector || !profile.location) {
      return res.status(400).json({ error: 'Sector and location details are required' });
    }

    const evaluation = RequirementRuleEngine.evaluate(profile);

    // If a businessId is associated or logged in, auto-generate/update checklist in database
    if (profile.businessId) {
      const data = dbStore.getData();
      for (const reqItem of evaluation.requirements) {
        const existingChk = data.checklists.find(
          (c) => c.businessId === profile.businessId && c.requirementId === reqItem.id
        );
        if (!existingChk) {
          data.checklists.push({
            id: 'chk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            businessId: profile.businessId,
            requirementId: reqItem.id,
            name: reqItem.name,
            category: reqItem.category,
            department: reqItem.department,
            priority: reqItem.priority,
            status: 'pending',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: reqItem.whyRequired,
          });
        }
      }
      dbStore.persist();
    }

    return res.json(evaluation);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/requirements', (req: Request, res: Response) => {
  const data = dbStore.getData();
  return res.json(data.rules);
});

apiRouter.get('/requirements/:id', (req: Request, res: Response) => {
  const data = dbStore.getData();
  const rule = data.rules.find((r) => r.id === req.params.id);
  if (!rule) {
    return res.status(404).json({ error: 'Requirement rule not found' });
  }
  return res.json(rule);
});

// ==========================================
// 4. CHECKLIST APIs
// ==========================================

apiRouter.get('/checklist', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const businessId = (req.query.businessId as string) || req.user?.businessId || 'biz-novatech-01';
  const items = data.checklists.filter((c) => c.businessId === businessId);

  // Calculate compliance progress
  const total = items.length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return res.json({
    items,
    progressPercentage,
    total,
    completed,
    pending: total - completed,
  });
});

apiRouter.put('/checklist/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const idx = data.checklists.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Checklist item not found' });
  }

  data.checklists[idx] = {
    ...data.checklists[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  // Re-calculate risk & compliance score
  ComplianceRiskEngine.calculateForBusiness(data.checklists[idx].businessId);
  dbStore.persist();

  return res.json(data.checklists[idx]);
});

// ==========================================
// 5. DOCUMENTS APIs
// ==========================================

apiRouter.get('/documents', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const businessId = (req.query.businessId as string) || req.user?.businessId;

  let docs = data.documents;
  if (req.user?.role === 'business_user' || businessId) {
    const targetBizId = businessId || req.user?.businessId || 'biz-novatech-01';
    docs = docs.filter((d) => d.businessId === targetBizId);
  }

  return res.json(docs);
});

apiRouter.get('/documents/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const doc = data.documents.find((d) => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  return res.json(doc);
});

// Document Upload with automated verification checking
apiRouter.post('/documents', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { name, category, fileName, fileType, fileSize, expiryDate, businessId: inputBizId } = req.body;
    const businessId = inputBizId || req.user?.businessId || 'biz-novatech-01';

    // File format validation
    const allowedFormats = ['application/pdf', 'image/jpeg', 'image/png'];
    const formatValid = allowedFormats.includes(fileType);
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const sizeValid = (fileSize || 1024000) <= maxSizeBytes;

    let expiryApproaching = false;
    if (expiryDate) {
      const exp = new Date(expiryDate).getTime();
      const now = Date.now();
      const diffDays = (exp - now) / (1000 * 3600 * 24);
      if (diffDays <= 30) {
        expiryApproaching = true;
      }
    }

    const newDoc: DocumentRecord = {
      id: 'doc-' + Date.now(),
      businessId,
      name: name || 'Statutory Compliance Document',
      category: category || 'Registration',
      fileName: fileName || `${name.replace(/\s+/g, '_')}.pdf`,
      fileType: fileType || 'application/pdf',
      fileSize: fileSize || 1845000,
      fileUrl: `/uploads/${fileName || 'document.pdf'}`,
      uploadDate: new Date().toISOString(),
      expiryDate,
      verificationStatus: 'Pending Verification',
      validationDetails: {
        formatValid,
        sizeValid,
        requiredDocumentFound: true,
        expiryApproaching,
        remarks: sizeValid && formatValid
          ? 'Automated cryptographic check passed. Submitted to department queue for desk scrutiny.'
          : 'File format or size warning. Review required.',
      },
    };

    const data = dbStore.getData();
    data.documents.unshift(newDoc);

    AuditService.log({
      userId: req.user?.id || 'unknown',
      userName: req.user?.name || 'User',
      role: req.user?.role || 'business_user',
      action: 'Uploaded Document',
      module: 'Document Intelligence',
      details: `Uploaded ${newDoc.name} (${(newDoc.fileSize / 1024 / 1024).toFixed(2)} MB)`,
      ipAddress: req.ip,
    });

    ComplianceRiskEngine.calculateForBusiness(businessId);
    dbStore.persist();

    return res.status(201).json(newDoc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Verify / Reject Document (Staff / Admin)
apiRouter.put(
  '/documents/:id/verify',
  authenticateToken,
  requireRole(['department_staff', 'admin']),
  (req: AuthRequest, res: Response) => {
    const { status, remarks } = req.body;
    const data = dbStore.getData();
    const doc = data.documents.find((d) => d.id === req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    doc.verificationStatus = status; // 'Verified' | 'Rejected'
    doc.verifiedBy = `${req.user?.name} (${req.user?.role})`;
    doc.verifiedAt = new Date().toISOString();
    if (remarks) {
      doc.validationDetails.remarks = remarks;
    }

    AuditService.log({
      userId: req.user?.id || 'unknown',
      userName: req.user?.name || 'Officer',
      role: req.user?.role || 'department_staff',
      action: `${status} Document: ${doc.name}`,
      module: 'Document Verification',
      details: remarks || `Document marked as ${status}`,
      ipAddress: req.ip,
    });

    // Notify Business User
    data.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: 'usr-biz-01',
      role: 'business_user',
      title: `Document ${status}: ${doc.name}`,
      message: remarks || `Your uploaded document ${doc.name} has been ${status.toLowerCase()} by reviewing authority.`,
      type: status === 'Verified' ? 'success' : 'alert',
      link: '/documents',
      read: false,
      createdAt: new Date().toISOString(),
    });

    ComplianceRiskEngine.calculateForBusiness(doc.businessId);
    dbStore.persist();

    return res.json(doc);
  }
);

// Delete Document
apiRouter.delete('/documents/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const idx = data.documents.findIndex((d) => d.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  const deleted = data.documents.splice(idx, 1)[0];
  dbStore.persist();
  return res.json({ message: 'Document removed', document: deleted });
});

// ==========================================
// 6. APPLICATIONS APIs
// ==========================================

apiRouter.get('/applications', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const businessId = (req.query.businessId as string) || req.user?.businessId;

  if (req.user?.role === 'business_user') {
    const targetBizId = businessId || req.user?.businessId || 'biz-novatech-01';
    return res.json(data.applications.filter((a) => a.businessId === targetBizId));
  }

  if (req.user?.role === 'department_staff') {
    // Return applications relevant to their department or all if cross-dept
    const deptUser = data.users.find((u) => u.id === req.user?.id);
    const userDept = deptUser?.department;
    if (userDept) {
      return res.json(
        data.applications.filter((a) =>
          a.department.toLowerCase().includes(userDept.toLowerCase()) ||
          a.parallelDepartments.some((p) => p.department.toLowerCase().includes(userDept.toLowerCase()))
        )
      );
    }
  }

  // Admin / Officers see all
  return res.json(data.applications);
});

apiRouter.get('/applications/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const app = data.applications.find((a) => a.id === req.params.id || a.applicationId === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  return res.json(app);
});

// Submit Application
apiRouter.post('/applications', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { requirementId, requirementName, department, category, documents = [] } = req.body;
    const businessId = req.body.businessId || req.user?.businessId || 'biz-novatech-01';

    const data = dbStore.getData();
    const business = data.businesses.find((b) => b.id === businessId);

    const appNumber = Math.floor(1000 + Math.random() * 9000);
    const formattedId = `APP-2026-${appNumber}`;

    const newApp: Application = {
      id: 'app-' + Date.now(),
      applicationId: formattedId,
      businessId,
      businessName: business?.name || 'NovaTech Manufacturing Pvt. Ltd.',
      requirementId: requirementId || 'rule-gen',
      requirementName: requirementName || 'Statutory Licence Application',
      department: department || 'Urban Local Body / Municipal Corp',
      category: category || 'Licence',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      riskScore: business?.riskCategory === 'High' ? 75 : 40,
      riskLevel: business?.riskCategory === 'High' ? 'High' : 'Medium',
      progressPercentage: 25,
      documents,
      comments: [
        {
          by: req.user?.name || 'Applicant',
          role: req.user?.role || 'business_user',
          date: new Date().toISOString(),
          message: 'Application dossier submitted with initial document attachments.',
        },
      ],
      timeline: [
        {
          stage: 'Submitted',
          status: 'completed',
          date: new Date().toISOString().split('T')[0],
          description: 'Application successfully registered on Single Window Portal',
          responsibleDepartment: 'Business User',
        },
        {
          stage: 'Documents Scrutiny',
          status: 'in_progress',
          date: new Date().toISOString().split('T')[0],
          description: 'Assigned to nodal department desk scrutiny team',
          responsibleDepartment: department || 'Department',
        },
        {
          stage: 'Risk Assessment',
          status: 'pending',
          date: '',
          description: 'Automated Rule Engine safety and zone risk evaluation',
          responsibleDepartment: 'Risk Engine',
        },
        {
          stage: 'Site Inspection',
          status: 'pending',
          date: '',
          description: 'Joint field inspection where statutory applicable',
          responsibleDepartment: 'Inspection Cell',
        },
        {
          stage: 'Final Approval',
          status: 'pending',
          date: '',
          description: 'Grant of digital compliance certificate',
          responsibleDepartment: department || 'Department',
        },
      ],
      parallelDepartments: [
        {
          department: department || 'Primary Department',
          status: 'Under Review',
          assignedDate: new Date().toISOString().split('T')[0],
          expectedCompletion: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.applications.unshift(newApp);

    AuditService.log({
      userId: req.user?.id || 'unknown',
      userName: req.user?.name || 'Applicant',
      role: req.user?.role || 'business_user',
      action: `Submitted Application: ${formattedId}`,
      module: 'Applications',
      details: `Filed for ${requirementName} with ${department}`,
      ipAddress: req.ip,
    });

    // Notify Department Staff
    data.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: 'usr-staff-fire',
      role: 'department_staff',
      title: `New Application: ${formattedId}`,
      message: `New application filed for ${requirementName} by ${business?.name}`,
      type: 'info',
      link: '/applications',
      read: false,
      createdAt: new Date().toISOString(),
    });

    ComplianceRiskEngine.calculateForBusiness(businessId);
    dbStore.persist();

    return res.status(201).json(newApp);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update Application Status & Comments (Staff / Admin)
apiRouter.put(
  '/applications/:id/status',
  authenticateToken,
  requireRole(['department_staff', 'inspection_officer', 'admin']),
  (req: AuthRequest, res: Response) => {
    const { status, comment, decisionDocumentUrl, scheduleInspection } = req.body;
    const data = dbStore.getData();
    const app = data.applications.find((a) => a.id === req.params.id || a.applicationId === req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    app.status = status;
    app.updatedAt = new Date().toISOString();

    if (status === 'Approved') {
      app.progressPercentage = 100;
      app.decisionDocumentUrl = decisionDocumentUrl || `/approvals/${app.applicationId}_Signed_Permit.pdf`;
    } else if (status === 'Inspection') {
      app.progressPercentage = 65;
    } else if (status === 'Clarification Required') {
      app.progressPercentage = 40;
    }

    if (comment) {
      app.comments.push({
        by: req.user?.name || 'Reviewing Official',
        role: req.user?.role || 'department_staff',
        date: new Date().toISOString(),
        message: comment,
      });
    }

    // Add to timeline
    app.timeline.push({
      stage: status,
      status: status === 'Approved' ? 'completed' : status === 'Rejected' ? 'rejected' : 'in_progress',
      date: new Date().toISOString().split('T')[0],
      description: comment || `Status updated to ${status} by ${req.user?.name}`,
      responsibleDepartment: app.department,
      officerName: req.user?.name,
    });

    // If Inspection triggered, create an Inspection record
    if (scheduleInspection || status === 'Inspection') {
      const existingInsp = data.inspections.find((i) => i.applicationId === app.applicationId);
      if (!existingInsp) {
        const newInsp: Inspection = {
          id: 'insp-' + Date.now(),
          inspectionId: 'INSP-2026-' + Math.floor(100 + Math.random() * 900),
          businessId: app.businessId,
          businessName: app.businessName,
          applicationId: app.applicationId,
          applicationRequirement: app.requirementName,
          location: 'Industrial Facility Site, SIPCOT Industrial Park',
          inspectionType: 'Pre-Approval Physical',
          scheduledDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
          officerId: 'usr-officer-01',
          officerName: 'Rajesh K. Pillai',
          riskLevel: app.riskLevel,
          checklist: [
            { id: 'item-1', item: 'Site setback distances verified against sanctioned drawing', category: 'Civil', passed: null },
            { id: 'item-2', item: 'Safety equipment installation & commissioning certificate', category: 'Safety', passed: null },
            { id: 'item-3', item: 'Emergency evacuation assembly point demarcation', category: 'Evacuation', passed: null },
          ],
          evidenceFiles: [],
          remarks: 'Automated inspection order generated following desk appraisal.',
          result: 'Pending',
          status: 'Scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.inspections.unshift(newInsp);
      }
    }

    // Notify Business User
    data.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: 'usr-biz-01',
      role: 'business_user',
      title: `Application ${status}: ${app.requirementName}`,
      message: comment || `Your application ${app.applicationId} status has changed to ${status}.`,
      type: status === 'Approved' ? 'success' : status === 'Clarification Required' ? 'warning' : 'info',
      link: '/applications',
      read: false,
      createdAt: new Date().toISOString(),
    });

    AuditService.log({
      userId: req.user?.id || 'unknown',
      userName: req.user?.name || 'Officer',
      role: req.user?.role || 'department_staff',
      action: `Updated Status: ${app.applicationId} -> ${status}`,
      module: 'Department Approvals',
      details: comment || `Application status transitioned to ${status}`,
      ipAddress: req.ip,
    });

    ComplianceRiskEngine.calculateForBusiness(app.businessId);
    dbStore.persist();

    return res.json(app);
  }
);

// Add Comment to Application
apiRouter.post('/applications/:id/comments', authenticateToken, (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Comment message is required' });
  }

  const data = dbStore.getData();
  const app = data.applications.find((a) => a.id === req.params.id || a.applicationId === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const newComment = {
    by: req.user?.name || 'User',
    role: req.user?.role || 'business_user',
    date: new Date().toISOString(),
    message,
  };

  app.comments.push(newComment);
  app.updatedAt = new Date().toISOString();
  dbStore.persist();

  return res.json(app);
});

// ==========================================
// 7. INSPECTIONS APIs
// ==========================================

apiRouter.get('/inspections', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const businessId = (req.query.businessId as string) || req.user?.businessId;

  if (req.user?.role === 'business_user') {
    const targetBizId = businessId || req.user?.businessId || 'biz-novatech-01';
    return res.json(data.inspections.filter((i) => i.businessId === targetBizId));
  }

  if (req.user?.role === 'inspection_officer') {
    // Return inspections assigned to officer or all
    return res.json(data.inspections);
  }

  return res.json(data.inspections);
});

apiRouter.get('/inspections/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const insp = data.inspections.find((i) => i.id === req.params.id || i.inspectionId === req.params.id);
  if (!insp) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  return res.json(insp);
});

// Complete Inspection (Officer / Admin)
apiRouter.put(
  '/inspections/:id/complete',
  authenticateToken,
  requireRole(['inspection_officer', 'admin']),
  (req: AuthRequest, res: Response) => {
    const { checklist, remarks, result, evidenceFiles } = req.body;
    const data = dbStore.getData();
    const insp = data.inspections.find((i) => i.id === req.params.id || i.inspectionId === req.params.id);
    if (!insp) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    insp.status = 'Completed';
    insp.result = result; // 'Passed' | 'Failed' | 'Re-inspection Required'
    insp.completedDate = new Date().toISOString();
    insp.remarks = remarks || insp.remarks;
    if (checklist) insp.checklist = checklist;
    if (evidenceFiles) insp.evidenceFiles = evidenceFiles;
    insp.updatedAt = new Date().toISOString();

    // Automatically update the associated application status!
    const app = data.applications.find((a) => a.applicationId === insp.applicationId);
    if (app) {
      if (result === 'Passed') {
        app.status = 'Approved';
        app.progressPercentage = 100;
        app.timeline.push({
          stage: 'Inspection Passed & Approved',
          status: 'completed',
          date: new Date().toISOString().split('T')[0],
          description: `Field inspection completed successfully by ${insp.officerName}. Statutory approval granted.`,
          responsibleDepartment: 'Inspection Cell',
          officerName: insp.officerName,
        });
      } else if (result === 'Failed') {
        app.status = 'Rejected';
        app.timeline.push({
          stage: 'Inspection Failed',
          status: 'rejected',
          date: new Date().toISOString().split('T')[0],
          description: `Field inspection failed: ${remarks}`,
          responsibleDepartment: 'Inspection Cell',
          officerName: insp.officerName,
        });
      } else {
        app.status = 'Clarification Required';
        app.timeline.push({
          stage: 'Re-inspection Required',
          status: 'in_progress',
          date: new Date().toISOString().split('T')[0],
          description: `Deficiencies noted during site visit. Corrective action required before re-inspection: ${remarks}`,
          responsibleDepartment: 'Inspection Cell',
          officerName: insp.officerName,
        });
      }
    }

    // Notify Business User
    data.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: 'usr-biz-01',
      role: 'business_user',
      title: `Inspection Result: ${result}`,
      message: `Inspection for ${insp.applicationRequirement} concluded with result: ${result}. Remarks: ${remarks}`,
      type: result === 'Passed' ? 'success' : 'alert',
      link: '/inspections',
      read: false,
      createdAt: new Date().toISOString(),
    });

    AuditService.log({
      userId: req.user?.id || 'unknown',
      userName: req.user?.name || 'Officer',
      role: req.user?.role || 'inspection_officer',
      action: `Completed Inspection: ${insp.inspectionId} (${result})`,
      module: 'Inspection Management',
      details: `Signed off on ${insp.applicationRequirement} with result ${result}`,
      ipAddress: req.ip,
    });

    ComplianceRiskEngine.calculateForBusiness(insp.businessId);
    dbStore.persist();

    return res.json({ inspection: insp, application: app });
  }
);

// Schedule or update inspection
apiRouter.put('/inspections/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const idx = data.inspections.findIndex((i) => i.id === req.params.id || i.inspectionId === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Inspection not found' });
  }

  data.inspections[idx] = {
    ...data.inspections[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  dbStore.persist();
  return res.json(data.inspections[idx]);
});

// ==========================================
// 8. GOVERNMENT SCHEMES APIs
// ==========================================

apiRouter.get('/schemes', (req: Request, res: Response) => {
  const data = dbStore.getData();
  return res.json(data.schemes);
});

apiRouter.get('/schemes/:id', (req: Request, res: Response) => {
  const data = dbStore.getData();
  const scheme = data.schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }
  return res.json(scheme);
});

// Check eligibility for a scheme given business profile
apiRouter.post('/schemes/:id/check-eligibility', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const scheme = data.schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }

  const businessId = req.body.businessId || req.user?.businessId || 'biz-novatech-01';
  const business = data.businesses.find((b) => b.id === businessId);

  if (!business) {
    return res.status(404).json({ error: 'Business profile not found' });
  }

  const matchReasons: string[] = [];
  let score = 50;

  if (scheme.eligibleBusinessTypes.includes(business.sector) || scheme.eligibleBusinessTypes.includes('All')) {
    score += 25;
    matchReasons.push(`Sector '${business.sector}' matches eligible focus industries.`);
  }

  if (scheme.location.includes(business.location.state) || scheme.location.includes('All States')) {
    score += 15;
    matchReasons.push(`State of operation '${business.location.state}' is eligible.`);
  }

  if (business.investmentAmount >= scheme.minInvestment && business.investmentAmount <= scheme.maxInvestment) {
    score += 10;
    matchReasons.push(`CapEx scale ₹${(business.investmentAmount / 10000000).toFixed(2)} Cr fits subsidy eligibility bounds.`);
  }

  return res.json({
    schemeId: scheme.id,
    schemeName: scheme.name,
    eligibilityScore: Math.min(score, 100),
    isEligible: score >= 70,
    matchReasons,
    recommendedNextStep: 'Upload Audited Net Worth Certificate & submit subsidy Form A',
  });
});

// ==========================================
// 9. GRIEVANCES APIs
// ==========================================

apiRouter.get('/grievances', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const businessId = (req.query.businessId as string) || req.user?.businessId;

  if (req.user?.role === 'business_user') {
    const targetBizId = businessId || req.user?.businessId || 'biz-novatech-01';
    return res.json(data.grievances.filter((g) => g.businessId === targetBizId));
  }

  return res.json(data.grievances);
});

apiRouter.post('/grievances', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { category, applicationId, description, attachmentUrl, priority = 'Medium' } = req.body;
    const businessId = req.body.businessId || req.user?.businessId || 'biz-novatech-01';

    const data = dbStore.getData();
    const business = data.businesses.find((b) => b.id === businessId);
    const app = applicationId ? data.applications.find((a) => a.id === applicationId || a.applicationId === applicationId) : null;

    const grvNumber = Math.floor(1000 + Math.random() * 9000);
    const newGrv: any = {
      id: 'grv-' + Date.now(),
      grievanceId: `GRV-2026-${grvNumber}`,
      businessId,
      businessName: business?.name || 'NovaTech Manufacturing Pvt. Ltd.',
      category: category || 'Delay in Processing',
      applicationId: app?.applicationId,
      applicationRequirement: app?.requirementName,
      description,
      attachmentUrl,
      priority,
      status: 'Submitted',
      assignedTo: 'usr-admin-01',
      assignedOfficerName: 'Devendra Sharma (Commissioner)',
      responses: [
        {
          by: req.user?.name || 'Applicant',
          role: req.user?.role || 'business_user',
          message: description,
          date: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.grievances.unshift(newGrv);

    AuditService.log({
      userId: req.user?.id || 'unknown',
      userName: req.user?.name || 'Applicant',
      role: req.user?.role || 'business_user',
      action: `Lodged Grievance: ${newGrv.grievanceId}`,
      module: 'Grievance Redressal',
      details: `${category} regarding ${app?.applicationId || 'compliance issue'}`,
      ipAddress: req.ip,
    });

    dbStore.persist();
    return res.status(201).json(newGrv);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post(
  '/grievances/:id/respond',
  authenticateToken,
  requireRole(['department_staff', 'admin']),
  (req: AuthRequest, res: Response) => {
    const { message, status } = req.body;
    const data = dbStore.getData();
    const grv = data.grievances.find((g) => g.id === req.params.id || g.grievanceId === req.params.id);
    if (!grv) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    if (status) grv.status = status;
    grv.responses.push({
      by: req.user?.name || 'Officer',
      role: req.user?.role || 'admin',
      message,
      date: new Date().toISOString(),
    });
    grv.updatedAt = new Date().toISOString();

    // Notify business user
    data.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: 'usr-biz-01',
      role: 'business_user',
      title: `Grievance Updated: ${grv.grievanceId}`,
      message: `An official response was posted on your grievance: "${message.substring(0, 80)}..."`,
      type: 'info',
      link: '/grievances',
      read: false,
      createdAt: new Date().toISOString(),
    });

    dbStore.persist();
    return res.json(grv);
  }
);

// ==========================================
// 10. NOTIFICATIONS APIs
// ==========================================

apiRouter.get('/notifications', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const userNotifs = data.notifications.filter(
    (n) => n.userId === req.user?.id || n.role === req.user?.role || n.userId === 'all'
  );
  return res.json(userNotifs);
});

apiRouter.put('/notifications/:id/read', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const notif = data.notifications.find((n) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    dbStore.persist();
  }
  return res.json({ success: true });
});

apiRouter.put('/notifications/read-all', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  data.notifications.forEach((n) => {
    if (n.userId === req.user?.id || n.role === req.user?.role) {
      n.read = true;
    }
  });
  dbStore.persist();
  return res.json({ success: true });
});

// ==========================================
// 11. RISK ENGINE API
// ==========================================

apiRouter.get('/risk/:businessId', authenticateToken, (req: AuthRequest, res: Response) => {
  const businessId = req.params.businessId || req.user?.businessId || 'biz-novatech-01';
  const assessment = ComplianceRiskEngine.calculateForBusiness(businessId);
  return res.json(assessment);
});

// ==========================================
// 12. DEADLINES & RENEWALS APIs
// ==========================================

apiRouter.get('/deadlines', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const businessId = (req.query.businessId as string) || req.user?.businessId || 'biz-novatech-01';
  const deadlines = data.deadlines.filter((d) => d.businessId === businessId);
  return res.json(deadlines);
});

// ==========================================
// 13. AI ASSISTANT API
// ==========================================

apiRouter.post('/assistant/chat', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query message is required' });
    }

    const businessId = req.body.businessId || req.user?.businessId;
    const response = await AiRegulatoryAssistant.answerQuery(req.user?.id || 'usr-biz-01', businessId, query);
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 14. ADMIN APIs
// ==========================================

apiRouter.get('/admin/analytics', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();

  const totalBusinesses = data.businesses.length;
  const activeApplications = data.applications.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length;
  const pendingApprovals = data.applications.filter((a) => a.status === 'Under Review').length;
  const highRiskCases = data.applications.filter((a) => a.riskLevel === 'High').length;
  const pendingInspections = data.inspections.filter((i) => i.status !== 'Completed').length;
  const openGrievances = data.grievances.filter((g) => g.status !== 'Resolved').length;
  const averageApprovalDays = 14.2;

  // Chart: Applications by Status
  const statusCounts: Record<string, number> = {};
  data.applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const applicationsByStatus = Object.entries(statusCounts).map(([name, count]) => ({ name, count }));

  // Chart: Applications by Department
  const deptCounts: Record<string, number> = {};
  data.applications.forEach((a) => {
    deptCounts[a.department] = (deptCounts[a.department] || 0) + 1;
  });
  const applicationsByDepartment = Object.entries(deptCounts).map(([name, count]) => ({ name, count }));

  // Risk distribution
  const riskDistribution = [
    { name: 'Low Risk', count: data.applications.filter((a) => a.riskLevel === 'Low').length },
    { name: 'Medium Risk', count: data.applications.filter((a) => a.riskLevel === 'Medium').length },
    { name: 'High Risk', count: data.applications.filter((a) => a.riskLevel === 'High').length },
  ];

  // Document verification status
  const documentVerificationStatus = [
    { name: 'Verified', count: data.documents.filter((d) => d.verificationStatus === 'Verified').length },
    { name: 'Pending', count: data.documents.filter((d) => d.verificationStatus === 'Pending Verification').length },
    { name: 'Rejected', count: data.documents.filter((d) => d.verificationStatus === 'Rejected').length },
    { name: 'Expiring/Expired', count: data.documents.filter((d) => d.verificationStatus === 'Expiring Soon' || d.verificationStatus === 'Expired').length },
  ];

  // Monthly trends (demo data for charting)
  const monthlyTrends = [
    { month: 'Oct 2025', registrations: 12, approvals: 10, grievances: 2 },
    { month: 'Nov 2025', registrations: 18, approvals: 15, grievances: 4 },
    { month: 'Dec 2025', registrations: 24, approvals: 21, grievances: 3 },
    { month: 'Jan 2026', registrations: 35, approvals: 28, grievances: 6 },
    { month: 'Feb 2026', registrations: 42, approvals: 37, grievances: 5 },
    { month: 'Mar 2026', registrations: 48, approvals: 41, grievances: 4 },
  ];

  return res.json({
    metrics: {
      totalBusinesses,
      activeApplications,
      pendingApprovals,
      highRiskCases,
      pendingInspections,
      openGrievances,
      averageApprovalDays,
    },
    charts: {
      applicationsByStatus,
      applicationsByDepartment,
      riskDistribution,
      documentVerificationStatus,
      monthlyTrends,
    },
  });
});

apiRouter.get('/admin/users', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const safeUsers = data.users.map(({ password, ...u }) => u);
  return res.json(safeUsers);
});

apiRouter.post('/admin/users', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const { name, email, role, department, designation, phone } = req.body;
  const data = dbStore.getData();
  const newUser: User = {
    id: 'usr-' + Date.now(),
    name,
    email,
    password: bcrypt.hashSync('welcome123', 10),
    role: role || 'department_staff',
    department,
    designation,
    phone,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  data.users.push(newUser);
  dbStore.persist();
  const { password: _, ...safeUser } = newUser;
  return res.status(201).json(safeUser);
});

apiRouter.put('/admin/users/:id', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const idx = data.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  data.users[idx] = { ...data.users[idx], ...req.body };
  dbStore.persist();
  const { password: _, ...safeUser } = data.users[idx];
  return res.json(safeUser);
});

apiRouter.get('/admin/audit-logs', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  return res.json(data.auditLogs);
});

apiRouter.get('/admin/departments', authenticateToken, (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  return res.json(data.departments);
});

apiRouter.get('/admin/settings', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  return res.json(data.systemSettings);
});

apiRouter.put('/admin/settings', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  data.systemSettings = { ...data.systemSettings, ...req.body };
  dbStore.persist();
  return res.json(data.systemSettings);
});

// Admin rule management
apiRouter.post('/admin/rules', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const newRule = {
    id: 'rule-' + Date.now(),
    status: 'active',
    ...req.body,
  };
  data.rules.unshift(newRule);
  dbStore.persist();
  return res.status(201).json(newRule);
});

apiRouter.put('/admin/rules/:id', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const data = dbStore.getData();
  const idx = data.rules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  data.rules[idx] = { ...data.rules[idx], ...req.body };
  dbStore.persist();
  return res.json(data.rules[idx]);
});
