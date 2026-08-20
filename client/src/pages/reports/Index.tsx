import { useState } from "react";
import { Bot, Download, FileBarChart, Loader2, Printer, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { demoOverview } from "@/lib/esg-data";

const defaultSummary =
  "Northstar Manufacturing’s illustrative Q2 2026 assessment indicates resilient Social and Governance performance, while Environmental performance requires review. Scope 1 and 2 emissions are the largest negative model driver, and the reported reduction claim does not align with comparable regulatory evidence. The immediate priority is to verify the facility-level emissions baseline before publishing the reduction claim, followed by a targeted renewable-electricity plan.";

export default function ReportsPage() {
  const { data: session } = authClient.useSession();
  const [summary, setSummary] = useState(defaultSummary);
  const [generating, setGenerating] = useState(false);

  const generateSummary = async () => {
    if (!session?.user) {
      toast.info("Sign in to generate a live source-grounded AI summary.");
      return;
    }
    setGenerating(true);
    try {
      const response = await apiFetch("/esg-summary", { method: "POST" });
      const payload = (await response.json()) as { ok?: boolean; data?: { summary?: string } };
      if (!response.ok || !payload.data?.summary) throw new Error("AI summary failed");
      setSummary(payload.data.summary);
      toast.success("Source-grounded summary generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI summary failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Assessment ID ESG-2026-Q2-014</Badge>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Evidence trail attached</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 size-4" /> Print</Button>
          <Button onClick={() => toast.success("Report export prepared for the prototype")}><Download className="mr-2 size-4" /> Download report</Button>
        </div>
      </div>

      <Card className="mx-auto max-w-5xl print:border-0 print:shadow-none">
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">ESG assessment report</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{demoOverview.company.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{demoOverview.company.industry} · {demoOverview.assessment.reportingPeriod}</p>
            </div>
            <div className="rounded-2xl bg-[#12382c] px-6 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.12em] text-white/55">Overall score</p>
              <div className="mt-1 flex items-end gap-2"><strong className="text-4xl">82</strong><span className="pb-1 text-sm text-white/55">/100</span></div>
              <Badge className="mt-3 bg-amber-300/15 text-amber-100 hover:bg-amber-300/15">Medium risk</Badge>
            </div>
          </div>

          <section className="py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-semibold">Executive summary</h3>
                <p className="mt-1 text-xs text-muted-foreground">Grounded in the assessment evidence shown below</p>
              </div>
              <Button variant="outline" size="sm" onClick={generateSummary} disabled={generating}>
                {generating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Bot className="mr-2 size-4" />}
                Generate with ESG AI
              </Button>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{summary}</p>
          </section>

          <section className="border-t border-border py-8">
            <h3 className="font-display text-2xl font-semibold">Pillar scores</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["Environmental", 74, "Needs attention"],
                ["Social", 86, "Strong"],
                ["Governance", 88, "Strong"]
              ].map(([label, score, status]) => (
                <div key={String(label)} className="rounded-xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold">{score}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border py-8">
            <h3 className="font-display text-2xl font-semibold">Material findings</h3>
            <div className="mt-5 space-y-3">
              {demoOverview.drivers.slice(0, 3).map((driver, index) => (
                <div key={driver.key} className="grid gap-3 rounded-xl bg-secondary p-4 sm:grid-cols-[32px_1fr_auto] sm:items-center">
                  <span className="grid size-8 place-items-center rounded-full bg-card text-xs font-semibold">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{driver.label}</p>
                    <p className="text-xs text-muted-foreground">{driver.pillar} risk driver</p>
                  </div>
                  <strong className={driver.impact > 0 ? "text-emerald-700" : "text-rose-700"}>{driver.impact > 0 ? "+" : ""}{driver.impact}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border py-8">
            <h3 className="font-display text-2xl font-semibold">Priority actions</h3>
            <div className="mt-5 space-y-4">
              {demoOverview.recommendations.slice(0, 2).map((recommendation) => (
                <div key={recommendation.id} className="rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2"><Badge>{recommendation.priority}</Badge><Badge variant="outline">{recommendation.standard}</Badge></div>
                  <p className="mt-4 text-sm font-semibold">{recommendation.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{recommendation.action}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-8">
            <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-950">Methodology disclosure</p>
                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  This prototype report uses illustrative scoring and simulated assessment values. Any empirical publication must replace them with measured model performance, documented datasets, and validated outcomes.
                </p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </AppShell>
  );
}
