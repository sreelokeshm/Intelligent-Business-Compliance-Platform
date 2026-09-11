import { GoogleGenAI } from '@google/genai';
import { dbStore } from '../db/store.js';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini client initialization failed, using fallback rule engine:', err);
    }
  }
  return geminiClient;
}

export class AiRegulatoryAssistant {
  public static async answerQuery(
    userId: string,
    businessId: string | undefined,
    userQuery: string
  ): Promise<{ answer: string; suggestedQuestions: string[]; references: string[] }> {
    const data = dbStore.getData();
    const business = data.businesses.find((b) => b.id === businessId || b.userId === userId);
    const documents = business ? data.documents.filter((d) => d.businessId === business.id) : [];
    const applications = business ? data.applications.filter((a) => a.businessId === business.id) : [];
    const deadlines = business ? data.deadlines.filter((d) => d.businessId === business.id) : [];
    const checklists = business ? data.checklists.filter((c) => c.businessId === business.id) : [];
    const schemes = data.schemes.filter((s) => s.status === 'Active');

    const lower = userQuery.toLowerCase();

    // 1. Try Gemini API first if configured
    const client = getGeminiClient();
    if (client && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are the Official AI Regulatory & Compliance Assistant for the Intelligent Business Approval, Licensing & Compliance Management Platform.
You are assisting an Indian entrepreneur with statutory approvals, factory licenses, fire NOCs, environmental clearances, document validation, and government incentives.

Current Business Context:
- Name: ${business?.name || 'NovaTech Manufacturing Pvt. Ltd.'}
- Sector: ${business?.sector || 'Manufacturing'}
- Stage: ${business?.stage || 'Construction'}
- Investment: ₹${business ? (business.investmentAmount / 10000000).toFixed(2) : '2.5'} Crore
- Employees: ${business?.employeeCount || 65}
- Location: ${business?.location.city || 'Sriperumbudur'}, ${business?.location.state || 'Tamil Nadu'} (${business?.location.zone || 'Industrial Area'})
- Environmental Category: ${business?.environmentalCategory || 'Orange'}
- Compliance Score: ${business?.complianceScore || 68}% (${business?.status || 'Action Required'})

Existing Applications:
${applications.map((a) => `- [${a.applicationId}] ${a.requirementName}: Status=${a.status}, Risk=${a.riskLevel}, Assigned=${a.assignedOfficer || 'Joint Cell'}`).join('\n')}

Upcoming Deadlines:
${deadlines.map((d) => `- ${d.title}: Due on ${d.dueDate} (${d.daysRemaining} days left) - ${d.status}`).join('\n')}

Current Documents:
${documents.map((d) => `- ${d.name}: Status=${d.verificationStatus}`).join('\n')}

Provide authoritative, professional, structured, and clear advice. Keep answers under 300 words with bullet points. Mention relevant Indian statutory regulations (e.g. Factories Act 1948, National Building Code NBC Part IV, Water & Air Acts).`;

        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }],
            },
          ],
        });

        if (response.text) {
          return {
            answer: response.text,
            suggestedQuestions: [
              'What documents are required for Fire NOC?',
              'How can I raise my compliance score to 90%+?',
              'Which government subsidies apply to my plant?',
            ],
            references: [
              'National Building Code (NBC Part IV)',
              'Factories Act, 1948 Section 6',
              'State Pollution Control Board CTE Guidelines',
            ],
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to deterministic knowledge base:', err);
      }
    }

    // 2. Intelligent Rule-Based Fallback Engine
    let answer = '';
    const suggestedQuestions: string[] = [
      'What approvals do I need?',
      'Why do I need Fire NOC?',
      'What documents are missing?',
      'When is my renewal due?',
    ];
    const references: string[] = ['Statutory Rule Engine v3.2', 'National Single Window System'];

    if (lower.includes('fire noc') || lower.includes('fire safety') || lower.includes('fire')) {
      answer = `### Fire Safety Clearance & Preliminary NOC Requirements

Under the **National Building Code (NBC Part IV)** and State Fire Force Act, your facility (${business?.name || 'NovaTech Manufacturing'}) requires a Fire NOC because:

1. **Premises Classification**: Designated as an **Industrial Factory** with precision assembly, electrical machinery, and spray painting zones.
2. **Key Physical Stipulations**:
   - Minimum **6.0m peripheral all-weather driveway** clear of overhead obstructions for turntable fire tenders.
   - Dedicated **50,000 Litre static fire water storage** tank with independent diesel standby pump head.
   - UL-listed automatic sprinkler installation grid at 3.5m intervals.
   - Adequate Class ABC & CO2 fire extinguishers tagged and stamped.
3. **Current Status**: Your application **APP-2026-0842** is currently in **Inspection** stage. Field Officer Rajesh K. Pillai is scheduled for on-site verification on March 12, 2026.`;
      suggestedQuestions.push('What should I prepare for the fire inspection?', 'Who is my assigned fire officer?');
      references.push('NBC 2016 Part IV', 'State Directorate of Fire & Emergency Services');
    } else if (lower.includes('approval') || lower.includes('what do i need') || lower.includes('require')) {
      answer = `### Applicable Approvals for ${business?.name || 'NovaTech Manufacturing'}

Based on your profile (**${business?.sector || 'Manufacturing'}**, **${business?.stage || 'Construction'} stage**, **₹2.5 Cr investment**, and **Orange environmental category**), the rule engine has identified **8 statutory requirements**:

1. **Incorporation & Business ID (MCA / RoC)** — Status: Approved (CIN issued)
2. **Municipal Trade License** — Status: Approved (Renewal due in 25 days)
3. **DTCP Building Sanction & Plan Approval** — Status: Approved
4. **Fire Safety Clearance & Preliminary NOC** — Status: Under Inspection (Critical)
5. **Consent to Establish (CTE) / Pollution Board** — Status: Clarification Required
6. **Factories Act Registration & Work Permit** — Status: Pending Filing
7. **High Tension (HT) Industrial Power Sanction** — Status: Feasibility review
8. **Contract Labour (CLRA) Principal Employer Registration** — Status: Draft preparation`;
      suggestedQuestions.push('How do I complete the Environmental CTE?', 'Start my Factories Act application');
    } else if (lower.includes('document') || lower.includes('missing')) {
      const pendingDocs = documents.filter((d) => d.verificationStatus !== 'Verified');
      answer = `### Document Scrutiny & Missing Items Status

You currently have **${documents.length} statutory documents** registered in your business repository:

- **Verified Documents**: Incorporation Certificate (MCA), SIPCOT Land Allotment Order, DTCP Approved Blueprints.
- **Action Required / Pending Scrutiny**:
  1. **CETP Authorization / Sludge Disposal MoU**: Required immediately by the Pollution Control Board for CTE Clearance.
  2. **Machinery Schedule & Single Line Diagram**: Required for Factories Act Form 1 submission.
  3. **Trade License 2025-26 Renewal Receipt**: Current certificate expires on March 31, 2026.`;
      suggestedQuestions.push('Upload CETP Authorization', 'View document validation report');
    } else if (lower.includes('renewal') || lower.includes('deadline') || lower.includes('when')) {
      answer = `### Upcoming Deadlines & Renewal Calendar

Here are your imminent statutory milestones:

1. **Fire NOC Inspection & Demonstrations**: **5 Days Remaining** (March 15, 2026) — Critical
2. **SPCB Clarification Submission (ETP/CETP)**: **8 Days Remaining** (March 18, 2026) — Critical
3. **Municipal Trade License Annual Renewal**: **21 Days Remaining** (March 31, 2026) — Upcoming
4. **Factories Act Pre-Operational Filing**: **31 Days Remaining** (April 10, 2026) — Normal

*Tip: Responding to the SPCB clarification within 8 days prevents application lapse and avoids re-filing scrutiny fees.*`;
      suggestedQuestions.push('How do I submit the SPCB clarification?', 'Pay Trade License renewal fee');
    } else if (lower.includes('scheme') || lower.includes('subsidy') || lower.includes('grant')) {
      answer = `### Matched Government Schemes & Incentives

Based on your location in **Tamil Nadu (SIPCOT)** and **Manufacturing Sector**, you qualify for high-value government programs:

1. **SIPCOT Industrial Capital Investment Subsidy (92% Match)**:
   - **Benefit**: 25% Capital Subsidy on Plant & Machinery (Up to ₹75 Lakhs) + 100% stamp duty exemption on industrial lease deed.
2. **Production Linked Incentive (PLI) for Auto Components (85% Match)**:
   - **Benefit**: 8% to 13% cash incentive on incremental turnover.
3. **MSME Green Energy & Rooftop Solar Adoption (80% Match)**:
   - **Benefit**: 40% upfront capital grant for on-grid solar installation.`;
      suggestedQuestions.push('Check eligibility for SIPCOT 25% Subsidy', 'View PLI scheme documents');
    } else if (lower.includes('status') || lower.includes('application')) {
      answer = `### Active Applications Overview

- **APP-2026-0842 (Fire Safety Clearance)**: Current Status is **Inspection**. Assigned Officer: Rajesh K. Pillai. Progress: 70%.
- **APP-2026-0843 (Consent to Establish CTE)**: Current Status is **Clarification Required**. SPCB Senior Engineer Sunita Menon requested CETP tie-up document.
- **APP-2026-0101 (Incorporation Certificate)**: Status **Approved**.`;
      suggestedQuestions.push('Respond to SPCB clarification', 'Track Fire NOC inspection progress');
    } else {
      answer = `### Digital Compliance Journey Assistant

Welcome to your Intelligent Compliance Advisor. I can assist you with:
- Analyzing all licenses, NOCs, and registrations needed for your industry and stage.
- Explaining specific regulatory standards (Fire Safety, Pollution Board CTE/CTO, Factories Act, Municipal permits).
- Tracking pending application deadlines, officer inspection visits, and document clarifications.
- Finding matching state and central government subsidies and incentive programs.

How can I guide your compliance journey today?`;
    }

    return {
      answer,
      suggestedQuestions,
      references,
    };
  }
}
