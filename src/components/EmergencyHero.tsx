import { AlertTriangle, Phone, MapPin, Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EmergencyHero = () => {
  const emergencyTypes = [
    { name: "Wildfire", status: "active", count: 3 },
    { name: "Flood", status: "watch", count: 1 },
    { name: "Severe Weather", status: "warning", count: 2 },
  ];

  const quickActions = [
    { icon: Phone, label: "Emergency Call", action: "911" },
    { icon: MapPin, label: "Safe Route", action: "route" },
    { icon: Users, label: "Community Hub", action: "community" },
    { icon: Wifi, label: "Offline Mode", action: "offline" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-700 mb-2">SafeRoute AI</h1>
          <p className="text-lg text-red-600">Emergency Guidance & Community Safety</p>
        </div>

        {/* Emergency Status Bar */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-700">Active Alerts in Your Area</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {emergencyTypes.map((emergency) => (
                <Badge 
                  key={emergency.name}
                  variant={emergency.status === "active" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {emergency.name} ({emergency.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Card key={action.label} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <action.icon className="h-8 w-8 mx-auto mb-3 text-red-600" />
                <p className="font-medium text-sm">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Mode Toggle */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Hero Mode</h3>
                <p className="text-orange-600 text-sm">
                  Help others in your community during emergencies
                </p>
              </div>
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                Activate Hero Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Location Status */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium">Location: Vancouver, BC</span>
              <Badge variant="outline" className="border-green-300 text-green-700">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyHero;