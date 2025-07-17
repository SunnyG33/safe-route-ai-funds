import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Heart, Volume2 } from 'lucide-react';

interface CPRGuideProps {
  onBack: () => void;
}

type CPRStep = 
  | 'setup' 
  | 'positioning' 
  | 'compressions' 
  | 'breathing' 
  | 'cycles';

const CPRGuide: React.FC<CPRGuideProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<CPRStep>('setup');
  const [isActive, setIsActive] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isListening, setIsListening] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const compressionTimer = useRef<NodeJS.Timeout>();
  const breathingTimer = useRef<NodeJS.Timeout>();
  const recognitionRef = useRef<any>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Screen wake lock for mobile
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.log('Wake lock failed:', err);
    }
  }, []);

  // Voice commands setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript.toLowerCase().trim();
          handleVoiceCommand(command);
        }
      };

      recognitionRef.current.onerror = () => {
        // Restart recognition on error for continuous listening
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 1000);
      };

      recognitionRef.current.onend = () => {
        // Restart recognition to keep it continuous
        if (isListening && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Start voice recognition and wake lock
  useEffect(() => {
    requestWakeLock();
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.start();
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, [requestWakeLock, isListening]);

  const handleVoiceCommand = (command: string) => {
    if (command.includes('start cpr') || command.includes('initiate cpr') || command.includes('begin cpr')) {
      startCPR();
    } else if (command.includes('stop') || command.includes('pause')) {
      stopCPR();
    } else if (command.includes('next step') || command.includes('next')) {
      nextStep();
    } else if (command.includes('go back') || command.includes('previous')) {
      previousStep();
    } else if (command.includes('repeat') || command.includes('again')) {
      speakCurrentInstruction();
    }
  };

  const speak = (text: string) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.volume = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const speakCurrentInstruction = () => {
    const instructions = getStepInstructions(currentStep);
    speak(instructions.audio);
  };

  const startCPR = () => {
    setIsActive(true);
    setCurrentStep('compressions');
    setCompressionCount(0);
    setCycleCount(0);
    speak("Starting CPR. Beginning chest compressions. Push hard and fast at least 2 inches deep.");
    startCompressions();
  };

  const stopCPR = () => {
    setIsActive(false);
    if (compressionTimer.current) clearInterval(compressionTimer.current);
    if (breathingTimer.current) clearTimeout(breathingTimer.current);
    speak("CPR stopped. Check for pulse and breathing.");
  };

  const startCompressions = () => {
    const bpm = 120; // 120 beats per minute
    const interval = 60000 / bpm; // milliseconds between compressions

    compressionTimer.current = setInterval(() => {
      setCompressionCount(prev => {
        const newCount = prev + 1;
        
        // Audio cues for compressions
        if (audioEnabled) {
          // Use Web Audio API for precise metronome sound
          const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        }

        // After 30 compressions, switch to breathing
        if (newCount === 30) {
          clearInterval(compressionTimer.current!);
          setCurrentStep('breathing');
          speak("30 compressions complete. Give 2 rescue breaths. Tilt head back, lift chin, pinch nose, and give 2 breaths.");
          
          breathingTimer.current = setTimeout(() => {
            setCycleCount(prev => prev + 1);
            setCompressionCount(0);
            setCurrentStep('compressions');
            speak("Continue compressions. Push hard and fast.");
            startCompressions();
          }, 10000); // 10 seconds for breathing

        }

        return newCount;
      });
    }, interval);
  };

  const nextStep = () => {
    const steps: CPRStep[] = ['setup', 'positioning', 'compressions', 'breathing', 'cycles'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      speakCurrentInstruction();
    }
  };

  const previousStep = () => {
    const steps: CPRStep[] = ['setup', 'positioning', 'compressions', 'breathing', 'cycles'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      speakCurrentInstruction();
    }
  };

  const getStepInstructions = (step: CPRStep) => {
    switch (step) {
      case 'setup':
        return {
          title: "1. Check Responsiveness",
          visual: "👤 Tap shoulders firmly and shout 'Are you okay?'",
          instruction: "• Tap the person's shoulders firmly\n• Shout 'Are you okay?'\n• Check for normal breathing\n• Call 911 or have someone else call",
          audio: "Tap the person's shoulders firmly and shout 'Are you okay?'. Check for normal breathing. Call 911 immediately."
        };
      case 'positioning':
        return {
          title: "2. Position Hands",
          visual: "✋ Place heel of hand on center of chest between nipples",
          instruction: "• Place heel of one hand on center of chest\n• Between the nipples on breastbone\n• Place other hand on top, interlacing fingers\n• Keep arms straight, shoulders over hands",
          audio: "Place the heel of one hand on the center of the chest between the nipples. Place your other hand on top and interlace your fingers. Keep your arms straight."
        };
      case 'compressions':
        return {
          title: "3. Chest Compressions",
          visual: "💓 Push hard and fast at least 2 inches deep",
          instruction: "• Push hard and fast at least 2 inches deep\n• Allow complete chest recoil\n• Minimize interruptions\n• Count out loud: 1, 2, 3...",
          audio: "Push hard and fast at least 2 inches deep. Allow the chest to come back up completely between compressions."
        };
      case 'breathing':
        return {
          title: "4. Rescue Breaths",
          visual: "💨 Tilt head back, lift chin, give 2 breaths",
          instruction: "• Tilt head back, lift chin\n• Pinch nose closed\n• Make seal over mouth\n• Give 2 breaths, 1 second each",
          audio: "Tilt the head back and lift the chin. Pinch the nose closed and give 2 rescue breaths, one second each."
        };
      case 'cycles':
        return {
          title: "5. Continue Cycles",
          visual: "🔄 30 compressions, then 2 breaths",
          instruction: "• Continue 30 compressions, 2 breaths\n• Don't stop until help arrives\n• Switch with someone every 2 minutes if possible",
          audio: "Continue cycles of 30 compressions followed by 2 rescue breaths. Don't stop until emergency help arrives."
        };
      default:
        return { title: "", visual: "", instruction: "", audio: "" };
    }
  };

  const currentInstructions = getStepInstructions(currentStep);

  return (
    <div className="min-h-screen bg-emergency-50 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-emergency-700 hover:bg-emergency-100"
          size="lg"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant={isListening ? "default" : "outline"}
            onClick={() => setIsListening(!isListening)}
            size="lg"
            className="bg-emergency-600 hover:bg-emergency-700"
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={audioEnabled ? "default" : "outline"}
            onClick={() => setAudioEnabled(!audioEnabled)}
            size="lg"
            className="bg-emergency-600 hover:bg-emergency-700"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Status Display */}
      {isActive && (
        <Card className="mb-6 p-6 bg-emergency-600 text-white border-none">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Heart className="w-8 h-8 animate-pulse text-emergency-200" />
              <div className="text-4xl font-bold">{compressionCount}/30</div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Cycle {cycleCount + 1}
              </Badge>
            </div>
            <div className="text-2xl font-semibold">
              {currentStep === 'compressions' ? 'PUSH HARD & FAST' : 'RESCUE BREATHS'}
            </div>
          </div>
        </Card>
      )}

      {/* Main Instructions */}
      <Card className="flex-1 p-8 mb-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emergency-800 mb-4">
            {currentInstructions.title}
          </h2>
          <div className="text-6xl mb-6">{currentInstructions.visual}</div>
        </div>

        <div className="space-y-6">
          <div className="bg-emergency-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-emergency-800 mb-3">Instructions:</h3>
            <pre className="text-lg text-emergency-700 whitespace-pre-line font-sans">
              {currentInstructions.instruction}
            </pre>
          </div>

          {/* Voice Commands Help */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Voice Commands:</h4>
            <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
              <div>"Start CPR" - Begin CPR</div>
              <div>"Stop" - Pause CPR</div>
              <div>"Next step" - Next instruction</div>
              <div>"Repeat" - Repeat instruction</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-4">
        {!isActive ? (
          <Button 
            onClick={startCPR}
            size="lg"
            className="h-16 text-xl bg-emergency-600 hover:bg-emergency-700 text-white"
          >
            <Heart className="w-6 h-6 mr-2" />
            START CPR
          </Button>
        ) : (
          <Button 
            onClick={stopCPR}
            variant="destructive"
            size="lg"
            className="h-16 text-xl"
          >
            STOP CPR
          </Button>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={previousStep}
            variant="outline"
            size="lg"
            className="h-12"
            disabled={currentStep === 'setup'}
          >
            Previous
          </Button>
          <Button 
            onClick={nextStep}
            variant="outline"
            size="lg"
            className="h-12"
            disabled={currentStep === 'cycles'}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CPRGuide;
