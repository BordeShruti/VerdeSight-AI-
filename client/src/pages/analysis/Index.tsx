import { AlertTriangle, ArrowDownRight, ArrowUpRight, CircleHelp, Scale, ShieldAlert } from "lucide-react";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { demoOverview } from "@/lib/esg-data";

export default function AnalysisPage() {
  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-4">
        {[
          { label: "Predicted risk", value: "Medium", detail: "Watch threshold", tone: "text-amber-700" },
          { label: "Model confidence", value: "87%", detail: "Prototype estimate", tone: "text-emerald-700" },
          { label: "SHAP–LIME agreement", value: "0.85", detail: "Mean top-driver agreement", tone: "text-sky-700" },
          { label: "Evidence flags", value: "2", detail: "Material checks open", tone: "text-rose-700" }
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-muted-foreground">{item.label}</p>
              <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${item.tone}`}>{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">What moved the score?</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Local feature contributions for the Q2 2026 assessment
                </p>
              </div>
              <Badge variant="outline">Illustrative SHAP-style impact</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-7">
              {demoOverview.drivers.map((driver) => {
                const positive = driver.impact > 0;
                return (
                  <div key={driver.key}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{driver.label}</p>
                        <p className="text-xs text-muted-foreground">{driver.pillar}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{driver.agreement}% agreement</Badge>
                        <span className={`flex items-center gap-1 text-sm font-bold ${positive ? "text-emerald-700" : "text-rose-700"}`}>
                          {positive ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                          {positive ? "+" : ""}{driver.impact}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
                        style={{ width: `${Math.abs(driver.impact) * 6.5}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 grid gap-3 rounded-2xl bg-secondary p-5 sm:grid-cols-3">
              {[
                { label: "Global importance", value: "SHAP", detail: "Portfolio-level ranking" },
                { label: "Local explanation", value: "LIME", detail: "Company-period reasoning" },
                { label: "Human check", value: "Expert", detail: "Plausibility review sample" }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-semibold">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Explanation fidelity</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {demoOverview.drivers.map((driver) => (
                <div key={driver.key}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">{driver.label}</span>
                    <strong>{driver.agreement}%</strong>
                  </div>
                  <Progress value={driver.agreement} className="h-2" />
                </div>
              ))}
              <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
                <CircleHelp className="mt-0.5 size-5 shrink-0 text-sky-700" />
                <p className="text-xs leading-5 text-sky-900">
                  Agreement does not prove causal correctness. The research design therefore includes expert plausibility review.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5">
              <Scale className="size-6 text-amber-700" />
              <p className="mt-4 text-sm font-semibold text-amber-950">Associative, not causal</p>
              <p className="mt-2 text-xs leading-5 text-amber-800">
                Feature contribution shows association with the model output. It does not prove that changing one metric will cause the predicted outcome.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-700">
                <ShieldAlert className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg">Potential greenwashing indicators</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Material inconsistencies are flagged for investigation—not treated as proven misconduct.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 lg:grid-cols-2">
            {demoOverview.flags.map((flag) => (
              <div key={flag.claim} className="rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between">
                  <Badge variant={flag.severity === "High" ? "destructive" : "secondary"}>
                    <AlertTriangle className="mr-1 size-3" /> {flag.severity} review
                  </Badge>
                  <span className="text-xs text-muted-foreground">Cross-source check</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Reported claim</p>
                    <p className="mt-2 text-sm leading-6">{flag.claim}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Independent evidence</p>
                    <p className="mt-2 text-sm leading-6">{flag.evidence}</p>
                  </div>
                </div>
                <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">{flag.source}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
