import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Keep it on screen for 2.5 seconds, then fade out
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 2500);

    // Call onComplete after the fade out transition (500ms)
    const timer2 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-bg-base transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        <div className="relative group flex flex-col items-center">
          {/* Logo */}
          <div className="relative w-32 h-32 mb-8 animate-pulse">
            <div className="absolute inset-0 bg-brand-primary opacity-20 blur-xl rounded-full"></div>
            <img src="/logo.svg" alt="Cmdx24 Logo" className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(0,209,255,0.5)]" />
          </div>
          
          <h1 className="text-4xl font-mono font-black text-white tracking-[0.2em] uppercase text-center mb-2">Cmdx24</h1>
          <p className="font-mono text-brand-primary tracking-widest text-sm uppercase">Command Execution Engine</p>
          
          <div className="mt-12 w-48 h-1 bg-bg-active overflow-hidden">
            <div className="h-full bg-brand-primary animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="py-8 text-center">
        <p className="font-mono text-[10px] text-gray-500 tracking-[0.1em] uppercase">Developed by</p>
        <p className="font-mono text-xs font-bold text-gray-400 tracking-[0.1em] uppercase mt-1">Syed Faizan</p>
      </div>
    </div>
  );
};
