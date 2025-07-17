import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Heart, Volume2, User, Hand, Smartphone, Eye, Stethoscope, Activity, Zap, Timer, ArrowRight, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

// Import high-quality CPR instruction images
import cprCheckResponsiveness from '@/assets/cpr-check-responsiveness-hq.png';
import cprHandPosition from '@/assets/cpr-hand-position-hq.png';
import cprCompressions from '@/assets/cpr-compressions-hq.png';
import cprAirway from '@/assets/cpr-airway-hq.png';
import cprRescueBreath from '@/assets/cpr-rescue-breath-hq.png';
import cprRescueBreathSimple from '@/assets/cpr-rescue-breath-simple.png';

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
    // Enhanced medical-grade voice commands
    if (command.includes('start cpr') || command.includes('initiate cpr') || command.includes('begin cpr') || 
        command.includes('start compressions') || command.includes('begin compressions')) {
      startCPR();
      speak("Starting CPR now. Following the beat.");
    } else if (command.includes('stop') || command.includes('pause') || command.includes('pause instructions')) {
      stopCPR();
      speak("CPR paused.");
    } else if (command.includes('next step') || command.includes('next') || command.includes('continue')) {
      nextStep();
      speak("Moving to next step.");
    } else if (command.includes('go back') || command.includes('previous') || command.includes('back')) {
      previousStep();
      speak("Going back to previous step.");
    } else if (command.includes('repeat') || command.includes('again') || command.includes('repeat that') || 
               command.includes('say it again') || command.includes('repeat last step')) {
      speakCurrentInstruction();
    } else if (command.includes('call 911') || command.includes('call nine one one')) {
      speak("Call 911 immediately. Tell them you need emergency medical services for CPR.");
      // Try to initiate phone call
      if ('tel:' in window.location) {
        window.location.href = 'tel:911';
      }
    } else if (command.includes('help') || command.includes('commands')) {
      speak("Available commands: Start CPR, Stop, Next step, Previous, Repeat, Call 911.");
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
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border-4 border-red-500 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-red-600 text-white py-3 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-8 h-8" />
                <span className="text-2xl font-black">STEP 1: CHECK & CALL</span>
                <Phone className="w-8 h-8" />
              </div>
            </div>
            
            {/* Real Human Figure Image */}
            <div className="relative h-80 bg-white overflow-hidden">
              <img 
                src={cprCheckResponsiveness} 
                alt="Person checking responsiveness of unconscious victim" 
                className="w-full h-full object-contain"
              />
              
              {/* Navigation arrows directly on image */}
              <button 
                onClick={nextStep}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              
              {/* Overlay with critical instructions */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg animate-pulse">
                📱 CALL 911 FIRST
              </div>
              
              <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg">
                👋 TAP & SHOUT
              </div>
            </div>
            
            {/* Action Steps */}
            <div className="bg-red-50 p-4 border-t-4 border-red-500">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white rounded-lg p-2 border-2 border-red-300">
                  <div className="text-2xl">👋</div>
                  <div className="text-xs font-bold text-red-600">TAP SHOULDERS</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-red-300">
                  <div className="text-2xl">📢</div>
                  <div className="text-xs font-bold text-red-600">SHOUT LOUDLY</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-red-300">
                  <div className="text-2xl">👁️</div>
                  <div className="text-xs font-bold text-red-600">CHECK BREATHING</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-red-300">
                  <div className="text-2xl">📱</div>
                  <div className="text-xs font-bold text-red-600">CALL 911</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'positioning':
        return (
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border-4 border-blue-500 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-blue-600 text-white py-3 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Hand className="w-8 h-8" />
                <span className="text-2xl font-black">STEP 2: HAND POSITION</span>
                <Hand className="w-8 h-8" />
              </div>
            </div>
            
            {/* Real Human Figure Image */}
            <div className="relative h-80 bg-white overflow-hidden">
              <img 
                src={cprHandPosition} 
                alt="Proper hand positioning for CPR compressions" 
                className="w-full h-full object-contain"
              />
              
              {/* Navigation arrows */}
              <button 
                onClick={previousStep}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button 
                onClick={nextStep}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              
              {/* Overlay instructions */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                ✋ HEEL OF HAND
              </div>
              
              <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg">
                💪 ARMS STRAIGHT
              </div>
              
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg animate-pulse">
                🎯 CENTER CHEST
              </div>
            </div>
            
            {/* Step Guide */}
            <div className="bg-blue-50 p-4 border-t-4 border-blue-500">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">✋</div>
                  <div className="text-xs font-bold text-blue-600">HEEL ON CENTER</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">🤝</div>
                  <div className="text-xs font-bold text-blue-600">INTERLACE FINGERS</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">💪</div>
                  <div className="text-xs font-bold text-blue-600">STRAIGHT ARMS</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'compressions':
        return (
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border-4 border-red-500 overflow-hidden">
            {/* Header Banner with Timer */}
            <div className="bg-red-600 text-white py-3 px-6 text-center relative">
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-8 h-8" />
                <span className="text-2xl font-black">STEP 3: COMPRESSIONS</span>
                <Activity className="w-8 h-8" />
              </div>
              
              {/* Compression Counter */}
              {isActive && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-700 text-white rounded-xl shadow-xl border-4 border-red-800 px-6 py-3 z-20">
                  <div className="text-4xl font-black animate-pulse">{compressionCount}</div>
                  <div className="text-lg font-bold">/ 30</div>
                </div>
              )}
            </div>
            
            {/* Real Human Figure Image */}
            <div className="relative h-80 bg-white overflow-hidden pt-16">
              <img 
                src={cprCompressions} 
                alt="Person performing chest compressions during CPR" 
                className="w-full h-full object-contain"
              />
              
              {/* Navigation arrows */}
              <button 
                onClick={previousStep}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={nextStep}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Metronome Visual (animated pulsing circle) */}
              <div className="absolute top-8 right-16">
                <div className={`w-16 h-16 rounded-full border-4 shadow-lg flex items-center justify-center ${
                  isActive ? 'bg-green-500 border-green-600 animate-[pulse_0.5s_ease-in-out_infinite]' : 'bg-gray-400 border-gray-500'
                }`}>
                  <div className="text-white font-bold text-xs">120<br/>BPM</div>
                </div>
              </div>
              
              {/* Critical overlays */}
              <div className="absolute top-8 left-16 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg animate-pulse">
                💥 PUSH HARD
              </div>
              
              <div className="absolute bottom-8 left-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg">
                📏 2 INCHES DEEP
              </div>
              
              <div className="absolute bottom-8 right-16 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                ↩️ FULL RECOIL
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-red-50 p-4 border-t-4 border-red-500">
              <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-red-500 h-4 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${(compressionCount / 30) * 100}%` }}
                ></div>
              </div>
              <div className="text-center mt-2 text-red-600 font-bold">
                {isActive ? `${compressionCount} / 30 Compressions` : 'Ready to Start'}
              </div>
            </div>
          </div>
        );
      
      case 'breathing':
        return (
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border-4 border-blue-500 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-blue-600 text-white py-3 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-8 h-8" />
                <span className="text-2xl font-black">STEP 4: RESCUE BREATHS</span>
                <Activity className="w-8 h-8" />
              </div>
            </div>
            
            {/* Dual Image Display for Breathing Steps */}
            <div className="relative h-80 bg-white overflow-hidden flex">
              {/* Navigation arrows for breathing step */}
              <button 
                onClick={previousStep}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-colors z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={nextStep}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-colors z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Airway Management */}
              <div className="w-1/2 relative">
                <img 
                  src={cprAirway} 
                  alt="Head tilt chin lift for airway opening" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-2 bg-blue-600 text-white px-2 py-1 rounded font-bold text-xs">
                  🔄 TILT & LIFT
                </div>
              </div>
              
              {/* Rescue Breathing */}
              <div className="w-1/2 relative">
                <img 
                  src={cprRescueBreath} 
                  alt="Person giving rescue breath during CPR" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 right-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-xs">
                  💨 2 BREATHS
                </div>
              </div>
              
              {/* Central divider with instructions */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg border-2 border-yellow-600">
                ⏱️ 1 SEC EACH
              </div>
              
              {/* Step indicators */}
              <div className="absolute bottom-4 left-4 bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg">
                <div className="text-blue-600 font-bold text-sm">1️⃣ OPEN AIRWAY</div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg">
                <div className="text-blue-600 font-bold text-sm">2️⃣ GIVE BREATHS</div>
              </div>
            </div>
            
            {/* Action Guide */}
            <div className="bg-blue-50 p-4 border-t-4 border-blue-500">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">🔄</div>
                  <div className="text-xs font-bold text-blue-600">TILT HEAD</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">☝️</div>
                  <div className="text-xs font-bold text-blue-600">LIFT CHIN</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">🤏</div>
                  <div className="text-xs font-bold text-blue-600">PINCH NOSE</div>
                </div>
                <div className="bg-white rounded-lg p-2 border-2 border-blue-300">
                  <div className="text-2xl">💨</div>
                  <div className="text-xs font-bold text-blue-600">2 BREATHS</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'cycles':
        return (
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border-4 border-green-500 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-green-600 text-white py-3 px-6 text-center relative">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-8 h-8" />
                <span className="text-2xl font-black">STEP 5: REPEAT CYCLES</span>
                <Zap className="w-8 h-8" />
              </div>
              
              {/* Cycle Counter */}
              {isActive && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-green-700 text-white rounded-2xl shadow-2xl border-8 border-green-800 px-6 py-3 z-20">
                  <div className="text-3xl font-black">CYCLE {cycleCount + 1}</div>
                </div>
              )}
            </div>
            
            {/* Main Visual - Real Human Demonstration */}
            <div className="relative h-80 bg-white overflow-hidden flex pt-16">
              {/* Navigation arrows */}
              <button 
                onClick={previousStep}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-2xl hover:bg-green-700 transition-colors z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={nextStep}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-2xl hover:bg-green-700 transition-colors z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Compression Demonstration */}
              <div className="w-1/2 relative border-r-2 border-green-500">
                <img 
                  src={cprCompressions} 
                  alt="Person performing chest compressions" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-2 bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm shadow-lg">
                  COMPRESSIONS
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg">
                  30 PUSHES
                </div>
              </div>
              
               {/* Breathing Demonstration */}
               <div className="w-1/2 relative">
                  <img 
                    src={cprRescueBreathSimple} 
                    alt="Simple rescue breathing diagram - less graphic" 
                    className="w-full h-full object-contain"
                  />
                 <div className="absolute top-4 right-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm shadow-lg">
                   BREATHS
                 </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg">
                  2 BREATHS
                </div>
              </div>
              
              {/* Flow arrows */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-green-600 animate-pulse z-10 bg-white rounded-full p-2 shadow-lg">
                ↔️
              </div>
              
              {/* Critical warning */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-2xl font-black shadow-2xl border-4 border-red-700 animate-pulse text-center">
                ⚠️ DON'T STOP UNTIL EMS ARRIVES ⚠️
              </div>
            </div>
            
            {/* Cycle Guide */}
            <div className="bg-green-50 p-4 border-t-4 border-green-500">
              <div className="text-center space-y-2">
                <div className="text-2xl font-black text-green-600">30 COMPRESSIONS ➡️ 2 BREATHS ➡️ REPEAT</div>
                <div className="text-sm text-green-700 font-bold">Continue until emergency medical services arrive</div>
              </div>
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
