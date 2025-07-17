import { AlertTriangle, Users, Route, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EmergencyDashboard = () => {
  const activeIncidents = [
    {
      id: 1,
      type: "Wildfire",
      location: "Kelowna Region",
      severity: "High",
      time: "2 hours ago",
      affected: 1200,
    },
    {
      id: 2,
      type: "Flooding",
      location: "Fraser Valley",
      severity: "Medium",
      time: "45 min ago",
      affected: 800,
    },
  ];

  const communityStats = {
    activeHeroes: 23,
    peopleHelped: 156,
    safeRoutes: 12,
    updatesShared: 89,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Emergency Dashboard</h2>
        <p className="text-muted-foreground">Real-time emergency status and community response</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{communityStats.activeHeroes}</p>
            <p className="text-sm text-muted-foreground">Active Heroes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{communityStats.peopleHelped}</p>
            <p className="text-sm text-muted-foreground">People Helped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Route className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold">{communityStats.safeRoutes}</p>
            <p className="text-sm text-muted-foreground">Safe Routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold">{communityStats.updatesShared}</p>
            <p className="text-sm text-muted-foreground">Updates Shared</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Incidents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Active Emergency Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{incident.type}</h4>
                    <Badge variant={incident.severity === "High" ? "destructive" : "secondary"}>
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{incident.location}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {incident.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {incident.affected} affected
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Response */}
      <Card>
        <CardHeader>
          <CardTitle>Community Response Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Heroes in Your Area</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Connect with local volunteers ready to help
              </p>
              <Button variant="outline" size="sm">Find Heroes</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Share Safe Routes</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Report and share safe evacuation routes
              </p>
              <Button variant="outline" size="sm">Share Route</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyDashboard;