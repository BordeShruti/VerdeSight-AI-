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
    riskLevel: "Medium",
    confidence: 87
  },
  trend: [
    { period: "Q3 '25", overall: 78, environmental: 70, social: 82, governance: 84 },
    { period: "Q4 '25", overall: 80, environmental: 72, social: 84, governance: 86 },
    { period: "Q1 '26", overall: 84, environmental: 79, social: 86, governance: 88 },
    { period: "Q2 '26", overall: 82, environmental: 74, social: 86, governance: 88 }
  ],
  drivers: [
    {
      key: "carbon_emissions",
      label: "Scope 1 & 2 emissions",
      pillar: "Environmental",
      impact: -12,
      direction: "negative",
      agreement: 91
    },
    {
      key: "renewable_energy",
      label: "Renewable energy share",
      pillar: "Environmental",
      impact: 8,
      direction: "positive",
      agreement: 86
    },
    {
      key: "employee_turnover",
      label: "Employee turnover",
      pillar: "Social",
      impact: -6,
      direction: "negative",
      agreement: 79
    },
    {
      key: "board_independence",
      label: "Independent directors",
      pillar: "Governance",
      impact: 5,
      direction: "positive",
      agreement: 83
    }
  ],
  flags: [
    {
      severity: "High",
      claim: "Operational emissions decreased by 12%.",
      evidence: "Regulatory filing indicates a 3% year-on-year increase for comparable facilities.",
      source: "FY2026 sustainability report vs. regulatory filing"
    },
    {
      severity: "Medium",
      claim: "100% of strategic suppliers assessed.",
      evidence: "Uploaded procurement extract covers 82% of strategic suppliers.",
      source: "Supplier disclosure vs. procurement extract"
    }
  ],
  recommendations: [
    {
      id: "rec-1",
      pillar: "Environmental",
      priority: "High",
      title: "Create a facility-level emissions reduction plan",
      action:
        "Prioritize the three highest-emitting facilities, assign monthly targets, and verify the baseline before claiming reductions.",
      rationale:
        "Emissions are the largest negative risk driver and the related disclosure has a material consistency flag.",
      timeframe: "0–90 days",
      standard: "GRI 305 / IFRS S2"
    },
    {
      id: "rec-2",
      pillar: "Environmental",
      priority: "High",
      title: "Increase contracted renewable electricity",
      action:
        "Evaluate on-site solar, renewable PPAs, and tariff options for the highest-consumption facilities.",
      rationale:
        "Renewable energy share is positive but remains below the sector target used in this assessment.",
      timeframe: "3–12 months",
      standard: "GRI 302 / IFRS S2"
    },
    {
      id: "rec-3",
      pillar: "Social",
      priority: "Medium",
      title: "Investigate voluntary turnover hotspots",
      action:
        "Segment turnover by site, role, tenure, and manager; pair the findings with a quarterly employee listening plan.",
      rationale:
        "Turnover reduced the social score and deteriorated compared with the previous reporting period.",
      timeframe: "0–90 days",
      standard: "GRI 401"
    }
  ],
  alerts: [
    {
      severity: "High",
      title: "Environmental score declined 5 points",
      detail: "The main detected driver is higher comparable-facility emissions.",
      date: "28 Jul 2026"
    },
    {
      severity: "Medium",
      title: "Disclosure consistency review required",
      detail: "Two self-reported claims do not fully align with independent evidence.",
      date: "26 Jul 2026"
    }
  ],
  sources: [
    {
      id: "A1",
      title: "FY2026 Sustainability Report",
      type: "Company disclosure",
      excerpt: "The company reports a 12% reduction in operational emissions."
    },
    {
      id: "A2",
      title: "Comparable-facility Regulatory Filing",
      type: "Regulatory filing",
      excerpt: "Reported comparable-facility emissions increased by 3% year on year."
    },
    {
      id: "A3",
      title: "Q2 2026 ESG Metric Set",
      type: "Validated metrics",
      excerpt: "Renewable electricity share is 38%; voluntary turnover is 14.2%."
    }
  ]
};

export const metricGroups = {
  Environmental: [
    { key: "carbonChange", label: "Carbon emissions change", value: "8.4", unit: "% YoY", status: "Review" },
    { key: "renewableEnergy", label: "Renewable energy", value: "38", unit: "%", status: "Valid" },
    { key: "energyConsumption", label: "Energy consumption", value: "126.4", unit: "GWh", status: "Valid" },
    { key: "waterConsumption", label: "Water withdrawal", value: "1.82", unit: "ML", status: "Valid" },
    { key: "recycling", label: "Waste recycled", value: "71", unit: "%", status: "Valid" },
    { key: "airPollution", label: "Air-quality incidents", value: "2", unit: "events", status: "Valid" }
  ],
  Social: [
    { key: "turnover", label: "Employee turnover", value: "14.2", unit: "%", status: "Review" },
    { key: "satisfaction", label: "Employee satisfaction", value: "78", unit: "/100", status: "Valid" },
    { key: "accidents", label: "Recordable incidents", value: "1.6", unit: "TRIR", status: "Valid" },
    { key: "training", label: "Training hours", value: "26", unit: "hrs/FTE", status: "Valid" },
    { key: "gender", label: "Women in management", value: "34", unit: "%", status: "Valid" },
    { key: "humanRights", label: "Human-rights violations", value: "0", unit: "cases", status: "Valid" }
  ],
  Governance: [
    { key: "boardDiversity", label: "Board diversity", value: "41", unit: "%", status: "Valid" },
    { key: "independent", label: "Independent directors", value: "64", unit: "%", status: "Valid" },
    { key: "audit", label: "Audit committee meetings", value: "6", unit: "annual", status: "Valid" },
    { key: "privacy", label: "Material privacy incidents", value: "0", unit: "cases", status: "Valid" },
    { key: "regulatory", label: "Regulatory violations", value: "1", unit: "case", status: "Review" },
    { key: "antiCorruption", label: "Anti-corruption training", value: "96", unit: "% staff", status: "Valid" }
  ]
} as const;
