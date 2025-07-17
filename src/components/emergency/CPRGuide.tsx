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
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="relative w-96 h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Close-up view of person lying down */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                {/* Person's torso and head */}
                <div className="relative">
                  {/* Head */}
                  <div className="w-20 h-20 bg-skin-tone rounded-full absolute -top-8 left-1/2 transform -translate-x-1/2 border-2 border-skin-tone-dark">
                    {/* Face features */}
                    <div className="absolute top-4 left-3 w-2 h-2 bg-gray-700 rounded-full"></div> {/* Eye */}
                    <div className="absolute top-4 right-3 w-2 h-2 bg-gray-700 rounded-full"></div> {/* Eye */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-300 rounded-full"></div> {/* Mouth */}
                  </div>
                  
                  {/* Shoulders and chest */}
                  <div className="w-32 h-20 bg-orange-400 rounded-lg relative border-2 border-orange-500">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">VICTIM</div>
                  </div>
                </div>
              </div>
              
              {/* Rescuer figure on phone */}
              <div className="absolute top-4 right-4">
                <div className="relative">
                  {/* Rescuer head */}
                  <div className="w-12 h-12 bg-blue-300 rounded-full border border-blue-400">
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
                  </div>
                  {/* Phone */}
                  <div className="absolute -right-2 top-1 w-6 h-8 bg-black rounded animate-pulse">
                    <div className="w-full h-2 bg-green-400 rounded-t"></div>
                  </div>
                  {/* Body */}
                  <div className="w-16 h-12 bg-blue-600 rounded-lg mt-1"></div>
                </div>
              </div>
              
              {/* Animated tapping hands */}
              <div className="absolute top-16 left-20 animate-bounce">
                <div className="w-8 h-10 bg-blue-300 rounded-lg transform rotate-12">
                  <div className="w-full h-4 bg-blue-400 rounded-lg mt-1"></div>
                </div>
              </div>
              
              {/* "ARE YOU OK?" speech bubble */}
              <div className="absolute top-8 left-8 bg-white border-2 border-red-500 rounded-lg p-2 animate-pulse">
                <div className="text-sm font-bold text-red-600">"ARE YOU OK?"</div>
                <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
              
              {/* Emergency number */}
              <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg font-bold animate-pulse">
                📱 911
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xl font-bold text-red-600">1. CALL 911</div>
              <div className="text-sm text-gray-600">Check response • Call for help</div>
            </div>
          </div>
        );
      
      case 'positioning':
        return (
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="relative w-96 h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Extreme close-up of chest and hands */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {/* Victim's chest - much larger and detailed */}
                <div className="w-56 h-32 bg-orange-400 rounded-lg relative border-2 border-orange-500">
                  {/* Chest anatomy markers */}
                  <div className="absolute top-4 left-12 w-3 h-3 bg-orange-600 rounded-full"></div> {/* Left nipple */}
                  <div className="absolute top-4 right-12 w-3 h-3 bg-orange-600 rounded-full"></div> {/* Right nipple */}
                  
                  {/* Sternum guideline */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-400 opacity-70"></div>
                  
                  {/* Compression target area */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-red-500 rounded-full animate-pulse bg-red-100 opacity-80">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-red-700">TARGET</div>
                  </div>
                </div>
                
                {/* Detailed hand positioning */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  {/* Bottom hand (on chest) */}
                  <div className="w-20 h-24 bg-blue-300 rounded-lg relative border-2 border-blue-400 animate-pulse">
                    <div className="w-full h-8 bg-blue-400 rounded-lg mt-2"></div>
                    {/* Fingers */}
                    <div className="absolute bottom-0 left-0 w-3 h-6 bg-blue-400 rounded"></div>
                    <div className="absolute bottom-0 left-4 w-3 h-6 bg-blue-400 rounded"></div>
                    <div className="absolute bottom-0 right-4 w-3 h-6 bg-blue-400 rounded"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-6 bg-blue-400 rounded"></div>
                  </div>
                  
                  {/* Top hand (interlaced) */}
                  <div className="absolute top-4 left-2 w-16 h-20 bg-blue-200 rounded-lg border-2 border-blue-300 opacity-90">
                    <div className="w-full h-6 bg-blue-300 rounded-lg mt-1"></div>
                    {/* Interlaced fingers */}
                    <div className="absolute bottom-0 left-1 w-2 h-4 bg-blue-300 rounded"></div>
                    <div className="absolute bottom-0 left-4 w-2 h-4 bg-blue-300 rounded"></div>
                    <div className="absolute bottom-0 right-4 w-2 h-4 bg-blue-300 rounded"></div>
                    <div className="absolute bottom-0 right-1 w-2 h-4 bg-blue-300 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Position indicators */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                HEEL OF HAND
              </div>
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                CENTER CHEST
              </div>
              <div className="absolute bottom-16 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                BETWEEN NIPPLES
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xl font-bold text-blue-600">2. HAND POSITION</div>
              <div className="text-sm text-gray-600">Heel on center • Fingers interlaced</div>
            </div>
          </div>
        );
      
      case 'compressions':
        return (
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="relative w-96 h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Ultra close-up compression view */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                {/* Victim's chest with compression depth */}
                <div className="w-48 h-24 bg-orange-400 rounded-lg relative border-2 border-orange-500">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-orange-800">CHEST</div>
                  
                  {/* Compression depth indicator */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="text-xs font-bold text-red-600">2"</div>
                    <div className="w-1 h-8 bg-red-500"></div>
                    <div className="text-xs font-bold text-red-600">MIN</div>
                  </div>
                </div>
                
                {/* Animated hands performing compressions */}
                <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                  isActive ? 'animate-[compress_0.5s_ease-in-out_infinite]' : ''
                }`}>
                  {/* Rescuer's arms and hands - much more detailed */}
                  <div className="relative">
                    {/* Arms coming down */}
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-blue-500 rounded"></div>
                    
                    {/* Hands compressed together */}
                    <div className="w-18 h-20 bg-blue-300 rounded-lg border-2 border-blue-400 relative">
                      <div className="w-full h-8 bg-blue-400 rounded-lg mt-2"></div>
                      {/* Compression force indicator */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 animate-pulse">
                        PUSH!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Live compression counter */}
              {isActive && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg animate-pulse border-2 border-red-700">
                  <div className="text-3xl font-bold">{compressionCount}</div>
                  <div className="text-sm">/ 30</div>
                </div>
              )}
              
              {/* Rate indicator */}
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <div className="text-xs font-bold text-green-600 mt-1">100-120/min</div>
              </div>
              
              {/* Force and depth indicators */}
              <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-bounce">
                HARD & FAST
              </div>
              
              {/* Body position reminder */}
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                ARMS STRAIGHT
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xl font-bold text-red-600">3. CHEST COMPRESSIONS</div>
              <div className="text-sm text-gray-600">Push HARD & FAST • 2+ inches deep</div>
            </div>
          </div>
        );
      
      case 'breathing':
        return (
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="relative w-96 h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Close-up airway management */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                {/* Victim's head and neck - detailed view */}
                <div className="relative">
                  {/* Head tilted back */}
                  <div className="w-32 h-20 bg-skin-tone rounded-full transform -rotate-12 relative border-2 border-skin-tone-dark">
                    {/* Facial features */}
                    <div className="absolute top-3 left-6 w-2 h-2 bg-gray-700 rounded-full"></div> {/* Eye */}
                    <div className="absolute top-3 right-8 w-2 h-2 bg-gray-700 rounded-full"></div> {/* Eye */}
                    
                    {/* Nose */}
                    <div className="absolute top-4 right-6 w-3 h-4 bg-skin-tone-dark rounded"></div>
                    
                    {/* Mouth open for breathing */}
                    <div className="absolute bottom-4 right-8 w-6 h-3 bg-red-400 rounded-full border border-red-500"></div>
                  </div>
                  
                  {/* Rescuer's hand on forehead */}
                  <div className="absolute -top-6 left-4 w-10 h-8 bg-blue-300 rounded border border-blue-400">
                    <div className="w-full h-3 bg-blue-400 rounded mt-1"></div>
                  </div>
                  
                  {/* Hand pinching nose */}
                  <div className="absolute top-0 right-4 w-6 h-8 bg-blue-300 rounded animate-pulse border border-blue-400">
                    <div className="w-full h-3 bg-blue-400 rounded mt-1"></div>
                  </div>
                  
                  {/* Rescue breath visualization */}
                  <div className="absolute -right-12 top-6 animate-pulse">
                    <div className="text-4xl">💨</div>
                    <div className="text-xs font-bold text-blue-600">BREATH</div>
                  </div>
                </div>
                
                {/* Orange shirt/body */}
                <div className="w-40 h-16 bg-orange-400 rounded-lg mt-4 border-2 border-orange-500">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">VICTIM</div>
                </div>
              </div>
              
              {/* Step indicators */}
              <div className="absolute top-4 left-4 space-y-1">
                <div className="text-xs bg-white border border-blue-500 p-1 rounded font-bold">1. TILT HEAD</div>
                <div className="text-xs bg-white border border-blue-500 p-1 rounded font-bold">2. LIFT CHIN</div>
                <div className="text-xs bg-white border border-blue-500 p-1 rounded font-bold">3. PINCH NOSE</div>
                <div className="text-xs bg-white border border-blue-500 p-1 rounded font-bold">4. SEAL & BREATHE</div>
              </div>
              
              {/* Breath counter */}
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-700">
                <div className="text-lg font-bold">2</div>
                <div className="text-xs">BREATHS</div>
              </div>
              
              {/* Timing indicator */}
              <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold animate-pulse">
                1 SEC EACH
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xl font-bold text-blue-600">4. RESCUE BREATHS</div>
              <div className="text-sm text-gray-600">Open airway • 2 breaths • 1 second each</div>
            </div>
          </div>
        );
      
      case 'cycles':
        return (
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="relative w-96 h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Side-by-side cycle demonstration */}
              <div className="absolute inset-4 grid grid-cols-2 gap-4">
                {/* Compression phase */}
                <div className="relative bg-red-100 border-2 border-red-500 rounded-lg p-2">
                  <div className="text-center mb-2">
                    <div className="text-sm font-bold text-red-600">COMPRESSIONS</div>
                  </div>
                  
                  {/* Mini compression demo */}
                  <div className="relative">
                    <div className="w-20 h-12 bg-orange-400 rounded mx-auto border border-orange-500"></div>
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-blue-300 rounded border border-blue-400 ${
                      isActive ? 'animate-pulse' : ''
                    }`}></div>
                  </div>
                  
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-red-600">30</div>
                    <div className="text-xs text-red-500">PUSHES</div>
                  </div>
                </div>
                
                {/* Breathing phase */}
                <div className="relative bg-blue-100 border-2 border-blue-500 rounded-lg p-2">
                  <div className="text-center mb-2">
                    <div className="text-sm font-bold text-blue-600">BREATHS</div>
                  </div>
                  
                  {/* Mini breathing demo */}
                  <div className="relative">
                    <div className="w-16 h-10 bg-skin-tone rounded-full mx-auto border border-skin-tone-dark transform -rotate-12"></div>
                    <div className="absolute -right-2 top-2 text-lg animate-pulse">💨</div>
                  </div>
                  
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-xs text-blue-500">BREATHS</div>
                  </div>
                </div>
              </div>
              
              {/* Cycle counter */}
              {isActive && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg border-2 border-green-700">
                  <div className="text-center">
                    <div className="text-lg font-bold">CYCLE {cycleCount + 1}</div>
                    <div className="text-xs">IN PROGRESS</div>
                  </div>
                </div>
              )}
              
              {/* Don't stop warning */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold animate-pulse border-2 border-yellow-600">
                DON'T STOP UNTIL EMS ARRIVES
              </div>
              
              {/* Arrows showing cycle flow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-gray-600 animate-pulse">
                ↔️
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xl font-bold text-green-600">5. REPEAT CYCLES</div>
              <div className="text-sm text-gray-600">30 compressions → 2 breaths → Repeat</div>
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
