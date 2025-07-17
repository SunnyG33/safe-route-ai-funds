import { Shield, Phone, CheckCircle, Users, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EmergencyHero = () => {
  return (
    <div className="min-h-screen bg-emergency-calm p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Calming Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emergency-safe rounded-full mb-4">
            <Shield className="h-8 w-8 text-emergency-safe-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-emergency-calm-foreground">SafeRoute AI</h1>
          <p className="text-lg text-emergency-calm-foreground/80">You're going to be okay. Let's take this step by step.</p>
        </div>

        {/* Step 1: Check In Safe */}
        <Card className="border-emergency-safe bg-emergency-safe-light">
          <CardContent className="p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emergency-safe rounded-full">
              <CheckCircle className="h-6 w-6 text-emergency-safe-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-emergency-safe">Step 1: Are You Safe Right Now?</h2>
            <p className="text-emergency-safe/80">Let us know if you're in a safe location</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                className="bg-emergency-safe text-emergency-safe-foreground hover:bg-emergency-safe/90 text-lg py-6 px-8"
              >
                Yes, I'm Safe
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emergency-danger text-emergency-danger hover:bg-emergency-danger hover:text-emergency-danger-foreground text-lg py-6 px-8"
              >
                I Need Help Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Actions - Only if help needed */}
        <Card className="border-emergency-danger bg-emergency-danger-light">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-emergency-danger" />
              <h3 className="text-lg font-semibold text-emergency-danger">Emergency Actions</h3>
            </div>
            <div className="grid gap-3">
              <Button 
                size="lg" 
                className="bg-emergency-danger text-emergency-danger-foreground hover:bg-emergency-danger/90 justify-start h-16"
              >
                <Phone className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Call 911</div>
                  <div className="text-sm opacity-90">Emergency services</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emergency-warning text-emergency-warning hover:bg-emergency-warning hover:text-emergency-warning-foreground justify-start h-16"
              >
                <MapPin className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Find Safe Route</div>
                  <div className="text-sm opacity-90">Get directions to safety</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Support */}
        <Card className="border-emergency-focus bg-emergency-calm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-emergency-focus" />
              <h3 className="text-lg font-semibold text-emergency-calm-foreground">Community Support</h3>
            </div>
            <p className="text-emergency-calm-foreground/80">Connect with local heroes and community members</p>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-emergency-focus text-emergency-focus hover:bg-emergency-focus hover:text-emergency-focus-foreground h-14"
            >
              Join Community Hub
            </Button>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Vancouver, BC</span>
              </div>
              <Badge variant="outline" className="border-emergency-safe text-emergency-safe">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyHero;