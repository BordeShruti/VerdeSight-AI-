CREATE TABLE IF NOT EXISTS company_profiles (
  id                TEXT PRIMARY KEY,
  userId            TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  industry          TEXT NOT NULL,
  sector            TEXT NOT NULL,
  size              TEXT NOT NULL,
  country           TEXT NOT NULL,
  employeeCount     INTEGER NOT NULL DEFAULT 0,
  reportingYear     INTEGER NOT NULL,
  reportingStandard TEXT NOT NULL DEFAULT 'GRI + IFRS S1/S2',
  createdAt         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_company_profiles_userId ON company_profiles (userId);

CREATE TABLE IF NOT EXISTS esg_snapshots (
  id                 TEXT PRIMARY KEY,
  userId             TEXT NOT NULL,
  reportingPeriod    TEXT NOT NULL,
  environmentalScore INTEGER NOT NULL,
  socialScore        INTEGER NOT NULL,
  governanceScore    INTEGER NOT NULL,
  overallScore       INTEGER NOT NULL,
  riskLevel          TEXT NOT NULL,
  confidence         INTEGER NOT NULL DEFAULT 0,
  metricsJson        TEXT NOT NULL DEFAULT '{}',
  createdAt          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_esg_snapshots_userId ON esg_snapshots (userId);
CREATE INDEX IF NOT EXISTS idx_esg_snapshots_period ON esg_snapshots (reportingPeriod);

CREATE TABLE IF NOT EXISTS esg_documents (
  id                   TEXT PRIMARY KEY,
  userId               TEXT NOT NULL,
  storageFileId        TEXT,
  fileName             TEXT NOT NULL,
  fileType             TEXT NOT NULL,
  processingStatus     TEXT NOT NULL DEFAULT 'queued',
  sourceReliability    INTEGER NOT NULL DEFAULT 70,
  extractedClaimCount  INTEGER NOT NULL DEFAULT 0,
  createdAt            TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_esg_documents_userId ON esg_documents (userId);

INSERT INTO ai_business_scenes (id, scene_key, name, description, definition)
VALUES (
  'esg_assistant',
  'esg_assistant',
  'ESG Evidence Assistant',
  'Answers company ESG questions using verified assessment context, risk drivers, recommendations, and source excerpts',
  '{"source":"website-platform-ai","registeredBy":"skywork-cli","grounding":"server-curated-esg-context"}'
)
ON CONFLICT(scene_key) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  definition = excluded.definition,
  updatedAt = CURRENT_TIMESTAMP;

INSERT INTO ai_business_scenes (id, scene_key, name, description, definition)
VALUES (
  'esg_report_summary',
  'esg_report_summary',
  'ESG Report Summary',
  'Produces source-grounded plain-language summaries of ESG assessment findings and priority actions',
  '{"source":"website-platform-ai","registeredBy":"skywork-cli","grounding":"server-curated-esg-context"}'
)
ON CONFLICT(scene_key) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  definition = excluded.definition,
  updatedAt = CURRENT_TIMESTAMP;
