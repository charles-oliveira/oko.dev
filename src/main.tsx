import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OkoSystem from './components/OkoSystem.tsx'

const App = () => {
  return (
    <StrictMode>
      <OkoSystem />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />)
