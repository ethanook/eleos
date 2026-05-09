"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Languages, Volume2, ShieldCheck, Zap, Power, PowerOff, Navigation, AlertTriangle } from "lucide-react";
import { useSpeech, LanguageCode } from "@/hooks/use-speech";
import { CameraView } from "@/components/camera-view";
import { detectAndAnnounceObjects } from "@/ai/flows/object-detection-announcement";
import { cn } from "@/lib/utils";

export function EchoVisionUI() {
  const { currentLanguage, languageLabel, speak, cycleLanguage, vibrateWarning } = useSpeech();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState<string>("");
  const [isIntensiveWarning, setIsIntensiveWarning] = useState(false);

  // Helper to map X coordinate to Clock Time
  const getClockTime = (x: number) => {
    // 0 is 9 o'clock, 0.5 is 12 o'clock, 1 is 3 o'clock
    // Roughly mapping FOV to a 12-hour clock
    if (x < 0.1) return "9 o'clock";
    if (x < 0.25) return "10 o'clock";
    if (x < 0.4) return "11 o'clock";
    if (x < 0.6) return "12 o'clock";
    if (x < 0.75) return "1 o'clock";
    if (x < 0.9) return "2 o'clock";
    return "3 o'clock";
  };

  // Estimate distance based on bounding box height
  // Assumes a standard reference height where 100% height = 0.5m
  const estimateDistance = (height: number) => {
    if (height > 0.8) return 0.5;
    if (height > 0.5) return 1.0;
    if (height > 0.3) return 2.0;
    if (height > 0.15) return 5.0;
    return 10.0;
  };

  const handleFrame = useCallback(async (dataUri: string) => {
    if (isProcessing || !isAiActive) return;
    setIsProcessing(true);
    
    try {
      const result = await detectAndAnnounceObjects({ imageDataUri: dataUri });
      
      if (result.detectedObjects.length > 0) {
        // Priority: Closest obstacle at 12 o'clock
        const obstacles = result.detectedObjects.filter(obj => 
          (obj.name.toLowerCase().includes("wall") || obj.name.toLowerCase().includes("obstacle") || obj.name.toLowerCase().includes("person"))
        );

        const centralObstacle = obstacles.find(obj => obj.boundingBox.x > 0.4 && obj.boundingBox.x < 0.6);
        
        if (centralObstacle) {
          const dist = estimateDistance(centralObstacle.boundingBox.height);
          if (dist <= 1.0) {
            setIsIntensiveWarning(true);
            vibrateWarning(1.0);
            speak("STOP. Obstacle directly ahead.");
            setIsProcessing(false);
            return;
          }
        }
        
        setIsIntensiveWarning(false);

        // Regular announcement for most relevant object
        const best = result.detectedObjects[0];
        const clock = getClockTime(best.boundingBox.x);
        const dist = estimateDistance(best.boundingBox.height);
        
        let announcement = `${best.name} at ${clock}, ${dist} meters.`;
        if (best.name.toLowerCase().includes("door") || best.name.toLowerCase().includes("exit")) {
           announcement = `Exit available at ${clock}.`;
        }

        if (announcement !== lastAnnouncement) {
          setLastAnnouncement(announcement);
          speak(announcement);
        }
      }
    } catch (error) {
      console.error("AI processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isAiActive, lastAnnouncement, speak, vibrateWarning]);

  const toggleJourney = () => {
    const nextState = !isJourneyMode;
    setIsJourneyMode(nextState);
    setIsAiActive(nextState);
    speak(nextState ? "Starting journey. EchoVision is active – Safeguarding your journey." : "Journey ended.");
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Viewfinder area */}
      <div className="flex-grow relative h-[50vh]">
        <CameraView onFrame={handleFrame} isProcessing={isProcessing} isAiEnabled={isAiActive} />
        
        {/* Warning Overlays */}
        {isIntensiveWarning && (
          <div className="absolute inset-0 bg-destructive/40 flex items-center justify-center animate-pulse border-8 border-destructive">
            <div className="bg-background/90 p-10 rounded-full flex flex-col items-center gap-2">
              <AlertTriangle className="w-24 h-24 text-destructive" />
              <span className="text-4xl font-black text-destructive">STOP</span>
            </div>
          </div>
        )}

        {isJourneyMode && (
          <div className="absolute top-4 left-0 w-full flex justify-center px-4 pointer-events-none">
            <div className="bg-primary/20 backdrop-blur-md border border-primary/50 py-2 px-4 rounded-full flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Safeguarding Journey</span>
            </div>
          </div>
        )}

        {/* Detection Status */}
        {lastAnnouncement && isAiActive && !isIntensiveWarning && (
          <div className="absolute bottom-10 left-0 w-full flex justify-center px-6">
            <div className="bg-background/90 border-2 border-primary py-4 px-8 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm">
              <Volume2 className="w-8 h-8 text-primary" />
              <span className="text-lg font-bold text-foreground">{lastAnnouncement}</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobility Control Panel */}
      <div className="h-[50vh] bg-card border-t-4 border-primary/20 p-6 flex flex-col gap-4">
        <button
          onClick={toggleJourney}
          className={cn(
            "blind-first-button w-full border-4 text-2xl font-black uppercase flex-row gap-4 h-24",
            isJourneyMode 
              ? "bg-destructive/10 border-destructive text-destructive" 
              : "bg-primary/10 border-primary text-primary"
          )}
          aria-label={isJourneyMode ? "End Journey" : "Start Journey"}
        >
          {isJourneyMode ? <PowerOff className="w-10 h-10" /> : <Navigation className="w-10 h-10" />}
          {isJourneyMode ? "End Journey" : "Start Journey"}
        </button>

        <div className="grid grid-cols-2 gap-4 flex-grow">
          <button
            onClick={cycleLanguage}
            className="blind-first-button bg-accent/10 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            aria-label={`Switch Language. Currently ${languageLabel}.`}
          >
            <Languages className="w-10 h-10 mb-2" />
            <span className="text-xl font-black uppercase tracking-tighter">Language</span>
            <span className="text-sm font-bold opacity-80">{languageLabel}</span>
          </button>

          <button
            onClick={() => {
              setIsAiActive(!isAiActive);
              speak(isAiActive ? "Scanning paused" : "Scanning resumed");
            }}
            className={cn(
              "blind-first-button",
              isAiActive ? "bg-secondary/10 border-secondary text-secondary" : "bg-muted border-border text-muted-foreground"
            )}
            aria-label={isAiActive ? "Pause AI" : "Resume AI"}
          >
            {isAiActive ? <Zap className="w-10 h-10 mb-2" /> : <PowerOff className="w-10 h-10 mb-2" />}
            <span className="text-xl font-black uppercase tracking-tighter">{isAiActive ? "AI Live" : "AI Idle"}</span>
          </button>
        </div>

        <button
          onClick={() => speak("Journey mode active. I will alert you of obstacles and exits. A rapid vibration means stop immediately.")}
          className="blind-first-button w-full bg-muted border-border text-foreground h-16"
        >
          <span className="text-lg font-black uppercase tracking-widest">Help</span>
        </button>
      </div>

      <div className="sr-only" role="status" aria-live="assertive">
        {isIntensiveWarning ? "STOP. Obstacle directly ahead." : lastAnnouncement}
      </div>
    </div>
  );
}
