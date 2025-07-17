import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Heart, Volume2, User, Hand } from 'lucide-react';

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

      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        // Only restart if not already started
        if (event.error !== 'aborted') {
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.log('Speech recognition restart failed:', err);
              }
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        // Restart recognition to keep it continuous
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.log('Speech recognition restart failed:', err);
            }
          }
        }, 500);
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
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log('Initial speech recognition start failed:', err);
      }
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

  const renderStepAnimation = (step: CPRStep) => {
    switch (step) {
      case 'setup':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <User className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="animate-pulse text-2xl font-bold text-emergency-700 mb-2">
                "ARE YOU OKAY?"
              </div>
              <div className="flex space-x-4 animate-bounce">
                <Hand className="w-8 h-8 text-emergency-600" />
                <span className="text-lg">Tap shoulders firmly</span>
              </div>
            </div>
          </div>
        );
      
      case 'positioning':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-40 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-blue-600 text-sm">Chest</div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-16 h-20 bg-skin-tone rounded-lg animate-pulse shadow-lg">
                  <div className="w-full h-8 bg-skin-tone-dark rounded-lg mt-2"></div>
                </div>
              </div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-16 bg-skin-tone-dark rounded-lg animate-pulse opacity-80">
                  <div className="w-full h-6 bg-skin-tone rounded-lg mt-2"></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-emergency-700">
                Heel of hand on center of chest
              </div>
              <div className="text-sm text-emergency-600">
                Between nipples, hands interlaced
              </div>
            </div>
          </div>
        );
      
      case 'compressions':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-40 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-blue-600 text-sm">Chest</div>
              </div>
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-transform duration-300 ${
                isActive ? 'animate-[compress_0.5s_ease-in-out_infinite]' : '-translate-y-2'
              }`}>
                <div className="w-16 h-20 bg-skin-tone rounded-lg shadow-lg">
                  <div className="w-full h-8 bg-skin-tone-dark rounded-lg mt-2"></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emergency-700 animate-pulse">
                PUSH HARD & FAST
              </div>
              <div className="text-lg text-emergency-600">
                At least 2 inches deep • 100-120/min
              </div>
              {isActive && (
                <div className="text-4xl font-bold text-emergency-800 animate-pulse">
                  {compressionCount}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'breathing':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-32 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-blue-600 text-sm">Head</div>
              </div>
              <div className="absolute top-2 right-4">
                <div className="w-8 h-6 bg-skin-tone rounded-full"></div>
              </div>
              <div className="absolute bottom-0 right-8 animate-pulse">
                <div className="text-2xl">💨</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-emergency-700 mb-2">
                Tilt head back, lift chin
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-6 bg-skin-tone rounded animate-pulse"></div>
                <span className="text-emergency-600">→</span>
                <div className="text-2xl animate-bounce">💨</div>
                <span className="text-lg font-semibold">x2</span>
              </div>
              <div className="text-sm text-emergency-600 mt-2">
                Pinch nose • Seal mouth • 1 second each
              </div>
            </div>
          </div>
        );
      
      case 'cycles':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-20 h-16 bg-red-100 rounded-lg flex items-center justify-center animate-pulse">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-lg font-bold text-emergency-700 mt-2">30</div>
                <div className="text-sm text-emergency-600">Compressions</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-16 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse">
                  <div className="text-2xl">💨</div>
                </div>
                <div className="text-lg font-bold text-emergency-700 mt-2">2</div>
                <div className="text-sm text-emergency-600">Breaths</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emergency-700 animate-pulse">
                REPEAT CYCLES
              </div>
              <div className="text-lg text-emergency-600">
                Don't stop until help arrives
              </div>
              {isActive && (
                <div className="mt-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Cycle {cycleCount + 1}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStepInstructions = (step: CPRStep) => {
    switch (step) {
      case 'setup':
        return {
          title: "1. Check Responsiveness",
          instruction: "• Tap the person's shoulders firmly\n• Shout 'Are you okay?'\n• Check for normal breathing\n• Call 911 or have someone else call",
          audio: "Tap the person's shoulders firmly and shout 'Are you okay?'. Check for normal breathing. Call 911 immediately."
        };
      case 'positioning':
        return {
          title: "2. Position Hands",
          instruction: "• Place heel of one hand on center of chest\n• Between the nipples on breastbone\n• Place other hand on top, interlacing fingers\n• Keep arms straight, shoulders over hands",
          audio: "Place the heel of one hand on the center of the chest between the nipples. Place your other hand on top and interlace your fingers. Keep your arms straight."
        };
      case 'compressions':
        return {
          title: "3. Chest Compressions",
          instruction: "• Push hard and fast at least 2 inches deep\n• Allow complete chest recoil\n• Minimize interruptions\n• Count out loud: 1, 2, 3...",
          audio: "Push hard and fast at least 2 inches deep. Allow the chest to come back up completely between compressions."
        };
      case 'breathing':
        return {
          title: "4. Rescue Breaths",
          instruction: "• Tilt head back, lift chin\n• Pinch nose closed\n• Make seal over mouth\n• Give 2 breaths, 1 second each",
          audio: "Tilt the head back and lift the chin. Pinch the nose closed and give 2 rescue breaths, one second each."
        };
      case 'cycles':
        return {
          title: "5. Continue Cycles",
          instruction: "• Continue 30 compressions, 2 breaths\n• Don't stop until help arrives\n• Switch with someone every 2 minutes if possible",
          audio: "Continue cycles of 30 compressions followed by 2 rescue breaths. Don't stop until emergency help arrives."
        };
      default:
        return { title: "", instruction: "", audio: "" };
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
          <h2 className="text-3xl font-bold text-emergency-800 mb-6">
            {currentInstructions.title}
          </h2>
          <div className="mb-6">
            {renderStepAnimation(currentStep)}
          </div>
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
