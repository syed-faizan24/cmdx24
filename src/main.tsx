import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SplashScreen } from './components/SplashScreen.tsx'

import { useState } from 'react'

const RootApp = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {/* Mount App in the background so it can load data, but keep it hidden visually if we wanted, or just render it alongside since splash is z-50 fixed */}
      <App />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
