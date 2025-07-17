import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Heart, Volume2, User, Hand, Smartphone, Eye, Stethoscope, Activity, Zap, Timer, ArrowRight, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

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
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border-4 border-red-500 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-red-600 text-white py-3 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-8 h-8" />
                <span className="text-2xl font-black">STEP 1: CALL 911</span>
                <Phone className="w-8 h-8" />
              </div>
            </div>
            
            {/* Main Visual */}
            <div className="relative h-80 bg-gradient-to-b from-blue-100 to-blue-200 p-6">
              {/* Scene Layout */}
              <div className="relative w-full h-full">
                {/* Person on ground - large and detailed */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Body */}
                    <div className="w-48 h-20 bg-orange-400 rounded-lg border-4 border-orange-600 relative shadow-lg">
                      <div className="absolute inset-2 bg-orange-300 rounded"></div>
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">VICTIM</div>
                    </div>
                    
                    {/* Head */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-skin-tone rounded-full border-4 border-skin-tone-dark shadow-lg">
                      {/* Eyes closed */}
                      <div className="absolute top-5 left-4 w-3 h-1 bg-gray-800 rounded-full"></div>
                      <div className="absolute top-5 right-4 w-3 h-1 bg-gray-800 rounded-full"></div>
                      {/* Mouth */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Rescuer checking responsiveness */}
                <div className="absolute top-8 left-8">
                  <div className="relative">
                    {/* Rescuer figure */}
                    <div className="w-20 h-20 bg-blue-300 rounded-full border-4 border-blue-500 shadow-lg">
                      <div className="absolute top-3 left-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-red-400 rounded-full"></div>
                    </div>
                    <div className="w-24 h-16 bg-blue-600 rounded-lg mt-2 border-2 border-blue-700 shadow-lg"></div>
                    
                    {/* Tapping motion */}
                    <div className="absolute -right-4 top-8 animate-bounce">
                      <div className="w-10 h-12 bg-blue-300 rounded-lg border-2 border-blue-400 transform rotate-45"></div>
                      <div className="absolute -bottom-2 -right-2 text-2xl animate-pulse">👋</div>
                    </div>
                  </div>
                </div>
                
                {/* Speech bubble */}
                <div className="absolute top-2 left-32 bg-white border-4 border-red-500 rounded-xl p-3 shadow-lg animate-pulse">
                  <div className="text-lg font-black text-red-600">"HEY! ARE YOU OK?"</div>
                  <div className="absolute bottom-0 left-8 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white transform translate-y-full"></div>
                </div>
                
                {/* Phone call visualization */}
                <div className="absolute top-8 right-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-green-500 rounded-full border-4 border-green-600 animate-pulse shadow-lg flex items-center justify-center">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-sm animate-pulse">
                      911
                    </div>
                  </div>
                </div>
                
                {/* Check breathing indicator */}
                <div className="absolute bottom-16 right-12">
                  <div className="bg-yellow-400 border-2 border-yellow-600 rounded-lg p-2 animate-pulse">
                    <Eye className="w-6 h-6 text-yellow-800" />
                    <div className="text-xs font-bold text-yellow-800">CHECK BREATHING</div>
                  </div>
                </div>
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
            
            {/* Main Visual - Ultra close-up of chest and hands */}
            <div className="relative h-80 bg-gradient-to-b from-orange-100 to-orange-200 p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Victim's chest - HUGE and detailed */}
                <div className="relative">
                  <div className="w-80 h-40 bg-orange-400 rounded-2xl border-4 border-orange-600 shadow-2xl relative">
                    {/* Anatomical markers */}
                    <div className="absolute top-6 left-16 w-4 h-4 bg-orange-700 rounded-full shadow-inner"></div>
                    <div className="absolute top-6 right-16 w-4 h-4 bg-orange-700 rounded-full shadow-inner"></div>
                    
                    {/* Center line guide */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-red-500 opacity-60 rounded-full"></div>
                    
                    {/* Compression target zone */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 border-red-500 rounded-full bg-red-100 opacity-80 animate-pulse flex items-center justify-center">
                      <div className="text-red-700 font-black text-sm">TARGET</div>
                    </div>
                    
                    {/* Ribs visualization */}
                    <div className="absolute inset-4 opacity-30">
                      <div className="w-full h-1 bg-orange-800 rounded mb-2"></div>
                      <div className="w-full h-1 bg-orange-800 rounded mb-2"></div>
                      <div className="w-full h-1 bg-orange-800 rounded mb-2"></div>
                      <div className="w-full h-1 bg-orange-800 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Hands positioning - DETAILED */}
                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                    {/* Bottom hand */}
                    <div className="relative w-32 h-40 bg-blue-300 rounded-2xl border-4 border-blue-500 shadow-2xl animate-pulse">
                      <div className="absolute top-4 left-4 right-4 h-12 bg-blue-400 rounded-xl shadow-inner"></div>
                      {/* Heel of hand indicator */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        HEEL
                      </div>
                      {/* Fingers */}
                      <div className="absolute bottom-0 left-2 w-4 h-8 bg-blue-400 rounded-lg"></div>
                      <div className="absolute bottom-0 left-8 w-4 h-8 bg-blue-400 rounded-lg"></div>
                      <div className="absolute bottom-0 right-8 w-4 h-8 bg-blue-400 rounded-lg"></div>
                      <div className="absolute bottom-0 right-2 w-4 h-8 bg-blue-400 rounded-lg"></div>
                    </div>
                    
                    {/* Top hand - interlaced */}
                    <div className="absolute top-8 left-4 w-24 h-32 bg-blue-200 rounded-xl border-4 border-blue-400 shadow-xl opacity-90">
                      <div className="absolute top-2 left-2 right-2 h-8 bg-blue-300 rounded-lg shadow-inner"></div>
                      {/* Interlaced fingers pattern */}
                      <div className="absolute bottom-0 left-1 w-3 h-6 bg-blue-300 rounded"></div>
                      <div className="absolute bottom-0 left-6 w-3 h-6 bg-blue-300 rounded"></div>
                      <div className="absolute bottom-0 right-6 w-3 h-6 bg-blue-300 rounded"></div>
                      <div className="absolute bottom-0 right-1 w-3 h-6 bg-blue-300 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Position indicators */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold shadow-lg">
                    ✋ HEEL OF HAND
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold shadow-lg">
                    🎯 CENTER CHEST
                  </div>
                  <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold shadow-lg animate-pulse">
                    ⚠️ BETWEEN NIPPLES
                  </div>
                </div>
                
                {/* Arm position reminder */}
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-2 rounded-lg font-bold shadow-lg border-2 border-yellow-600">
                  💪 ARMS STRAIGHT
                </div>
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
              
              {/* MASSIVE Timer Display */}
              {isActive && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-red-700 text-white rounded-2xl shadow-2xl border-8 border-red-800 px-8 py-4 z-20">
                  <div className="text-6xl font-black animate-pulse">{compressionCount}</div>
                  <div className="text-xl font-bold">/ 30</div>
                </div>
              )}
            </div>
            
            {/* Main Visual - Compression Action */}
            <div className="relative h-80 bg-gradient-to-b from-red-100 to-red-200 p-6 pt-16">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Victim's chest with compression visualization */}
                <div className="relative">
                  <div className="w-64 h-32 bg-orange-400 rounded-2xl border-4 border-orange-600 shadow-2xl relative">
                    <div className="absolute inset-2 bg-orange-300 rounded-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-800 font-bold">CHEST</div>
                    
                    {/* Compression depth indicator */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                      <div className="text-red-600 font-black text-lg">2"</div>
                      <div className="w-2 h-12 bg-red-500 rounded-full shadow-inner"></div>
                      <div className="text-red-600 font-black text-sm">MIN</div>
                    </div>
                    
                    {/* Compression waves */}
                    {isActive && (
                      <div className="absolute inset-0 bg-red-300 rounded-xl opacity-50 animate-[compress_0.5s_ease-in-out_infinite]"></div>
                    )}
                  </div>
                  
                  {/* Hands performing compressions - ANIMATED */}
                  <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                    isActive ? 'animate-[compress_0.5s_ease-in-out_infinite]' : ''
                  }`}>
                    <div className="relative">
                      {/* Arms coming down */}
                      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-6 h-32 bg-blue-500 rounded-full shadow-lg"></div>
                      
                      {/* Hands stack */}
                      <div className="w-28 h-32 bg-blue-300 rounded-2xl border-4 border-blue-500 shadow-2xl relative">
                        <div className="absolute top-4 left-2 right-2 h-10 bg-blue-400 rounded-xl shadow-inner"></div>
                        
                        {/* Force arrows */}
                        {isActive && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-red-600 font-black text-lg animate-bounce">
                            ⬇️ PUSH! ⬇️
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rate metronome */}
                <div className="absolute top-4 right-4">
                  <div className={`w-12 h-12 rounded-full border-4 shadow-lg ${
                    isActive ? 'bg-green-500 border-green-600 animate-pulse' : 'bg-gray-400 border-gray-500'
                  }`}></div>
                  <div className="text-center mt-2">
                    <div className="text-green-600 font-bold text-sm">100-120</div>
                    <div className="text-green-600 font-bold text-xs">/min</div>
                  </div>
                </div>
                
                {/* Key reminders */}
                <div className="absolute bottom-4 left-4 space-y-2">
                  <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold shadow-lg animate-bounce">
                    💥 HARD & FAST
                  </div>
                  <div className="bg-yellow-500 text-black px-3 py-2 rounded-lg font-bold shadow-lg">
                    ↩️ FULL RECOIL
                  </div>
                </div>
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
            
            {/* Main Visual - Airway Management */}
            <div className="relative h-80 bg-gradient-to-b from-blue-100 to-blue-200 p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close-up head and airway */}
                <div className="relative">
                  {/* Head positioned for airway opening */}
                  <div className="w-48 h-32 bg-skin-tone rounded-full border-4 border-skin-tone-dark shadow-2xl transform -rotate-12 relative">
                    {/* Facial features */}
                    <div className="absolute top-6 left-8 w-3 h-3 bg-gray-800 rounded-full"></div>
                    <div className="absolute top-6 right-12 w-3 h-3 bg-gray-800 rounded-full"></div>
                    
                    {/* Nose */}
                    <div className="absolute top-8 right-8 w-4 h-6 bg-skin-tone-dark rounded shadow-inner"></div>
                    
                    {/* Mouth open for breathing */}
                    <div className="absolute bottom-6 right-12 w-8 h-4 bg-red-400 rounded-full border-2 border-red-500 shadow-inner"></div>
                    
                    {/* Airway visualization */}
                    <div className="absolute bottom-0 right-6 w-2 h-8 bg-pink-300 rounded-full opacity-70"></div>
                  </div>
                  
                  {/* Hand on forehead - tilting head */}
                  <div className="absolute -top-8 left-8 w-16 h-12 bg-blue-300 rounded-lg border-2 border-blue-400 shadow-lg">
                    <div className="absolute top-2 left-2 right-2 h-4 bg-blue-400 rounded shadow-inner"></div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                      TILT
                    </div>
                  </div>
                  
                  {/* Hand lifting chin */}
                  <div className="absolute bottom-4 right-2 w-12 h-10 bg-blue-300 rounded-lg border-2 border-blue-400 shadow-lg">
                    <div className="absolute top-1 left-1 right-1 h-3 bg-blue-400 rounded shadow-inner"></div>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                      LIFT
                    </div>
                  </div>
                  
                  {/* Hand pinching nose */}
                  <div className="absolute top-4 right-4 w-8 h-10 bg-blue-300 rounded border-2 border-blue-400 shadow-lg animate-pulse">
                    <div className="absolute top-1 left-1 right-1 h-3 bg-blue-400 rounded shadow-inner"></div>
                    <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                      PINCH
                    </div>
                  </div>
                  
                  {/* Breath visualization */}
                  <div className="absolute -right-16 top-8 animate-pulse">
                    <div className="text-5xl">💨</div>
                    <div className="text-center text-blue-600 font-bold text-sm">1 SEC</div>
                  </div>
                </div>
                
                {/* Step-by-step guide */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg">
                    <div className="text-blue-600 font-bold text-sm">1️⃣ TILT HEAD BACK</div>
                  </div>
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg">
                    <div className="text-blue-600 font-bold text-sm">2️⃣ LIFT CHIN UP</div>
                  </div>
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg">
                    <div className="text-blue-600 font-bold text-sm">3️⃣ PINCH NOSE</div>
                  </div>
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg">
                    <div className="text-blue-600 font-bold text-sm">4️⃣ SEAL & BREATHE</div>
                  </div>
                </div>
                
                {/* Breath counter */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-2xl p-4 shadow-2xl border-4 border-blue-700">
                  <div className="text-3xl font-black">2</div>
                  <div className="text-sm font-bold">BREATHS</div>
                </div>
                
                {/* Timing emphasis */}
                <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg border-2 border-yellow-600 animate-pulse">
                  ⏱️ 1 SECOND EACH
                </div>
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
            
            {/* Main Visual - Cycle Flow */}
            <div className="relative h-80 bg-gradient-to-b from-green-100 to-green-200 p-6 pt-16">
              <div className="relative w-full h-full">
                {/* Two-phase demonstration */}
                <div className="absolute inset-8 grid grid-cols-2 gap-8">
                  {/* Compression Phase */}
                  <div className="relative bg-red-100 border-4 border-red-500 rounded-2xl p-4 shadow-2xl">
                    <div className="text-center mb-4">
                      <div className="text-lg font-black text-red-600">COMPRESSIONS</div>
                    </div>
                    
                    {/* Mini compression demo */}
                    <div className="relative flex items-center justify-center h-24">
                      <div className="w-24 h-16 bg-orange-400 rounded-lg border-2 border-orange-500 shadow-lg"></div>
                      <div className={`absolute -top-8 w-12 h-16 bg-blue-300 rounded-lg border-2 border-blue-400 shadow-lg ${
                        isActive ? 'animate-bounce' : ''
                      }`}></div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="text-4xl font-black text-red-600">30</div>
                      <div className="text-sm font-bold text-red-500">PUSHES</div>
                    </div>
                  </div>
                  
                  {/* Breathing Phase */}
                  <div className="relative bg-blue-100 border-4 border-blue-500 rounded-2xl p-4 shadow-2xl">
                    <div className="text-center mb-4">
                      <div className="text-lg font-black text-blue-600">BREATHS</div>
                    </div>
                    
                    {/* Mini breathing demo */}
                    <div className="relative flex items-center justify-center h-24">
                      <div className="w-20 h-12 bg-skin-tone rounded-full border-2 border-skin-tone-dark shadow-lg transform -rotate-12"></div>
                      <div className="absolute -right-4 top-4 text-3xl animate-pulse">💨</div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="text-4xl font-black text-blue-600">2</div>
                      <div className="text-sm font-bold text-blue-500">BREATHS</div>
                    </div>
                  </div>
                </div>
                
                {/* Flow arrows */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-green-600 animate-pulse z-10">
                  ↔️
                </div>
                
                {/* Critical warning */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-2xl font-black shadow-2xl border-4 border-red-700 animate-pulse text-center">
                  ⚠️ DON'T STOP UNTIL EMS ARRIVES ⚠️
                </div>
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
