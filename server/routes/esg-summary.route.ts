import { Hono, type Context } from "hono";
import { apiFailure, apiSuccess } from "@repo/shared/http";
import { protectedRoute } from "../_core/route-helpers";
import { getEsgOverview } from "../services/esg";
import { PlatformAIError, requestPlatformAIChat } from "../services/platform-ai";

export const esgSummaryRouter = new Hono();

const summaryHandler = async (c: Context) => {
  const overview = await getEsgOverview(c.var.currentUser.id);
  const evidence = {
    company: overview.company,
    assessment: overview.assessment,
    drivers: overview.drivers,
    consistencyFlags: overview.consistencyFlags,
    recommendations: overview.recommendations,
    sources: overview.sources
  };

  try {
    const result = await requestPlatformAIChat({
      sceneKey: "esg_report_summary",
      messages: [
        {
          role: "system",
          content:
            "Write a concise executive ESG assessment summary using only the supplied JSON. Separate current performance, material risks, evidence limitations, and priority actions. Cite source IDs in square brackets. Never describe illustrative scores as empirically validated."
        },
        { role: "user", content: JSON.stringify(evidence) }
      ]
    });
    return c.json(apiSuccess({ summary: result.reply }), 200);
  } catch (error) {
    if (error instanceof PlatformAIError) {
      return c.json(apiFailure(error.code, error.message), error.status);
    }
    throw error;
  }
};

esgSummaryRouter.post("", protectedRoute, summaryHandler);
esgSummaryRouter.post("/", protectedRoute, summaryHandler);
