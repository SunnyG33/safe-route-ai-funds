import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmergencyHero from "@/components/EmergencyHero";
import EmergencyDashboard from "@/components/EmergencyDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"hero" | "dashboard">("hero");

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button 
          variant={currentView === "hero" ? "default" : "outline"}
          onClick={() => setCurrentView("hero")}
          size="sm"
        >
          Hero Mode
        </Button>
        <Button 
          variant={currentView === "dashboard" ? "default" : "outline"}
          onClick={() => setCurrentView("dashboard")}
          size="sm"
        >
          Dashboard
        </Button>
      </div>

      {/* Main Content */}
      {currentView === "hero" ? <EmergencyHero /> : <EmergencyDashboard />}
    </div>
  );
};

export default Index;
