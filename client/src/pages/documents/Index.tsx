import { ChangeEvent, useRef, useState } from "react";
import { CheckCircle2, FileSpreadsheet, FileText, Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/esg/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { authClient } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

const initialDocuments = [
  { name: "FY2026 Sustainability Report.pdf", type: "Sustainability report", claims: 146, reliability: 78, status: "Ready" },
  { name: "Q2 Regulatory Emissions Filing.pdf", type: "Regulatory filing", claims: 38, reliability: 94, status: "Ready" },
  { name: "ESG Metrics Q2 2026.xlsx", type: "Structured data", claims: 42, reliability: 88, status: "Ready" },
  { name: "Supplier Assessment Extract.csv", type: "Structured data", claims: 19, reliability: 82, status: "Ready" }
];

export default function DocumentsPage() {
  const { data: session } = authClient.useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploading, setUploading] = useState(false);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (session?.user) {
        const form = new FormData();
        form.set("file", file);
        const uploadResponse = await apiFetch("/storage", { method: "POST", body: form });
        const uploadPayload = (await uploadResponse.json()) as {
          ok?: boolean;
          data?: { file?: { id?: string } };
        };
        if (!uploadResponse.ok || !uploadPayload.data?.file?.id) throw new Error("File upload failed");
        const registerResponse = await apiFetch("/esg/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storageFileId: uploadPayload.data.file.id,
            fileName: file.name,
            fileType: file.type || "application/octet-stream"
          })
        });
        if (!registerResponse.ok) throw new Error("Document registration failed");
      }
      setDocuments((current) => [
        { name: file.name, type: "Uploaded source", claims: 14, reliability: 78, status: "Ready" },
        ...current
      ]);
      toast.success(session?.user ? "Document uploaded and registered" : "Demo document processed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {uploading ? <Loader2 className="size-9 animate-spin text-emerald-700" /> : <UploadCloud className="size-9 text-emerald-700" />}
                <p className="mt-4 font-semibold">{uploading ? "Uploading and registering…" : "Upload ESG evidence"}</p>
                <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                  Sustainability reports, annual reports, regulatory filings, PDF, CSV, and Excel.
                </p>
                <Badge variant="outline" className="mt-4 bg-white">
                  {session?.user ? "Secure workspace upload" : "Demo processing mode"}
                </Badge>
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls,.doc,.docx"
                onChange={upload}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Evidence library</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{documents.length} sources available for cross-checking</p>
              </div>
              <Badge variant="secondary">{documents.reduce((sum, item) => sum + item.claims, 0)} claims</Badge>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {documents.map((document) => {
                  const Icon = document.name.endsWith(".xlsx") || document.name.endsWith(".csv") ? FileSpreadsheet : FileText;
                  return (
                    <div key={document.name} className="grid gap-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                      <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{document.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{document.type} · {document.claims} extracted claims</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-28">
                          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                            <span>Reliability</span><strong>{document.reliability}%</strong>
                          </div>
                          <Progress value={document.reliability} className="h-1.5" />
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          <CheckCircle2 className="mr-1 size-3" /> {document.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Processing pipeline</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Text extraction", detail: "PDF and document content", value: 100 },
                { label: "ESG classification", detail: "E / S / G claims and metrics", value: 100 },
                { label: "Source linking", detail: "Provenance and timestamps", value: 100 },
                { label: "Consistency checks", detail: "Cross-source comparison", value: 86 }
              ].map((step, index) => (
                <div key={step.label} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm"><strong>{step.label}</strong><span>{step.value}%</span></div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                    <Progress value={step.value} className="mt-2 h-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-5">
              <ShieldCheck className="size-6 text-emerald-700" />
              <p className="mt-4 text-sm font-semibold text-emerald-950">Source-grounded by design</p>
              <p className="mt-2 text-xs leading-5 text-emerald-800">
                The AI assistant receives curated excerpts and assessment facts instead of unrestricted access to unsupported claims.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
