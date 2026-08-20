import { Hono, type Context } from "hono";
import { z } from "zod";
import { apiFailure, apiSuccess } from "@repo/shared/http";
import { protectedRoute } from "../_core/route-helpers";
import { getEsgOverview } from "../services/esg";
import { PlatformAIError, requestPlatformAIChat } from "../services/platform-ai";

const RequestSchema = z.object({
  question: z.string().trim().min(2).max(2000)
});

export const esgAssistantRouter = new Hono();

const assistantHandler = async (c: Context) => {
  const parsed = RequestSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json(apiFailure("INVALID_INPUT", "Enter a valid ESG question"), 400);
  }

  const overview = await getEsgOverview(c.var.currentUser.id);
  const sourceContext = overview.sources
    .map((source) => `[${source.id}] ${source.title}: ${source.excerpt}`)
    .join("\n");
  const systemPrompt = [
    "You are an ESG evidence assistant for a company decision-support system.",
    "Use only the supplied assessment context and sources. Do not invent facts.",
    "If the evidence is insufficient, state that clearly and request the missing source.",
    "Distinguish observed data from model output and recommendations.",
    "Cite supporting source labels such as [A1] in every factual answer.",
    `Assessment: ${JSON.stringify(overview.assessment)}`,
    `Risk drivers: ${JSON.stringify(overview.drivers)}`,
    `Consistency flags: ${JSON.stringify(overview.consistencyFlags)}`,
    `Recommendations: ${JSON.stringify(overview.recommendations)}`,
    `Sources:\n${sourceContext}`
  ].join("\n\n");

  try {
    const result = await requestPlatformAIChat({
      sceneKey: "esg_assistant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: parsed.data.question }
      ]
    });
    return c.json(apiSuccess({ reply: result.reply, sourceCount: overview.sources.length }), 200);
  } catch (error) {
    if (error instanceof PlatformAIError) {
      return c.json(apiFailure(error.code, error.message), error.status);
    }
    throw error;
  }
};

esgAssistantRouter.post("", protectedRoute, assistantHandler);
esgAssistantRouter.post("/", protectedRoute, assistantHandler);
