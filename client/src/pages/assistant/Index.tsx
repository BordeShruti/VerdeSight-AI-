import { FormEvent, useState } from "react";
import { Bot, FileSearch, LockKeyhole, Send, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { demoOverview } from "@/lib/esg-data";

type Message = { role: "assistant" | "user"; content: string };

const quickQuestions = [
  "Why did the Environmental score decrease?",
  "Which disclosure needs verification first?",
  "What should the company do in the next 90 days?"
];

export default function AssistantPage() {
  const { data: session } = authClient.useSession();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I can explain the current ESG assessment using the verified evidence library. I will cite source labels such as [A1] and say when the available evidence is insufficient."
    }
  ]);

  const ask = async (event?: FormEvent<HTMLFormElement>, preset?: string) => {
    event?.preventDefault();
    const text = (preset ?? question).trim();
    if (!text) return;
    setMessages((current) => [...current, { role: "user", content: text }]);
    setQuestion("");

    if (!session?.user) {
      const demoReply = text.toLowerCase().includes("environment")
        ? "The Environmental score decreased mainly because comparable-facility emissions increased while the company report claims a reduction. This inconsistency should be verified before the claim is relied upon [A1][A2]. Renewable electricity remains a positive factor at 38% [A3]."
        : "The highest-priority action is to verify the facility-level emissions baseline, because the current company disclosure and regulatory evidence diverge [A1][A2]. After that, prioritize renewable-electricity procurement and a site-level reduction plan [A3].";
      setMessages((current) => [...current, { role: "assistant", content: demoReply }]);
      toast.info("Demo answer shown. Sign in to use live Platform AI.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/esg-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const payload = (await response.json()) as { ok?: boolean; data?: { reply?: string } };
      if (!response.ok || !payload.data?.reply) throw new Error("The ESG assistant could not answer");
      setMessages((current) => [...current, { role: "assistant", content: payload.data?.reply ?? "" }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The ESG assistant could not answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card className="flex min-h-[680px] flex-col overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Bot className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-lg">ESG evidence assistant</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Grounded in 3 curated sources and current assessment data
                  </p>
                </div>
              </div>
              <Badge className={session?.user ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>
                {session?.user ? <Sparkles className="mr-1 size-3" /> : <LockKeyhole className="mr-1 size-3" />}
                {session?.user ? "Live Platform AI" : "Demo answer mode"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-0">
            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "assistant" && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="size-4" />
                    </span>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card">
                      <User className="size-4" />
                    </span>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Bot className="size-4" /></span>
                  <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Reviewing assessment evidence…</div>
                </div>
              )}
            </div>
            <div className="border-t border-border p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickQuestions.map((item) => (
                  <button key={item} type="button" onClick={() => void ask(undefined, item)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs transition hover:bg-secondary">
                    {item}
                  </button>
                ))}
              </div>
              <form onSubmit={(event) => void ask(event)} className="flex gap-2">
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask about a score, risk driver, disclosure, source, or recommendation…"
                  className="min-h-12 resize-none"
                />
                <Button type="submit" size="icon" className="size-12 shrink-0" disabled={loading || !question.trim()} aria-label="Send question">
                  <Send className="size-4" />
                </Button>
              </form>
              {!session?.user && (
                <p className="mt-3 text-xs text-muted-foreground">
                  <Link to="/auth" className="font-semibold text-primary underline underline-offset-4">Sign in</Link> to send questions to live Skywork Platform AI. Demo answers are deterministic and source-labeled.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Grounding sources</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {demoOverview.sources.map((source) => (
                <div key={source.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary"><FileSearch className="size-4" /></span>
                    <Badge variant="outline">[{source.id}]</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{source.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{source.type}</p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{source.excerpt}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-sky-200 bg-sky-50">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-sky-950">Answer policy</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-sky-900">
                <li>• Use only supplied assessment context.</li>
                <li>• Cite the supporting source label.</li>
                <li>• Separate fact, model output, and recommendation.</li>
                <li>• Say when evidence is insufficient.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
