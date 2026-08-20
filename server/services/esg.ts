import { and, desc, eq } from "drizzle-orm";
import { DatabaseError, getDb } from "../_core/db";
import {
  companyProfiles,
  esgDocuments,
  esgSnapshots,
  type NewCompanyProfile
} from "../db/schema";

export type CompanyProfileInput = Omit<
  NewCompanyProfile,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type AnalysisInput = {
  reportingPeriod: string;
  carbonChange: number;
  renewableEnergy: number;
  employeeTurnover: number;
  workplaceIncidents: number;
  boardDiversity: number;
  independentDirectors: number;
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const demoOverview = {
  company: {
    name: "Northstar Manufacturing Ltd.",
    industry: "Industrial Manufacturing",
    sector: "Advanced Materials",
    size: "Large enterprise",
    country: "India",
    employeeCount: 4500,
    reportingYear: 2026,
    reportingStandard: "GRI + IFRS S1/S2"
  },
  assessment: {
    reportingPeriod: "Q2 2026",
    environmentalScore: 74,
    socialScore: 86,
    governanceScore: 88,
    overallScore: 82,
    riskLevel: "medium" as const,
    confidence: 87,
    modelStatus: "Illustrative model output"
  },
  trend: [
    { period: "Q3 2025", overall: 78, environmental: 70, social: 82, governance: 84 },
    { period: "Q4 2025", overall: 80, environmental: 72, social: 84, governance: 86 },
    { period: "Q1 2026", overall: 84, environmental: 79, social: 86, governance: 88 },
    { period: "Q2 2026", overall: 82, environmental: 74, social: 86, governance: 88 }
  ],
  drivers: [
    {
      key: "carbon_emissions",
      label: "Scope 1 & 2 emissions",
      pillar: "Environmental",
      impact: -12,
      direction: "negative",
      shapRank: 1,
      limeAgreement: 0.91
    },
    {
      key: "renewable_energy",
      label: "Renewable energy share",
      pillar: "Environmental",
      impact: 8,
      direction: "positive",
      shapRank: 2,
      limeAgreement: 0.86
    },
    {
      key: "employee_turnover",
      label: "Employee turnover",
      pillar: "Social",
      impact: -6,
      direction: "negative",
      shapRank: 3,
      limeAgreement: 0.79
    },
    {
      key: "board_independence",
      label: "Independent directors",
      pillar: "Governance",
      impact: 5,
      direction: "positive",
      shapRank: 4,
      limeAgreement: 0.83
    }
  ],
  consistencyFlags: [
    {
      severity: "high",
      claim: "Operational emissions decreased by 12%.",
      evidence: "Regulatory filing indicates a 3% year-on-year increase for comparable facilities.",
      source: "FY2026 sustainability report vs. regulatory filing",
      status: "Needs review"
    },
    {
      severity: "medium",
      claim: "100% of strategic suppliers assessed.",
      evidence: "Uploaded procurement extract covers 82% of strategic suppliers.",
      source: "Supplier disclosure vs. procurement extract",
      status: "Evidence gap"
    }
  ],
  recommendations: [
    {
      id: "rec-1",
      pillar: "Environmental",
      priority: "High",
      title: "Create a facility-level emissions reduction plan",
      action: "Prioritize the three highest-emitting facilities, assign monthly targets, and verify the baseline before claiming reductions.",
      rationale: "Emissions are the largest negative risk driver and the related disclosure has a material consistency flag.",
      timeframe: "0–90 days",
      standardReference: "GRI 305 / IFRS S2"
    },
    {
      id: "rec-2",
      pillar: "Environmental",
      priority: "High",
      title: "Increase contracted renewable electricity",
      action: "Evaluate on-site solar, renewable PPAs, and tariff options for the highest-consumption facilities.",
      rationale: "Renewable energy share is a positive driver but remains below the sector target used in this assessment.",
      timeframe: "3–12 months",
      standardReference: "GRI 302 / IFRS S2"
    },
    {
      id: "rec-3",
      pillar: "Social",
      priority: "Medium",
      title: "Investigate voluntary turnover hotspots",
      action: "Segment turnover by site, role, tenure, and manager; pair the findings with a quarterly employee listening plan.",
      rationale: "Turnover reduced the social score and deteriorated compared with the previous reporting period.",
      timeframe: "0–90 days",
      standardReference: "GRI 401"
    }
  ],
  alerts: [
    {
      id: "alert-1",
      severity: "high",
      title: "Environmental score declined 5 points",
      message: "The main detected driver is higher comparable-facility emissions.",
      createdAt: "2026-07-28"
    },
    {
      id: "alert-2",
      severity: "medium",
      title: "Disclosure consistency review required",
      message: "Two self-reported claims do not fully align with independent evidence.",
      createdAt: "2026-07-26"
    }
  ],
  sources: [
    {
      id: "A1",
      title: "FY2026 Sustainability Report",
      sourceType: "Company disclosure",
      excerpt: "The company reports a 12% reduction in operational emissions."
    },
    {
      id: "A2",
      title: "Comparable-facility Regulatory Filing",
      sourceType: "Regulatory filing",
      excerpt: "Reported comparable-facility emissions increased by 3% year on year."
    },
    {
      id: "A3",
      title: "Q2 2026 ESG Metric Set",
      sourceType: "Validated metrics",
      excerpt: "Renewable electricity share is 38%; voluntary turnover is 14.2%."
    }
  ],
  dataQuality: {
    completeness: 92,
    sourceCoverage: 84,
    validationPassRate: 89,
    lastUpdated: "2026-07-29"
  }
};

export async function getEsgOverview(userId: string) {
  const db = getDb();
  const profile = await db
    .select()
    .from(companyProfiles)
    .where(eq(companyProfiles.userId, userId))
    .limit(1);
  const snapshot = await db
    .select()
    .from(esgSnapshots)
    .where(eq(esgSnapshots.userId, userId))
    .orderBy(desc(esgSnapshots.createdAt))
    .limit(1);

  return {
    ...demoOverview,
    company: profile[0] ?? demoOverview.company,
    assessment: snapshot[0]
      ? {
          reportingPeriod: snapshot[0].reportingPeriod,
          environmentalScore: snapshot[0].environmentalScore,
          socialScore: snapshot[0].socialScore,
          governanceScore: snapshot[0].governanceScore,
          overallScore: snapshot[0].overallScore,
          riskLevel: snapshot[0].riskLevel,
          confidence: snapshot[0].confidence,
          modelStatus: "Transparent prototype scoring output"
        }
      : demoOverview.assessment
  };
}

export async function saveCompanyProfile(userId: string, input: CompanyProfileInput) {
  const db = getDb();
  const existing = await db
    .select({ id: companyProfiles.id })
    .from(companyProfiles)
    .where(eq(companyProfiles.userId, userId))
    .limit(1);

  if (existing[0]) {
    const rows = await db
      .update(companyProfiles)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(and(eq(companyProfiles.id, existing[0].id), eq(companyProfiles.userId, userId)))
      .returning();
    return rows[0];
  }

  const rows = await db
    .insert(companyProfiles)
    .values({ ...input, userId })
    .returning();
  return rows[0];
}

export async function analyzeEsg(userId: string, input: AnalysisInput) {
  const environmentalScore = clamp(
    76 - Math.max(0, input.carbonChange) * 1.2 + input.renewableEnergy * 0.18
  );
  const socialScore = clamp(
    92 - input.employeeTurnover * 0.65 - input.workplaceIncidents * 1.5
  );
  const governanceScore = clamp(
    58 + input.boardDiversity * 0.28 + input.independentDirectors * 0.22
  );
  const overallScore = clamp(
    environmentalScore * 0.4 + socialScore * 0.3 + governanceScore * 0.3
  );
  const riskLevel = overallScore >= 80 ? "low" : overallScore >= 60 ? "medium" : "high";
  const rows = await getDb()
    .insert(esgSnapshots)
    .values({
      userId,
      reportingPeriod: input.reportingPeriod,
      environmentalScore,
      socialScore,
      governanceScore,
      overallScore,
      riskLevel,
      confidence: 82,
      metricsJson: JSON.stringify(input)
    })
    .returning();

  return {
    snapshot: rows[0],
    methodology:
      "Transparent prototype scoring for product demonstration; replace with trained and empirically validated models before research claims are made."
  };
}

export async function listEsgDocuments(userId: string) {
  return getDb()
    .select()
    .from(esgDocuments)
    .where(eq(esgDocuments.userId, userId))
    .orderBy(desc(esgDocuments.createdAt))
    .limit(100);
}

export async function registerEsgDocument(
  userId: string,
  input: { storageFileId?: string; fileName: string; fileType: string }
) {
  const rows = await getDb()
    .insert(esgDocuments)
    .values({
      userId,
      storageFileId: input.storageFileId,
      fileName: input.fileName,
      fileType: input.fileType,
      processingStatus: "ready",
      sourceReliability: 78,
      extractedClaimCount: 14
    })
    .returning();
  if (!rows[0]) {
    throw new DatabaseError("DATABASE_QUERY_FAILED", "Document could not be registered", 502);
  }
  return rows[0];
}
