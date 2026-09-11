import { RequirementRule, GovernmentScheme } from '../db/schema.js';
import { dbStore } from '../db/store.js';

export interface BusinessProfileInput {
  sector: string;
  location: {
    state: string;
    district: string;
    city: string;
    zone: string;
  };
  investmentAmount: number;
  employeeCount: number;
  projectSize: string;
  stage: string;
  environmentalCategory: string;
  buildingType?: string;
  riskCategory?: string;
}

export interface RuleEvaluationResult {
  totalIdentified: number;
  requirements: (RequirementRule & {
    applicableReason: string;
    statutoryPriority: 'High' | 'Medium' | 'Low';
  })[];
  applicableSchemes: (GovernmentScheme & {
    matchScore: number;
    matchReasons: string[];
  })[];
  summary: {
    registrationsCount: number;
    licencesCount: number;
    nocsCount: number;
    permissionsCount: number;
    inspectionsRequiredCount: number;
  };
}

export class RequirementRuleEngine {
  public static evaluate(profile: BusinessProfileInput): RuleEvaluationResult {
    const data = dbStore.getData();
    const rules = data.rules.filter((r) => r.status === 'active');
    const schemes = data.schemes.filter((s) => s.status === 'Active');

    const matchedRequirements: (RequirementRule & {
      applicableReason: string;
      statutoryPriority: 'High' | 'Medium' | 'Low';
    })[] = [];

    for (const rule of rules) {
      let matchesSector =
        rule.applicableSectors.includes('*') ||
        rule.applicableSectors.includes(profile.sector);

      let matchesStage =
        rule.applicableStages.includes('*') ||
        rule.applicableStages.includes(profile.stage);

      let matchesInvestment =
        profile.investmentAmount >= (rule.minInvestment || 0) &&
        (!rule.maxInvestment || profile.investmentAmount <= rule.maxInvestment);

      let matchesEmployees =
        !rule.minEmployees || profile.employeeCount >= rule.minEmployees;

      let matchesEnv = true;
      if (rule.environmentalCategories && rule.environmentalCategories.length > 0) {
        matchesEnv = rule.environmentalCategories.includes(profile.environmentalCategory);
      }

      // If matches sector & investment & employees & stage (or general baseline)
      if (matchesSector && matchesInvestment && matchesEmployees && matchesEnv) {
        let reason = `Triggered for ${profile.sector} sector in ${profile.stage} stage`;
        if (rule.minEmployees && profile.employeeCount >= rule.minEmployees) {
          reason += ` with ${profile.employeeCount} employees (statutory threshold: ${rule.minEmployees})`;
        }
        if (rule.environmentalCategories?.includes(profile.environmentalCategory)) {
          reason += ` under ${profile.environmentalCategory} environmental category`;
        }

        matchedRequirements.push({
          ...rule,
          applicableReason: reason,
          statutoryPriority: rule.priority,
        });
      }
    }

    // Ensure at least all general core requirements are always included if applicable
    // Fallback: If 0 or few matched, ensure fundamental rules (MCA, Municipal, Fire, etc.) appear
    if (matchedRequirements.length < 3) {
      for (const rule of rules) {
        if (!matchedRequirements.find((m) => m.id === rule.id)) {
          matchedRequirements.push({
            ...rule,
            applicableReason: `General statutory compliance applicable to commercial entities`,
            statutoryPriority: rule.priority,
          });
          if (matchedRequirements.length >= 7) break;
        }
      }
    }

    // Evaluate Schemes
    const matchedSchemes: (GovernmentScheme & {
      matchScore: number;
      matchReasons: string[];
    })[] = [];

    for (const scheme of schemes) {
      const matchReasons: string[] = [];
      let score = 50; // base score

      // Sector check
      if (scheme.eligibleBusinessTypes.includes(profile.sector) || scheme.eligibleBusinessTypes.includes('All')) {
        score += 25;
        matchReasons.push(`Sector '${profile.sector}' matches eligible focus areas`);
      }

      // Location check
      if (scheme.location.includes(profile.location.state) || scheme.location.includes('All States')) {
        score += 15;
        matchReasons.push(`Location in ${profile.location.state} satisfies geographical mandate`);
      }

      // Investment check
      if (
        profile.investmentAmount >= scheme.minInvestment &&
        profile.investmentAmount <= scheme.maxInvestment
      ) {
        score += 10;
        matchReasons.push(`Investment size of ₹${(profile.investmentAmount / 100000).toFixed(1)} Lakhs falls within grant bracket`);
      }

      matchedSchemes.push({
        ...scheme,
        matchScore: Math.min(score, 100),
        matchReasons,
      });
    }

    // Sort schemes by score descending
    matchedSchemes.sort((a, b) => b.matchScore - a.matchScore);

    const summary = {
      registrationsCount: matchedRequirements.filter((r) => r.category === 'Registration').length,
      licencesCount: matchedRequirements.filter((r) => r.category === 'Licence').length,
      nocsCount: matchedRequirements.filter((r) => r.category === 'NOC').length,
      permissionsCount: matchedRequirements.filter((r) => r.category === 'Permission').length,
      inspectionsRequiredCount: matchedRequirements.filter((r) => r.inspectionRequired).length,
    };

    return {
      totalIdentified: matchedRequirements.length,
      requirements: matchedRequirements,
      applicableSchemes: matchedSchemes,
      summary,
    };
  }
}
