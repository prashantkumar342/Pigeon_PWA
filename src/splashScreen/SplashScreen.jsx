// src/components/SplashScreen.jsx
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div id="splash-screen" className=" h-screen fixed inset-0 bg-white justify-between flex flex-col z-50">
      <div className='p-4'>
        <div className='w-fit m-auto'>
          <img src="../../assets/pigeon.png" alt="Splash Screen" className="
      w-[170px]" />
        </div>
        <div
          className='mt-4 text-center'
        >
          <Typography
            sx={{ fontSize: 20 }}
          >
            Pigeon Messenger
            Your Realtime Pigeon,
          </Typography>
        </div>
      </div>
      <div>
        <div className='p-4 '>
          <div className=' w-fit m-auto'>
            <img src="../../assets/pigeonCloud.png" alt="" className="
      w-[120px]" />
          </div>
          <div
            className=' text-center'
          >
            <Typography
              sx={{ fontSize: 14 }}
            >
              An OpenSource Messaging PWA Developed By Prashant Tuhania
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
