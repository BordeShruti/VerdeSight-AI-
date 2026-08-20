import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck2,
  Leaf,
  ShieldCheck,
  Users
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { demoOverview } from "@/lib/esg-data";

const pillars = [
  {
    label: "Environmental",
    score: demoOverview.assessment.environmentalScore,
    delta: "-5",
    icon: Leaf,
    tone: "text-emerald-700 bg-emerald-50"
  },
  {
    label: "Social",
    score: demoOverview.assessment.socialScore,
    delta: "+0",
    icon: Users,
    tone: "text-sky-700 bg-sky-50"
  },
  {
    label: "Governance",
    score: demoOverview.assessment.governanceScore,
    delta: "+0",
    icon: ShieldCheck,
    tone: "text-indigo-700 bg-indigo-50"
  }
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden border-0 bg-[#12382c] text-white shadow-lg shadow-emerald-950/10">
          <CardContent className="relative p-6 sm:p-8">
            <div className="absolute -right-24 -top-24 size-72 rounded-full border border-white/10" />
            <div className="absolute -right-5 -top-5 size-36 rounded-full border border-emerald-300/20" />
            <div className="relative grid gap-7 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="relative grid size-40 place-items-center rounded-full border-[12px] border-white/10">
                <div className="absolute inset-[-12px] rounded-full border-[12px] border-emerald-400 border-l-transparent border-b-transparent rotate-45" />
                <div className="text-center">
                  <span className="block text-5xl font-semibold tracking-[-0.05em]">
                    {demoOverview.assessment.overallScore}
                  </span>
                  <span className="text-sm text-white/65">out of 100</span>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-amber-300/25 bg-amber-300/15 text-amber-100">
                    Medium risk
                  </Badge>
                  <span className="text-sm text-white/60">Q2 2026 assessment</span>
                </div>
                <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Performance is resilient, but environmental evidence needs attention.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  Your overall score remains above the internal watch threshold. The main
                  downside risk is the divergence between reported emissions reductions and
                  comparable regulatory evidence.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild className="bg-white text-[#12382c] hover:bg-emerald-50">
                    <Link to="/analysis">
                      Review risk drivers <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                    <Link to="/assistant">Ask ESG AI</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Evidence quality</CardTitle>
              <Badge variant="outline" className="text-emerald-700">Audit trail active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "Data completeness", value: 92 },
              { label: "Independent-source coverage", value: 84 },
              { label: "Validation pass rate", value: 89 }
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 size-5 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-amber-950">2 claims need review</p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Cross-source checks detected material evidence differences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <span className={`grid size-10 place-items-center rounded-xl ${pillar.tone}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className={pillar.delta.startsWith("-") ? "text-sm font-medium text-rose-600" : "text-sm font-medium text-muted-foreground"}>
                    {pillar.delta} pts
                  </span>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">{pillar.label}</p>
                <div className="mt-1 flex items-end gap-2">
                  <strong className="text-4xl tracking-[-0.04em]">{pillar.score}</strong>
                  <span className="pb-1 text-sm text-muted-foreground">/100</span>
                </div>
                <Progress value={pillar.score} className="mt-4 h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">Performance trend</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Quarterly pillar movement and overall ESG score
              </p>
            </div>
            <Badge variant="secondary">4 periods</Badge>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoOverview.trend} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#dfe7e2" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "#66736d", fontSize: 12 }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: "#66736d", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dfe7e2" }} />
                <Legend iconType="circle" iconSize={7} />
                <Line type="monotone" dataKey="overall" stroke="#12382c" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="environmental" stroke="#2f8f68" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="social" stroke="#2f83a7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="governance" stroke="#5969b0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Priority alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoOverview.alerts.map((alert) => (
              <div key={alert.title} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={alert.severity === "High" ? "destructive" : "secondary"}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.date}</span>
                </div>
                <p className="mt-3 text-sm font-semibold">{alert.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{alert.detail}</p>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/analysis">Open analysis</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        {[
          {
            icon: Database,
            label: "Inputs processed",
            value: "42",
            detail: "metrics from 5 sources"
          },
          {
            icon: FileCheck2,
            label: "Claims cross-checked",
            value: "31",
            detail: "against independent evidence"
          },
          {
            icon: CheckCircle2,
            label: "Recommended actions",
            value: "8",
            detail: "3 marked high priority"
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
