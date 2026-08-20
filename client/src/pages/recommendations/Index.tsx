import { useState } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, Circle, Target } from "lucide-react";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoOverview } from "@/lib/esg-data";

export default function RecommendationsPage() {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggle = (id: string) => {
    setCompleted((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "High priority", value: "3", detail: "Start within 30 days" },
          { label: "In progress", value: String(completed.length), detail: "Owner action recorded" },
          { label: "Standards mapped", value: "8/8", detail: "GRI or IFRS reference" }
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-muted-foreground">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold">{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="space-y-4">
          {demoOverview.recommendations.map((recommendation, index) => {
            const isComplete = completed.includes(recommendation.id);
            return (
              <Card key={recommendation.id} className={isComplete ? "border-emerald-200 bg-emerald-50/30" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => toggle(recommendation.id)}
                      className="mt-0.5 shrink-0 text-muted-foreground transition hover:text-emerald-700"
                      aria-label={isComplete ? "Mark recommendation as pending" : "Mark recommendation as in progress"}
                    >
                      {isComplete ? <CheckCircle2 className="size-7 text-emerald-600" /> : <Circle className="size-7" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                        <Badge variant={recommendation.priority === "High" ? "destructive" : "secondary"}>
                          {recommendation.priority} priority
                        </Badge>
                        <Badge variant="outline">{recommendation.pillar}</Badge>
                      </div>
                      <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">{recommendation.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{recommendation.rationale}</p>
                      <div className="mt-5 rounded-xl bg-secondary p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Recommended action</p>
                        <p className="mt-2 text-sm leading-6">{recommendation.action}</p>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2"><CalendarClock className="size-4" /> {recommendation.timeframe}</span>
                        <span className="flex items-center gap-2"><Target className="size-4" /> {recommendation.standard}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">How actions are selected</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {[
                { step: "01", label: "Identify risk driver", detail: "Use feature contribution and trend evidence." },
                { step: "02", label: "Check evidence quality", detail: "Raise verification before action when claims diverge." },
                { step: "03", label: "Apply sector context", detail: "Prioritize material issues for the company industry." },
                { step: "04", label: "Map to standards", detail: "Link action and reporting evidence to relevant topics." }
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <span className="text-xs font-semibold text-emerald-700">{item.step}</span>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#12382c] text-white">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-emerald-200">Next best action</p>
              <p className="mt-3 font-display text-xl font-semibold">Verify the emissions baseline first.</p>
              <p className="mt-2 text-xs leading-5 text-white/65">
                This reduces the chance of optimizing against an inconsistent starting point.
              </p>
              <Button variant="outline" className="mt-5 w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                Open evidence flag <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
