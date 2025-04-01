
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BitesPage from "./pages/BitesPage";
import BlockbustersPage from "./pages/BlockbustersPage";
import CreateCardPage from "./pages/CreateCardPage";
import RecommendPage from "./pages/RecommendPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bites" element={<BitesPage />} />
          <Route path="/blockbusters" element={<BlockbustersPage />} />
          <Route path="/create/:type" element={<CreateCardPage />} />
          <Route path="/recommend/:id" element={<RecommendPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
