import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PortIn from "./pages/PortIn";
import PortOut from "./pages/PortOut";
import Snapback from "./pages/Snapback";
import Reasons from "./pages/Reasons";
import Complaint from "./pages/Complaint";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-info/5">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Dashboard />
              </main>
            </div>
          } />
          <Route path="/port-in" element={
            <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <PortIn />
              </main>
            </div>
          } />
          <Route path="/port-out" element={
            <div className="min-h-screen bg-gradient-to-br from-info/5 via-background to-warning/5">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <PortOut />
              </main>
            </div>
          } />
          <Route path="/snapback" element={
            <div className="min-h-screen bg-gradient-to-br from-warning/5 via-background to-destructive/5">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Snapback />
              </main>
            </div>
          } />
          <Route path="/reasons" element={
            <div className="min-h-screen bg-gradient-to-br from-purple/5 via-background to-accent/5">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Reasons />
              </main>
            </div>
          } />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
