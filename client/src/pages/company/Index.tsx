import { FormEvent, useState } from "react";
import { Building2, CheckCircle2, Info, Save } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/esg/AppShell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { demoOverview } from "@/lib/esg-data";

export default function CompanyPage() {
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState({ ...demoOverview.company });
  const [saving, setSaving] = useState(false);

  const update = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user) {
      toast.success("Demo profile updated in this view");
      return;
    }
    setSaving(true);
    try {
      const response = await apiFetch("/esg/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Profile update failed");
      toast.success("Company profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Building2 className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg">Organization details</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Used to select material topics, benchmark groups, and sector-specific recommendations.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company-name">Company name</Label>
                <Input id="company-name" value={form.name} onChange={(event) => update("name", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={form.industry} onValueChange={(value) => update("industry", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Industrial Manufacturing">Industrial Manufacturing</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input id="sector" value={form.sector} onChange={(event) => update("sector", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Company size</Label>
                <Select value={form.size} onValueChange={(value) => update("size", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small enterprise">Small enterprise</SelectItem>
                    <SelectItem value="Medium enterprise">Medium enterprise</SelectItem>
                    <SelectItem value="Large enterprise">Large enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={(event) => update("country", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Number of employees</Label>
                <Input
                  id="employees"
                  type="number"
                  min={0}
                  value={form.employeeCount}
                  onChange={(event) => update("employeeCount", Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Reporting year</Label>
                <Input
                  id="year"
                  type="number"
                  min={2000}
                  max={2100}
                  value={form.reportingYear}
                  onChange={(event) => update("reportingYear", Number(event.target.value))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Reporting alignment</Label>
                <Select value={form.reportingStandard} onValueChange={(value) => update("reportingStandard", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GRI + IFRS S1/S2">GRI + IFRS S1/S2</SelectItem>
                    <SelectItem value="GRI">GRI Standards</SelectItem>
                    <SelectItem value="IFRS S1/S2">IFRS S1 and IFRS S2</SelectItem>
                    <SelectItem value="SASB">SASB industry metrics</SelectItem>
                    <SelectItem value="Custom">Custom internal framework</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-5 sm:col-span-2">
                <p className="text-xs text-muted-foreground">
                  {session?.user ? "Changes will be saved to your company workspace." : "Demo mode: sign in to save changes."}
                </p>
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 size-4" />
                  {saving ? "Saving…" : "Save profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Company identity",
                "Sector classification",
                "Reporting period",
                "Standards alignment"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="rounded-xl bg-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Materiality lens</p>
                <p className="mt-2 text-sm font-semibold">Industrial manufacturing</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Emissions, energy, worker safety, supply-chain practices, and board oversight receive higher attention.
                </p>
              </div>
            </CardContent>
          </Card>
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Standards are not interchangeable</AlertTitle>
            <AlertDescription>
              The application maps impact reporting and investor-focused disclosure separately, then presents a combined view.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </AppShell>
  );
}
