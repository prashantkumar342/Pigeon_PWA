// src/components/SplashScreen.jsx
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="splash-screen">
      <img src="/splashScreen.png" alt="Splash Logo" />
    </div>
  );
};

export default SplashScreen;
