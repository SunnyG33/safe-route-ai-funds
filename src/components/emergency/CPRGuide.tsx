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
          <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div className="relative w-80 h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
              {/* Person lying down */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-16 bg-skin-tone rounded-full relative">
                  {/* Head */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-skin-tone rounded-full border-2 border-skin-tone-dark"></div>
                  {/* Body */}
                  <div className="w-full h-full rounded-lg bg-blue-200"></div>
                </div>
              </div>
              
              {/* Animated hand tapping shoulders */}
              <div className="absolute top-8 right-12 animate-bounce">
                <div className="w-8 h-12 bg-skin-tone rounded-lg transform rotate-12">
                  <div className="w-full h-6 bg-skin-tone-dark rounded-lg mt-1"></div>
                </div>
              </div>
              
              {/* Speech bubble */}
              <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-lg animate-pulse">
                <div className="text-sm font-bold text-red-600">"ARE YOU OK?"</div>
              </div>
              
              {/* Phone icon */}
              <div className="absolute top-4 right-4 animate-pulse">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-emergency-800">1. Check & Call</div>
              <div className="text-sm text-emergency-600">Tap shoulders • Shout • Call 911</div>
            </div>
          </div>
        );
      
      case 'positioning':
        return (
          <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div className="relative w-80 h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
              {/* Person lying down - chest view */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-40 h-24 bg-skin-tone rounded-lg relative">
                  {/* Chest area */}
                  <div className="w-full h-full bg-blue-200 rounded-lg"></div>
                  
                  {/* Nipple markers for reference */}
                  <div className="absolute top-3 left-6 w-2 h-2 bg-skin-tone-dark rounded-full"></div>
                  <div className="absolute top-3 right-6 w-2 h-2 bg-skin-tone-dark rounded-full"></div>
                  
                  {/* Center line guide */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-red-400 opacity-50"></div>
                  
                  {/* Animated hands positioning */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-pulse">
                    {/* Bottom hand */}
                    <div className="w-16 h-20 bg-skin-tone rounded-lg relative">
                      <div className="w-full h-8 bg-skin-tone-dark rounded-lg mt-2"></div>
                    </div>
                    {/* Top hand - slightly offset and different shade */}
                    <div className="absolute top-2 left-1 w-14 h-18 bg-skin-tone-dark rounded-lg opacity-90">
                      <div className="w-full h-6 bg-skin-tone rounded-lg mt-1"></div>
                    </div>
                  </div>
                  
                  {/* Target area highlight */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-red-500 rounded-full animate-pulse opacity-60"></div>
                </div>
              </div>
              
              {/* Instruction arrows */}
              <div className="absolute top-12 left-8 text-red-500 animate-bounce">
                <div className="text-2xl">↓</div>
                <div className="text-xs">CENTER</div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-emergency-800">2. Hand Position</div>
              <div className="text-sm text-emergency-600">Heel of hand • Center chest • Fingers up</div>
            </div>
          </div>
        );
      
      case 'compressions':
        return (
          <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div className="relative w-80 h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
              {/* Person lying down - side view for compression */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-40 h-16 bg-skin-tone rounded-lg relative">
                  {/* Body profile */}
                  <div className="w-full h-full bg-blue-200 rounded-lg"></div>
                  
                  {/* Animated hands compressing */}
                  <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                    isActive ? 'animate-[compress_0.5s_ease-in-out_infinite]' : ''
                  }`}>
                    <div className="w-12 h-16 bg-skin-tone rounded-lg relative">
                      <div className="w-full h-6 bg-skin-tone-dark rounded-lg mt-1"></div>
                      {/* Arms extending up */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-skin-tone"></div>
                    </div>
                  </div>
                  
                  {/* Compression depth indicator */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="text-xs text-red-600 font-bold">2"</div>
                    <div className="w-0.5 h-8 bg-red-500"></div>
                  </div>
                </div>
              </div>
              
              {/* Compression counter when active */}
              {isActive && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg animate-pulse">
                  <div className="text-2xl font-bold">{compressionCount}</div>
                </div>
              )}
              
              {/* Metronome indicator */}
              <div className="absolute top-4 right-4">
                <div className={`w-4 h-4 bg-green-500 rounded-full ${isActive ? 'animate-pulse' : ''}`}></div>
                <div className="text-xs text-green-600 font-bold">100-120/min</div>
              </div>
              
              {/* Force arrows */}
              <div className="absolute top-8 left-8 text-red-500 animate-bounce">
                <div className="text-xl">⬇️</div>
                <div className="text-xs font-bold">HARD</div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-emergency-800">3. Compress</div>
              <div className="text-sm text-emergency-600">Push HARD & FAST • 2 inches deep</div>
            </div>
          </div>
        );
      
      case 'breathing':
        return (
          <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div className="relative w-80 h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
              {/* Person's head tilted back */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Head tilted back */}
                  <div className="w-24 h-16 bg-skin-tone rounded-full transform -rotate-12 relative">
                    {/* Nose */}
                    <div className="absolute top-2 right-4 w-2 h-3 bg-skin-tone-dark rounded"></div>
                    {/* Mouth */}
                    <div className="absolute bottom-3 right-6 w-4 h-2 bg-red-300 rounded-full"></div>
                  </div>
                  
                  {/* Hand pinching nose */}
                  <div className="absolute -top-2 right-2 w-6 h-8 bg-skin-tone rounded animate-pulse">
                    <div className="w-full h-3 bg-skin-tone-dark rounded mt-1"></div>
                  </div>
                  
                  {/* Hand on forehead (head tilt) */}
                  <div className="absolute -top-4 left-2 w-8 h-6 bg-skin-tone rounded">
                    <div className="w-full h-2 bg-skin-tone-dark rounded"></div>
                  </div>
                  
                  {/* Animated breath */}
                  <div className="absolute -right-8 top-4 animate-pulse">
                    <div className="text-3xl">💨</div>
                  </div>
                </div>
              </div>
              
              {/* Breath counter */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                <div className="text-lg font-bold">2 Breaths</div>
              </div>
              
              {/* Instruction steps */}
              <div className="absolute top-4 left-4 space-y-1">
                <div className="text-xs bg-white p-1 rounded">1. Tilt head back</div>
                <div className="text-xs bg-white p-1 rounded">2. Lift chin</div>
                <div className="text-xs bg-white p-1 rounded">3. Pinch nose</div>
                <div className="text-xs bg-white p-1 rounded">4. Seal mouth</div>
              </div>
              
              {/* Timer indicator */}
              <div className="absolute bottom-4 right-4 text-blue-600">
                <div className="text-xs font-bold">1 sec each</div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-emergency-800">4. Rescue Breaths</div>
              <div className="text-sm text-emergency-600">Tilt • Lift • Pinch • Breathe x2</div>
            </div>
          </div>
        );
      
      case 'cycles':
        return (
          <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div className="relative w-80 h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
              {/* Cycle diagram */}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="relative">
                  {/* Central cycle indicator */}
                  <div className="w-32 h-32 border-4 border-red-500 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">CYCLE</div>
                      {isActive && (
                        <div className="text-2xl font-bold text-red-800">{cycleCount + 1}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Compression phase indicator */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-bold">30</div>
                      <div className="text-xs">COMPRESS</div>
                    </div>
                  </div>
                  
                  {/* Breathing phase indicator */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-bold">2</div>
                      <div className="text-xs">BREATHE</div>
                    </div>
                  </div>
                  
                  {/* Arrow indicators */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-red-500 text-xl animate-bounce">↑</div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-500 text-xl animate-bounce">↓</div>
                </div>
              </div>
              
              {/* Don't stop message */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold animate-pulse">
                DON'T STOP UNTIL HELP ARRIVES
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-emergency-800">5. Repeat Cycles</div>
              <div className="text-sm text-emergency-600">30:2 • Continue until EMS arrives</div>
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
