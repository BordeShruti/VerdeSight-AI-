import type { ReactNode } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bot,
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  ClipboardCheck,
  Database,
  FileBarChart,
  FileText,
  Gauge,
  Leaf,
  Menu,
  PanelLeftClose,
  Sparkles
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

const navigation = [
  { to: "/dashboard", label: "Overview", icon: Gauge },
  { to: "/company", label: "Company profile", icon: Building2 },
  { to: "/data", label: "ESG data", icon: Database },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/analysis", label: "Risk & explainability", icon: ChartNoAxesCombined },
  { to: "/recommendations", label: "Recommendations", icon: ClipboardCheck },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/assistant", label: "Ask ESG AI", icon: Bot }
];

const titles: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Decision workspace", title: "ESG performance overview" },
  "/company": { eyebrow: "Organization settings", title: "Company profile" },
  "/data": { eyebrow: "Data acquisition", title: "ESG metric collection" },
  "/documents": { eyebrow: "Multi-source evidence", title: "Document processing" },
  "/analysis": { eyebrow: "Model transparency", title: "Risk & explainability" },
  "/recommendations": { eyebrow: "Action planning", title: "Priority recommendations" },
  "/reports": { eyebrow: "Audit-ready output", title: "Assessment reports" },
  "/assistant": { eyebrow: "Source-grounded interaction", title: "ESG evidence assistant" }
};

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-5 py-6">
        <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Leaf className="size-5" />
        </span>
        <span>
          <strong className="block text-[15px] tracking-tight">VerdeSight AI</strong>
          <span className="block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            ESG Intelligence
          </span>
        </span>
      </Link>

      <div className="mx-4 mb-5 rounded-xl border border-sidebar-border bg-white/60 p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          Demo assessment
        </div>
        <p className="mt-1 truncate text-sm font-semibold">Northstar Manufacturing</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Q2 2026 · 87% confidence</p>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Application navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                ].join(" ")
              }
            >
              <Icon className="size-[18px]" />
              <span>{item.label}</span>
              {item.to === "/assistant" && (
                <Sparkles className="ml-auto size-3.5 opacity-70" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="m-4 rounded-xl bg-[#12382c] p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
          Research prototype
        </p>
        <p className="mt-2 text-sm leading-5 text-white/80">
          Scores are illustrative until the model is empirically trained and validated.
        </p>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const page = titles[location.pathname] ?? titles["/dashboard"];
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 border-b border-border/80 bg-background/92 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {page.eyebrow}
              </p>
              <h1 className="truncate font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {page.title}
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="relative grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
                aria-label="View alerts"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-amber-500 ring-2 ring-card" />
              </button>
              {session?.user ? (
                <button className="hidden items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-2 pr-3 text-sm sm:flex">
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {session.user.name?.slice(0, 1).toUpperCase() ?? "U"}
                  </span>
                  <span className="max-w-28 truncate">{session.user.name}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              ) : (
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/auth">Sign in for live AI</Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
