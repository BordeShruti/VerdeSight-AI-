import { Hono, type Context } from "hono";
import { z } from "zod";
import { apiFailure, apiSuccess } from "@repo/shared/http";
import { DatabaseError } from "../_core/db";
import { protectedRoute } from "../_core/route-helpers";
import {
  analyzeEsg,
  getEsgOverview,
  listEsgDocuments,
  registerEsgDocument,
  saveCompanyProfile
} from "../services/esg";

const CompanySchema = z.object({
  name: z.string().trim().min(2).max(160),
  industry: z.string().trim().min(2).max(120),
  sector: z.string().trim().min(2).max(120),
  size: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(100),
  employeeCount: z.number().int().min(0).max(10_000_000),
  reportingYear: z.number().int().min(2000).max(2100),
  reportingStandard: z.string().trim().min(2).max(160)
});

const AnalysisSchema = z.object({
  reportingPeriod: z.string().trim().min(2).max(40),
  carbonChange: z.number().min(-100).max(500),
  renewableEnergy: z.number().min(0).max(100),
  employeeTurnover: z.number().min(0).max(100),
  workplaceIncidents: z.number().min(0).max(10000),
  boardDiversity: z.number().min(0).max(100),
  independentDirectors: z.number().min(0).max(100)
});

const DocumentSchema = z.object({
  storageFileId: z.string().trim().min(1).max(200).optional(),
  fileName: z.string().trim().min(1).max(255),
  fileType: z.string().trim().min(1).max(120)
});

export const esgRouter = new Hono();

const handleDatabaseError = (c: Context, error: unknown) => {
  if (error instanceof DatabaseError) {
    return c.json(
      apiFailure(error.code, error.message),
      error.status === 404 ? 404 : error.status === 503 ? 503 : 502
    );
  }
  throw error;
};

esgRouter.get("", protectedRoute, async (c: Context) => {
  try {
    return c.json(apiSuccess(await getEsgOverview(c.var.currentUser.id)), 200);
  } catch (error) {
    return handleDatabaseError(c, error);
  }
});

esgRouter.get("/", protectedRoute, async (c: Context) => {
  try {
    return c.json(apiSuccess(await getEsgOverview(c.var.currentUser.id)), 200);
  } catch (error) {
    return handleDatabaseError(c, error);
  }
});

esgRouter.put("/company", protectedRoute, async (c: Context) => {
  const parsed = CompanySchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json(apiFailure("INVALID_INPUT", "Please check the company profile fields"), 400);
  }
  try {
    return c.json(
      apiSuccess({ company: await saveCompanyProfile(c.var.currentUser.id, parsed.data) }),
      200
    );
  } catch (error) {
    return handleDatabaseError(c, error);
  }
});

esgRouter.post("/analyze", protectedRoute, async (c: Context) => {
  const parsed = AnalysisSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json(apiFailure("INVALID_INPUT", "Please check the ESG metric values"), 400);
  }
  try {
    return c.json(apiSuccess(await analyzeEsg(c.var.currentUser.id, parsed.data)), 200);
  } catch (error) {
    return handleDatabaseError(c, error);
  }
});

esgRouter.get("/documents", protectedRoute, async (c: Context) => {
  try {
    return c.json(
      apiSuccess({ documents: await listEsgDocuments(c.var.currentUser.id) }),
      200
    );
  } catch (error) {
    return handleDatabaseError(c, error);
  }
});

esgRouter.post("/documents", protectedRoute, async (c: Context) => {
  const parsed = DocumentSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json(apiFailure("INVALID_INPUT", "Document metadata is invalid"), 400);
  }
  try {
    return c.json(
      apiSuccess({
        document: await registerEsgDocument(c.var.currentUser.id, parsed.data)
      }),
      200
    );
  } catch (error) {
    return handleDatabaseError(c, error);
  }
});
