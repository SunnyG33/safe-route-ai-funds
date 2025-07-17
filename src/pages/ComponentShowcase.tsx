import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Import our custom emergency components
import { IncidentStatusCard, type IncidentData } from "@/components/emergency/IncidentStatusCard"
import { 
  EmergencyButton, 
  AlertButton, 
  EmergencyCallButton, 
  RadioDispatchButton,
  SirenButton,
  EmergencyProtocolButton,
  EmergencyMessageButton
} from "@/components/emergency/EmergencyButton"
import { 
  AlertBanner, 
  EmergencyAlert, 
  WarningAlert, 
  InfoAlert, 
  SuccessAlert 
} from "@/components/emergency/AlertBanner"
import { 
  StatusDashboard,
  SystemStatusIndicator,
  ConnectionStatusIndicator,
  BatteryStatusIndicator,
  SignalStatusIndicator
} from "@/components/emergency/StatusIndicator"

export default function ComponentShowcase() {
  const [soundEnabled, setSoundEnabled] = React.useState(false)
  const [emergencyActive, setEmergencyActive] = React.useState(false)
  const [countdown, setCountdown] = React.useState<number | undefined>()

  // Mock incident data
  const mockIncidents: IncidentData[] = [
    {
      id: "inc-001",
      title: "Wildfire Approaching Settlement",
      description: "Large wildfire spotted 5km north of community. Wind conditions deteriorating. Immediate evacuation protocol recommended.",
      severity: "critical",
      status: "active",
      location: "Northern Ridge, Sector 7",
      reportedAt: new Date(Date.now() - 1000 * 60 * 23), // 23 minutes ago
      assignedTeams: ["Fire Response", "Evacuation"],
      contactMethod: "Starlink + Radio",
      estimatedPersonsAffected: 47
    },
    {
      id: "inc-002", 
      title: "Medical Emergency - Elder Council",
      description: "Health emergency reported during elder council meeting. Medical officer requested immediately.",
      severity: "high",
      status: "responding",
      location: "Community Center",
      reportedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      assignedTeams: ["Medical Team"],
      contactMethod: "Radio",
      estimatedPersonsAffected: 1
    },
    {
      id: "inc-003",
      title: "Supply Route Weather Warning",
      description: "Severe weather conditions expected on main supply route. Transport delays anticipated.",
      severity: "medium",
      status: "pending",
      location: "Highway 17, Mile 34",
      reportedAt: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
      assignedTeams: [],
      contactMethod: "Satellite Phone",
      estimatedPersonsAffected: 15
    }
  ]

  const handleEmergencyAction = (action: string) => {
    console.log(`Emergency action triggered: ${action}`)
    if (action === 'alert') {
      setEmergencyActive(true)
      setCountdown(5)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Emergency Response Components
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transferable UI components designed for life-critical emergency response systems. 
            These components work in both React + Vite and Next.js environments.
          </p>
        </div>

        {/* Status Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              System Status Dashboard
              <Badge variant="outline">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDashboard
              systemStatus="online"
              connectionStatus="connected" 
              batteryLevel="high"
              signalStrength="excellent"
              className="justify-center"
            />
          </CardContent>
        </Card>

        {/* Alert Banners */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Alert Banner System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmergencyAlert
              title="Critical Emergency Alert"
              message="This is a life-threatening emergency requiring immediate action. All personnel must respond according to emergency protocols."
              showSound={true}
              soundEnabled={soundEnabled}
              onSoundToggle={() => setSoundEnabled(!soundEnabled)}
              actions={[
                { label: "Acknowledge", onClick: () => console.log("Acknowledged") },
                { label: "Respond", onClick: () => console.log("Responding"), variant: "destructive" }
              ]}
            />
            
            <WarningAlert
              title="Weather Warning"
              message="Severe weather conditions expected in the next 2 hours. Review evacuation procedures."
              autoHideAfter={10}
            />
            
            <InfoAlert
              title="System Update"
              message="Starlink connectivity has been restored. All communication channels are now operational."
              showDismiss={false}
            />
            
            <SuccessAlert
              title="Emergency Resolved"
              message="Medical emergency at Community Center has been successfully resolved. All personnel accounted for."
            />
          </CardContent>
        </Card>

        {/* Emergency Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Emergency Action Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AlertButton 
                onClick={() => handleEmergencyAction('alert')}
                countdown={countdown}
                onCountdownComplete={() => setCountdown(undefined)}
                isActive={emergencyActive}
              />
              <EmergencyCallButton onClick={() => handleEmergencyAction('call')} />
              <RadioDispatchButton onClick={() => handleEmergencyAction('radio')} />
              <SirenButton onClick={() => handleEmergencyAction('siren')} />
              <EmergencyProtocolButton onClick={() => handleEmergencyAction('protocol')} />
              <EmergencyMessageButton onClick={() => handleEmergencyAction('message')} />
            </div>
          </CardContent>
        </Card>

        {/* Incident Status Cards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Incident Management Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockIncidents.map((incident) => (
                <IncidentStatusCard
                  key={incident.id}
                  incident={incident}
                  onRespond={(id) => console.log(`Responding to incident: ${id}`)}
                  onViewDetails={(id) => console.log(`Viewing details for incident: ${id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Individual Status Indicators */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">System Status</h4>
                <SystemStatusIndicator status="online" size="sm" />
                <SystemStatusIndicator status="degraded" size="sm" />
                <SystemStatusIndicator status="offline" size="sm" />
                <SystemStatusIndicator status="maintenance" size="sm" />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Connection</h4>
                <ConnectionStatusIndicator status="connected" size="sm" />
                <ConnectionStatusIndicator status="poor" size="sm" />
                <ConnectionStatusIndicator status="disconnected" size="sm" />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Battery</h4>
                <BatteryStatusIndicator status="full" size="sm" />
                <BatteryStatusIndicator status="medium" size="sm" />
                <BatteryStatusIndicator status="low" size="sm" />
                <BatteryStatusIndicator status="critical" size="sm" />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Signal</h4>
                <SignalStatusIndicator status="excellent" size="sm" />
                <SignalStatusIndicator status="good" size="sm" />
                <SignalStatusIndicator status="poor" size="sm" />
                <SignalStatusIndicator status="none" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Emergency Color System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="h-16 bg-emergency-danger rounded-lg border"></div>
                <div className="text-sm font-medium">Emergency Danger</div>
                <div className="text-xs text-muted-foreground">Critical alerts</div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 bg-emergency-warning rounded-lg border"></div>
                <div className="text-sm font-medium">Emergency Warning</div>
                <div className="text-xs text-muted-foreground">Caution required</div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 bg-emergency-safe rounded-lg border"></div>
                <div className="text-sm font-medium">Emergency Safe</div>
                <div className="text-xs text-muted-foreground">All clear status</div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 bg-emergency-focus rounded-lg border"></div>
                <div className="text-sm font-medium">Emergency Focus</div>
                <div className="text-xs text-muted-foreground">Information</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Next.js Transfer Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">✅ Easily Transferable</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• All TypeScript interfaces in /types</li>
                  <li>• Emergency UI components</li>
                  <li>• Design system colors (HSL)</li>
                  <li>• Tailwind configuration</li>
                  <li>• React hooks and utilities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚠️ Requires Adaptation</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Routing (React Router → Next.js)</li>
                  <li>• File structure (pages → app directory)</li>
                  <li>• API integration patterns</li>
                  <li>• SSR considerations</li>
                  <li>• Build configuration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}