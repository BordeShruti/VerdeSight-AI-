import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AuthPage from "./pages/auth/Index";
import Index from "./pages/home/Index";
import NotFound from "./pages/not-found/Index";
import DashboardPage from "./pages/dashboard/Index";
import CompanyPage from "./pages/company/Index";
import DataPage from "./pages/data/Index";
import DocumentsPage from "./pages/documents/Index";
import AnalysisPage from "./pages/analysis/Index";
import RecommendationsPage from "./pages/recommendations/Index";
import ReportsPage from "./pages/reports/Index";
import AssistantPage from "./pages/assistant/Index";

const queryClient = new QueryClient();

const routeMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "VerdeSight AI | Explainable ESG Decision Support",
    description:
      "Multi-source ESG assessment, explainable risk analysis, evidence checks, recommendations, and source-grounded AI."
  },
  "/dashboard": {
    title: "ESG Performance Overview | VerdeSight AI",
    description: "Review ESG scores, trends, evidence quality, alerts, and priority actions."
  },
  "/company": {
    title: "Company Profile | VerdeSight AI",
    description: "Configure sector, reporting period, and ESG reporting alignment."
  },
  "/data": {
    title: "ESG Data Collection | VerdeSight AI",
    description: "Enter and validate Environmental, Social, and Governance metrics."
  },
  "/documents": {
    title: "ESG Evidence Library | VerdeSight AI",
    description: "Upload reports, filings, spreadsheets, and other ESG evidence."
  },
  "/analysis": {
    title: "ESG Risk & Explainability | VerdeSight AI",
    description: "Inspect risk drivers, explanation agreement, and potential disclosure inconsistencies."
  },
  "/recommendations": {
    title: "ESG Recommendations | VerdeSight AI",
    description: "Prioritize sector-specific actions linked to identified ESG risk drivers."
  },
  "/reports": {
    title: "ESG Assessment Reports | VerdeSight AI",
    description: "Prepare an audit-ready ESG assessment summary with sources and recommendations."
  },
  "/assistant": {
    title: "ESG Evidence Assistant | VerdeSight AI",
    description: "Ask natural-language questions grounded in the current ESG assessment evidence."
  }
};

function RouteMetadata() {
  useEffect(() => {
    const metadata = routeMetadata[window.location.pathname] ?? routeMetadata["/"];
    document.title = metadata.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", metadata.description);
  });
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <RouteMetadata />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
