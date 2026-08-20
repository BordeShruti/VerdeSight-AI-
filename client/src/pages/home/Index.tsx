import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  CircleGauge,
  DatabaseZap,
  FileSearch,
  Fingerprint,
  Leaf,
  LineChart,
  SearchCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const workflow = [
  { step: "01", title: "Collect", detail: "Metrics, reports, filings and independent evidence", icon: DatabaseZap },
  { step: "02", title: "Validate", detail: "Check quality, provenance and disclosure consistency", icon: SearchCheck },
  { step: "03", title: "Assess", detail: "Predict risk and score Environmental, Social and Governance", icon: CircleGauge },
  { step: "04", title: "Explain", detail: "Show the factors driving each result with SHAP and LIME", icon: Fingerprint },
  { step: "05", title: "Act", detail: "Prioritize sector-specific improvement actions", icon: Sparkles }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f3] text-[#102b22]">
      <header className="relative z-20 border-b border-[#dce5df] bg-[#f7f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#12382c] text-white">
              <Leaf className="size-5" />
            </span>
            <span>
              <strong className="block text-[15px] tracking-tight">VerdeSight AI</strong>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#62756d]">
                ESG Intelligence
              </span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm font-medium text-[#4f655c] md:flex">
            <a href="#framework" className="transition hover:text-[#12382c]">Framework</a>
            <a href="#explainability" className="transition hover:text-[#12382c]">Explainability</a>
            <a href="#standards" className="transition hover:text-[#12382c]">Standards</a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-8">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full bg-[#12382c] px-5 hover:bg-[#1b4c3d]">
              <Link to="/dashboard">
                Explore demo <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="absolute left-[58%] top-[-180px] size-[620px] rounded-full border border-[#bbd4c7]" />
          <div className="absolute left-[65%] top-[-70px] size-[420px] rounded-full border border-[#d1e0d8]" />
          <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
            <div className="relative z-10">
              <Badge className="mb-6 border-[#bad7c7] bg-[#e8f4ed] text-[#1f654a] hover:bg-[#e8f4ed]">
                Explainable AI · Multi-source validation · Grounded answers
              </Badge>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Turn ESG evidence into decisions you can explain.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#566b62]">
                Analyze sustainability performance, detect disclosure inconsistencies,
                understand the factors behind ESG risk, and convert findings into
                practical, standards-aligned action.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-full bg-[#12382c] px-7 hover:bg-[#1b4c3d]">
                  <Link to="/dashboard">
                    Open decision dashboard <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[#c8d6cf] bg-white/60 px-7">
                  <Link to="/auth">Create company account</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#53675f]">
                {["Transparent risk drivers", "Evidence-linked alerts", "GRI & IFRS-aligned outputs"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-[#dbece3] text-[#216148]">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 lg:pl-5">
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-2xl shadow-[#204d3b]/15 backdrop-blur">
                <div className="rounded-[22px] border border-[#dfe8e3] bg-[#fbfcf9] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#678078]">Current assessment</p>
                      <p className="mt-1 font-display text-xl font-semibold">Northstar Manufacturing</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium risk</Badge>
                  </div>
                  <div className="mt-6 grid grid-cols-[124px_1fr] gap-5">
                    <div className="grid aspect-square place-items-center rounded-full border-[10px] border-[#dbe9e1] text-center">
                      <div>
                        <strong className="block text-4xl tracking-[-0.06em]">82</strong>
                        <span className="text-xs text-[#71837b]">ESG score</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Environmental", value: 74, color: "bg-[#2f8f68]" },
                        { label: "Social", value: 86, color: "bg-[#3e85a4]" },
                        { label: "Governance", value: 88, color: "bg-[#5969a8]" }
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1.5 flex justify-between text-xs">
                            <span className="text-[#657870]">{item.label}</span>
                            <strong>{item.value}</strong>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#e9eeeb]">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <FileSearch className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.12em]">Evidence flag</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-amber-950">Emissions claim needs review</p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">Company report and regulatory filing diverge.</p>
                    </div>
                    <div className="rounded-xl bg-[#12382c] p-4 text-white">
                      <div className="flex items-center gap-2 text-emerald-200">
                        <Bot className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.12em]">Next action</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">Verify the facility baseline</p>
                      <p className="mt-1 text-xs leading-5 text-white/65">Before publishing the reduction claim.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="framework" className="border-y border-[#dfe7e2] bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2f7d5d]">One auditable workflow</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                From fragmented disclosures to a defensible action plan.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#5a6e65]">
                The system keeps data quality, risk prediction, explanation, recommendations,
                and natural-language interaction connected to the same evidence trail.
              </p>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#dfe7e2] bg-[#dfe7e2] lg:grid-cols-5">
              {workflow.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="bg-[#fbfcf9] p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[0.15em] text-[#82928b]">{item.step}</span>
                      <Icon className="size-5 text-[#2b7659]" />
                    </div>
                    <h3 className="mt-12 font-display text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#64776f]">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="explainability" className="bg-[#12382c] py-24 text-white">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Explainability built in</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                A score is only useful when people understand what moved it.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/65">
                SHAP-style global importance, LIME-style local explanations, agreement
                checks, and expert review are presented as complementary evidence—not as
                automatic proof of causality.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Positive and negative risk contributions",
                  "Explanation agreement and confidence indicators",
                  "Plain-language reasoning for non-technical stakeholders",
                  "Direct link from risk driver to recommended action"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="grid size-7 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                      <Check className="size-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/45">Local explanation</p>
                  <h3 className="mt-1 text-lg font-semibold">Q2 2026 overall risk</h3>
                </div>
                <Badge className="bg-white/10 text-white hover:bg-white/10">SHAP + LIME</Badge>
              </div>
              <div className="mt-8 space-y-6">
                {[
                  { label: "Scope 1 & 2 emissions", value: 84, score: "−12", tone: "bg-rose-400" },
                  { label: "Renewable energy share", value: 58, score: "+8", tone: "bg-emerald-400" },
                  { label: "Employee turnover", value: 42, score: "−6", tone: "bg-rose-400" },
                  { label: "Independent directors", value: 36, score: "+5", tone: "bg-emerald-400" }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/70">{item.label}</span>
                      <strong className={item.score.startsWith("+") ? "text-emerald-300" : "text-rose-300"}>{item.score}</strong>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between rounded-xl border border-white/10 bg-black/10 p-4">
                <div>
                  <p className="text-xs text-white/45">Explanation agreement</p>
                  <p className="mt-1 text-sm font-semibold">SHAP–LIME consistency</p>
                </div>
                <strong className="text-3xl tracking-[-0.05em]">0.85</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="standards" className="bg-[#edf2ed] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-3xl bg-white p-8 sm:p-10">
                <ShieldCheck className="size-9 text-[#287053]" />
                <h2 className="mt-8 font-display text-4xl font-semibold tracking-[-0.04em]">
                  Standards-aligned, not standards-confused.
                </h2>
                <p className="mt-5 leading-7 text-[#60736a]">
                  Outputs distinguish impact-focused reporting from investor-focused
                  disclosure and map evidence to the relevant framework instead of treating
                  every standard as interchangeable.
                </p>
                <Button asChild className="mt-8 rounded-full bg-[#12382c]">
                  <Link to="/reports">View report workspace <ChevronRight className="ml-2 size-4" /></Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "GRI", detail: "Organizational impacts on the economy, environment and people", icon: Leaf },
                  { label: "IFRS S1 / S2", detail: "Investor-focused sustainability and climate-related financial disclosures", icon: LineChart },
                  { label: "SASB", detail: "Industry-based topics and metrics maintained within the IFRS Foundation", icon: FileSearch },
                  { label: "Evidence trail", detail: "Source, timestamp, reliability and validation state logged for auditability", icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-[#d8e2dc] bg-[#f9fbf8] p-6">
                      <span className="grid size-10 place-items-center rounded-xl bg-[#dfece5] text-[#25674d]">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-8 font-display text-2xl font-semibold">{item.label}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#63766d]">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8f3] py-24">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2b7558]">See the complete workflow</p>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Make the next ESG conversation evidence-led.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#60736a]">
              Explore the interactive prototype, review risk drivers, test the recommendation
              workflow, and sign in to use the live source-grounded assistant.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-[#12382c] px-7">
                <Link to="/dashboard">Explore the dashboard <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dfe7e2] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#687a72] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 font-semibold text-[#173b2f]">
            <Leaf className="size-4" /> VerdeSight AI
          </div>
          <p>Explainable ESG decision support · Research prototype · 2026</p>
        </div>
      </footer>
    </div>
  );
}
