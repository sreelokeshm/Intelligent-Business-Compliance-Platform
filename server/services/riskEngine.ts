import { RiskAssessment } from '../db/schema.js';
import { dbStore } from '../db/store.js';

export class ComplianceRiskEngine {
  public static calculateForBusiness(businessId: string): RiskAssessment {
    const data = dbStore.getData();
    const business = data.businesses.find((b) => b.id === businessId);
    const documents = data.documents.filter((d) => d.businessId === businessId);
    const applications = data.applications.filter((a) => a.businessId === businessId);
    const checklists = data.checklists.filter((c) => c.businessId === businessId);
    const deadlines = data.deadlines.filter((d) => d.businessId === businessId);

    const riskFactors: {
      title: string;
      severity: 'High' | 'Medium' | 'Low';
      description: string;
      actionRequired: string;
    }[] = [];

    // 1. Documents Score (out of 100)
    let docScore = 100;
    if (documents.length === 0) {
      docScore = 20;
      riskFactors.push({
        title: 'Zero Statutory Documents Uploaded',
        severity: 'High',
        description: 'No verified legal or site blueprints uploaded to digital repository.',
        actionRequired: 'Upload Incorporation, land deeds, and site blueprints.',
      });
    } else {
      const verifiedDocs = documents.filter((d) => d.verificationStatus === 'Verified').length;
      const pendingDocs = documents.filter((d) => d.verificationStatus === 'Pending Verification').length;
      const rejectedDocs = documents.filter((d) => d.verificationStatus === 'Rejected').length;
      const expiringDocs = documents.filter(
        (d) => d.verificationStatus === 'Expiring Soon' || d.verificationStatus === 'Expired'
      ).length;

      docScore = Math.round(((verifiedDocs * 1 + pendingDocs * 0.5) / documents.length) * 100);

      if (rejectedDocs > 0) {
        docScore = Math.max(docScore - rejectedDocs * 15, 10);
        riskFactors.push({
          title: `${rejectedDocs} Document(s) Rejected by Scrutiny Authority`,
          severity: 'High',
          description: 'Document rejected due to non-conforming formats or incomplete signatures.',
          actionRequired: 'Replace rejected files with authorized gazetted copies.',
        });
      }

      if (expiringDocs > 0) {
        riskFactors.push({
          title: `${expiringDocs} Certificate(s) Expiring or Expired`,
          severity: 'Medium',
          description: 'Statutory licence certificate is nearing term expiration.',
          actionRequired: 'File renewal application prior to penalty lapse.',
        });
      }
    }

    // 2. Applications Score (out of 100)
    let appScore = 70;
    if (applications.length > 0) {
      const approved = applications.filter((a) => a.status === 'Approved').length;
      const underReview = applications.filter(
        (a) => a.status === 'Under Review' || a.status === 'Inspection'
      ).length;
      const clarification = applications.filter((a) => a.status === 'Clarification Required').length;
      const rejected = applications.filter((a) => a.status === 'Rejected').length;

      appScore = Math.round(
        ((approved * 1 + underReview * 0.7 + clarification * 0.3) / applications.length) * 100
      );

      if (clarification > 0) {
        riskFactors.push({
          title: 'Department Clarification Pending Response',
          severity: 'High',
          description: `${clarification} application(s) have unanswered queries from reviewing officers.`,
          actionRequired: 'Submit requested technical clarifications to avoid application dismissal.',
        });
      }

      if (rejected > 0) {
        riskFactors.push({
          title: 'Application Rejected by Competent Authority',
          severity: 'High',
          description: 'An application was rejected during statutory committee review.',
          actionRequired: 'Review rejection reasons and re-file with corrected parameters.',
        });
      }
    }

    // 3. Renewals Score (out of 100)
    let renewalScore = 85;
    const criticalDeadlines = deadlines.filter(
      (d) => d.status === 'Critical' && d.daysRemaining < 10
    );
    if (criticalDeadlines.length > 0) {
      renewalScore = Math.max(85 - criticalDeadlines.length * 20, 20);
      riskFactors.push({
        title: `${criticalDeadlines.length} Critical Deadline(s) Approaching (<10 Days)`,
        severity: 'High',
        description: 'Imminent statutory deadline can trigger inspection stop-work notices or monetary fines.',
        actionRequired: 'Expedite pending submissions immediately.',
      });
    }

    // 4. Missing Requirements Score
    let missingScore = 80;
    if (checklists.length > 0) {
      const completed = checklists.filter((c) => c.status === 'completed').length;
      missingScore = Math.round((completed / checklists.length) * 100);
      const pendingHigh = checklists.filter((c) => c.priority === 'High' && c.status === 'pending');
      if (pendingHigh.length > 2) {
        riskFactors.push({
          title: `${pendingHigh.length} Mandatory High-Priority Approvals Unfulfilled`,
          severity: 'Medium',
          description: 'Premises currently operating or constructing without primary NOC clearances.',
          actionRequired: 'Initiate applications for unfulfilled high-priority checklist items.',
        });
      }
    }

    // Overall Compliance Score (Weighted)
    // Documents: 25%, Applications: 35%, Renewals: 20%, Checklist: 20%
    const totalScore = Math.round(
      docScore * 0.25 + appScore * 0.35 + renewalScore * 0.2 + missingScore * 0.2
    );

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (totalScore < 50 || riskFactors.some((r) => r.severity === 'High' && riskFactors.length >= 2)) {
      riskLevel = 'HIGH';
    } else if (totalScore < 75 || riskFactors.some((r) => r.severity === 'High')) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }

    // Update business model compliance score
    if (business) {
      business.complianceScore = totalScore;
      business.riskCategory = riskLevel === 'HIGH' ? 'High' : riskLevel === 'MEDIUM' ? 'Medium' : 'Low';
      business.status = totalScore >= 80 ? 'Compliant' : 'Action Required';
    }

    const assessment: RiskAssessment = {
      businessId,
      complianceScore: totalScore,
      riskLevel,
      breakdown: {
        documents: docScore,
        applications: appScore,
        renewals: renewalScore,
        missingRequirements: missingScore,
      },
      riskFactors,
      calculatedAt: new Date().toISOString(),
    };

    // Save or update in store
    const existingIdx = data.riskAssessments.findIndex((r) => r.businessId === businessId);
    if (existingIdx >= 0) {
      data.riskAssessments[existingIdx] = assessment;
    } else {
      data.riskAssessments.push(assessment);
    }
    dbStore.persist();

    return assessment;
  }
}
