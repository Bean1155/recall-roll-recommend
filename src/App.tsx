
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BitesPage from "./pages/BitesPage";
import BlockbustersPage from "./pages/BlockbustersPage";
import CreateCardPage from "./pages/CreateCardPage";
import EditCardPage from "./pages/EditCardPage";
import RecommendPage from "./pages/RecommendPage";
import CollectionsPage from "./pages/CollectionsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import RewardsPage from "./pages/RewardsPage";
import BrowsePage from "./pages/BrowsePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bites" element={<BitesPage />} />
            <Route path="/blockbusters" element={<BlockbustersPage />} />
            <Route path="/create/:type" element={<CreateCardPage />} />
            <Route path="/edit/:id" element={<EditCardPage />} />
            <Route path="/recommend/:id" element={<RecommendPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
