import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(e); // Save the event for later use
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null); // Reset the deferred prompt
      });
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size='small'
      onClick={handleInstallClick}
      disableElevation
      disabled={!deferredPrompt}
      sx={{ textTransform: "none", backgroundColor: "white", color: "black" }}
    >
      Install App
    </Button>
  );
};

export default InstallButton;
