'use client';

import React, { useState } from 'react';

export default function EleosInterface() {
  const [isScanning, setIsScanning] = useState(false);
  const [alertRange, setAlertRange] = useState(2.5);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans p-6 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-900">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 mt-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-cyan-400">ELEOS</h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Spatial Awareness</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-500">EDGE AI ACTIVE</span>
        </div>
      </header>

      {/* Main Activation Button */}
      <div className="flex-grow flex flex-col items-center justify-center mb-8">
        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
            isScanning 
              ? 'bg-red-500 shadow-red-500/50 scale-95' 
              : 'bg-cyan-500 shadow-cyan-500/50 scale-100'
          }`}
        >
          {/* Ripple Effect when scanning */}
          {isScanning && (
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></div>
          )}
          
          <span className="text-white font-bold text-3xl tracking-wide">
            {isScanning ? 'STOP' : 'START'}
          </span>
          <span className="text-white/80 font-medium mt-2">
            {isScanning ? 'Scanning Environment' : 'Tap to Navigate'}
          </span>
        </button>
      </div>

      {/* Settings / The "Safety Bubble" */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Safety Bubble</h2>
        
        {/* Range Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <label className="font-medium text-slate-400">Alert Radius</label>
            <span className="text-2xl font-bold text-cyan-400">{alertRange} m</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            step="0.5"
            value={alertRange}
            onChange={(e) => setAlertRange(e.target.value)}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-2 font-bold">
            <span>1m (Crowds)</span>
            <span>5m (Open Streets)</span>
          </div>
        </div>

        {/* Feedback Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-slate-800">
            <div>
              <p className="font-bold text-white text-lg">Adaptive Haptics</p>
              <p className="text-xs text-slate-500">Vibrates as objects approach</p>
            </div>
            <button 
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              className={`w-14 h-8 rounded-full transition-colors ${hapticsEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform transform ${hapticsEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-slate-800">
            <div>
              <p className="font-bold text-white text-lg">Spatial Audio</p>
              <p className="text-xs text-slate-500">3D directional sound alerts</p>
            </div>
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`w-14 h-8 rounded-full transition-colors ${audioEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform transform ${audioEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Nav Mockup */}
      <div className="mt-8 flex justify-around text-slate-500 pb-4">
        <div className="flex flex-col items-center text-cyan-500">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          <span className="text-xs font-bold">Scan</span>
        </div>
        <div className="flex flex-col items-center hover:text-white transition-colors cursor-pointer">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="text-xs font-bold">Logs</span>
        </div>
        <div className="flex flex-col items-center hover:text-white transition-colors cursor-pointer">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="text-xs font-bold">Hardware</span>
        </div>
      </div>
    </div>
  );
}
