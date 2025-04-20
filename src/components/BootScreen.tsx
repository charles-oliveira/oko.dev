import { useEffect, useState } from 'react';
import '../styles/BootScreen.css';

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const messages = [
    '0KO.DEV INIT SYSTEM v1.0',
    'SYSTEM INFORMATION:',
    'OS: 0KO OS 4.2.1',
    'KERNEL: 5.15.0-0ko',
    'INITIALIZING SYSTEM...',
    'MEMORY TEST: OK',
    'DISK CHECK: OK',
    'NETWORK: ONLINE',
    'LOADING MODULES...',
    'TERMINAL INTERFACE',
    'NETWORK STACK',
    'SECURITY LAYER',
    'SYSTEM READY',
    'WELCOME TO 0KO.DEV'
  ];

  useEffect(() => {
    // Animação do olho - mais rápido
    const eyeInterval = setInterval(() => {
      setIsEyeOpen(prev => !prev);
    }, 1000 + Math.random() * 1000);

    // Animação das mensagens - mais rápida
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        setCurrentMessage(messages[messageIndex]);
        setMessageIndex(prev => prev + 1);
        setProgress((messageIndex / messages.length) * 100);
      } else {
        clearInterval(messageInterval);
        setIsComplete(true);
        setTimeout(onComplete, 500);
      }
    }, 300);

    return () => {
      clearInterval(eyeInterval);
      clearInterval(messageInterval);
    };
  }, [messageIndex, messages, onComplete]);

  return (
    <div className="boot-screen">
      <div className="boot-container">
        <div className="logo-container">
          <h1 className="logo-text">
            <div className="eye-container">
              <div className={`eye ${isEyeOpen ? 'open' : 'closed'}`}>
                <div className="pupil"></div>
              </div>
            </div>
            ko.dev
          </h1>
        </div>
        <div className="boot-content">
          <div className="boot-message">
            {currentMessage}
            <span className="boot-cursor">_</span>
          </div>
          <div className="boot-progress">
            <div 
              className="boot-progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootScreen;
