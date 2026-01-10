import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoanProvider } from "@/contexts/LoanContext";

// Pages
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import ApplyLoanType from "./pages/ApplyLoanType";
import ApplyDocuments from "./pages/ApplyDocuments";
import ApplyForm from "./pages/ApplyForm";
import ApplySubmitted from "./pages/ApplySubmitted";
import Application from "./pages/Application";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LoanProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/apply/loan-type" element={<ApplyLoanType />} />
            <Route path="/apply/documents" element={<ApplyDocuments />} />
            <Route path="/apply/form" element={<ApplyForm />} />
            <Route path="/apply/submitted" element={<ApplySubmitted />} />
            <Route path="/application" element={<Application />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LoanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
