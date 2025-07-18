import { useState, useEffect } from "react";
import { Shield, Phone, CheckCircle, Users, AlertTriangle, MapPin, Heart, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CPRGuide from "./emergency/CPRGuide";
import { useToast } from "@/hooks/use-toast";

// TypeScript declarations for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const EmergencyHero = () => {
  const [showCPRGuide, setShowCPRGuide] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const initiateCPR = () => {
    setShowCPRGuide(true);
    toast({
      title: "CPR Guide Activated",
      description: "Voice-guided CPR assistance is starting...",
    });
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();
      
      speechRecognition.continuous = true;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        
        if (transcript.includes('safeai initiate cpr') || transcript.includes('safe ai initiate cpr')) {
          initiateCPR();
          speechRecognition.stop();
          setIsListening(false);
        }
      };

      speechRecognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or use the button to start CPR.",
          variant: "destructive"
        });
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, [toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice commands. Please use the button.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Say 'SafeAI initiate CPR' to start CPR guide",
      });
    }
  };

  if (showCPRGuide) {
    return <CPRGuide onBack={() => setShowCPRGuide(false)} />;
  }

  return (
    <div className="min-h-screen bg-emergency-calm p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emergency-safe rounded-full mb-4">
            <Shield className="h-8 w-8 text-emergency-safe-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-emergency-calm-foreground">SafeRoute AI - Mobile CPR Ready</h1>
          <p className="text-lg text-emergency-calm-foreground/80">You're going to be okay. Let's take this step by step.</p>
        </div>

        {/* Main CPR Section - Center Focus */}
        <div className="text-center mb-8">
          <Card className="border-emergency-danger bg-emergency-danger-light max-w-md mx-auto">
            <CardContent className="p-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emergency-danger rounded-full animate-pulse">
                <Heart className="h-10 w-10 text-emergency-danger-foreground" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-emergency-danger">Emergency CPR</h2>
                <p className="text-emergency-danger/80">Immediate life-saving assistance</p>
              </div>

              <Button 
                onClick={initiateCPR}
                size="lg" 
                className="w-full bg-emergency-danger text-emergency-danger-foreground hover:bg-emergency-danger/90 text-xl py-8 font-bold hover-scale"
              >
                <Heart className="h-8 w-8 mr-3" />
                START CPR GUIDE
              </Button>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-emergency-danger/20">
                <Button
                  onClick={toggleListening}
                  variant="outline"
                  size="sm"
                  className={`border-emergency-danger ${isListening ? 'bg-emergency-danger text-emergency-danger-foreground' : 'text-emergency-danger hover:bg-emergency-danger hover:text-emergency-danger-foreground'}`}
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  Voice Control
                </Button>
                <div className="text-sm text-emergency-danger/70">
                  Say: "SafeAI initiate CPR"
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid Layout for Other Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Safety Check */}
          <Card className="border-emergency-safe bg-emergency-safe-light">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-emergency-safe" />
                <h3 className="text-lg font-semibold text-emergency-safe">Safety Check</h3>
              </div>
              <p className="text-emergency-safe/80">Confirm you're in a safe location</p>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full bg-emergency-safe text-emergency-safe-foreground hover:bg-emergency-safe/90"
                >
                  Yes, I'm Safe
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-emergency-danger text-emergency-danger hover:bg-emergency-danger hover:text-emergency-danger-foreground"
                >
                  I Need Help Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Actions */}
          <Card className="border-emergency-warning bg-emergency-warning-light">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-emergency-warning" />
                <h3 className="text-lg font-semibold text-emergency-warning">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full bg-emergency-danger text-emergency-danger-foreground hover:bg-emergency-danger/90 justify-start"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 911
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-emergency-warning text-emergency-warning hover:bg-emergency-warning hover:text-emergency-warning-foreground justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Safe Route
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Support */}
        <Card className="border-emergency-focus bg-emergency-calm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-emergency-focus" />
              <h3 className="text-lg font-semibold text-emergency-calm-foreground">Community Support</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-emergency-calm-foreground/80">Connect with local heroes and community members</p>
              <Button 
                variant="outline" 
                className="border-emergency-focus text-emergency-focus hover:bg-emergency-focus hover:text-emergency-focus-foreground"
              >
                Join Community Hub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Bar */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Vancouver, BC</span>
              </div>
              <div className="flex items-center gap-4">
                {isListening && (
                  <Badge variant="outline" className="border-emergency-danger text-emergency-danger animate-pulse">
                    <Mic className="h-3 w-3 mr-1" />
                    Listening
                  </Badge>
                )}
                <Badge variant="outline" className="border-emergency-safe text-emergency-safe">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyHero;