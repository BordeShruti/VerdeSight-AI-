import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Play, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { metricGroups } from "@/lib/esg-data";

type MetricGroupName = keyof typeof metricGroups;

export default function DataPage() {
  const { data: session } = authClient.useSession();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const entries = Object.values(metricGroups).flat().map((metric) => [metric.key, metric.value]);
    return Object.fromEntries(entries);
  });
  const [analyzing, setAnalyzing] = useState(false);
  const reviewCount = useMemo(
    () => Object.values(metricGroups).flat().filter((metric) => metric.status === "Review").length,
    []
  );

  const analyze = async () => {
    if (!session?.user) {
      toast.success("Demo analysis refreshed", {
        description: "Illustrative scores and explanations are available in the Analysis workspace."
      });
      return;
    }
    setAnalyzing(true);
    try {
      const response = await apiFetch("/esg/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportingPeriod: "Q2 2026",
          carbonChange: Number(values.carbonChange),
          renewableEnergy: Number(values.renewableEnergy),
          employeeTurnover: Number(values.turnover),
          workplaceIncidents: Number(values.accidents),
          boardDiversity: Number(values.boardDiversity),
          independentDirectors: Number(values.independent)
        })
      });
      if (!response.ok) throw new Error("Analysis could not be completed");
      toast.success("Assessment recalculated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis could not be completed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Q2 2026 metric set</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter or verify quantitative metrics before risk analysis.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-emerald-700">
                  15 valid
                </Badge>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  {reviewCount} review
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="Environmental">
              <TabsList className="grid w-full grid-cols-3">
                {Object.keys(metricGroups).map((group) => (
                  <TabsTrigger key={group} value={group}>{group}</TabsTrigger>
                ))}
              </TabsList>
              {(Object.keys(metricGroups) as MetricGroupName[]).map((group) => (
                <TabsContent key={group} value={group} className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {metricGroups[group].map((metric) => (
                      <div key={metric.key} className="rounded-xl border border-border p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <Label htmlFor={metric.key} className="leading-5">{metric.label}</Label>
                          {metric.status === "Valid" ? (
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id={metric.key}
                            type="number"
                            value={values[metric.key]}
                            onChange={(event) => setValues((current) => ({ ...current, [metric.key]: event.target.value }))}
                          />
                          <span className="min-w-16 text-right text-xs text-muted-foreground">{metric.unit}</span>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {metric.status === "Review"
                            ? "Outside the expected change range; confirm source and unit."
                            : "Format and expected-range checks passed."}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">
                Prototype validation checks range, format, missing values, and period consistency.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="mr-2 size-4" /> Save draft
                </Button>
                <Button onClick={analyze} disabled={analyzing}>
                  {analyzing ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Play className="mr-2 size-4" />}
                  Run analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Validation summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Missing values", value: "0", state: "Pass" },
                { label: "Duplicate records", value: "0", state: "Pass" },
                { label: "Range exceptions", value: "3", state: "Review" },
                { label: "Source coverage", value: "84%", state: "Pass" }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.state}</p>
                  </div>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#12382c] text-white">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">Important</p>
              <p className="mt-3 text-sm leading-6 text-white/75">
                The prototype scoring formula is transparent and demonstrative. It is not presented as a trained ML model or validated commercial rating.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
