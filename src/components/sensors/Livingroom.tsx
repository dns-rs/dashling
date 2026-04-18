import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faDroplet, faComment, faCouch, faWifi } from '@fortawesome/free-solid-svg-icons';
import styles from './Livingroom.module.scss';

interface LivingroomDataType {
   temperature: number;
   feelsLike: number;
   humidity: number;
}

const sensor: string | undefined = process.env.NEXT_PUBLIC_SENSOR_LIVINGROOM;

const Livingroom = () => {
   const [LivingroomData, setLivingroomData] = useState<LivingroomDataType | null>(null);
   const [responseError, setResponseError] = useState(false)

   const fetchLivingroomData = async (retryCount = 0) => {
      try {
         const response = await axios.get(sensor!, {
            timeout: 5000,
         });
         setLivingroomData(response.data);
         console.log("Livingroom data:", response.data);
         setResponseError(false);
      } catch (error) {
         if (axios.isAxiosError(error)) {
            if (!error.response) {
               if (retryCount < 3) {
                  console.log(`Retrying... (${retryCount + 1}/3)`);
                  setTimeout(() => fetchLivingroomData(retryCount + 1), 1000);
                  return;
               } else {
                  console.error('Network error after retries:', error.message);
               }
            } else {
               console.error('Server responded with error status:', error.response.status);
            }
         } else {
            console.error('An unexpected error occurred:', error);
         }

         setLivingroomData(null);
         setResponseError(true);
      }
   };

   useEffect(() => {
      if (responseError) {
         return;
      }

      const intervalId = setInterval(fetchLivingroomData, 120000);
      fetchLivingroomData();
      return () => clearInterval(intervalId);

   }, [responseError]);

   const handleManualRestart = () => {      
      setResponseError(false);
   };

   return (
      <div className={styles['container']}>
         <div className={styles['header']}>
            <h1 style={{color: responseError ? 'rgb(158, 0, 0)' : 'white'}} onClick={handleManualRestart}><FontAwesomeIcon icon={faCouch} /></h1>
         </div>
         {LivingroomData ? (
            <div className={styles['weather-container']}>
               <div className={styles['weather-module']}>
                  <div className={styles['icons']}>
                     <FontAwesomeIcon icon={faThermometerHalf} />
                  </div>
                  <div className={styles['text']}>
                     {LivingroomData.temperature}°C
                  </div>
               </div>
               <div className={styles['weather-module']}>
                  <div className={styles['icons']}>
                        <span className={styles['icon-1']}><FontAwesomeIcon icon={faThermometerHalf} /> </span>
                        <span className={styles['icon-2']}><FontAwesomeIcon icon={faComment} /> </span>
                  </div>
                  <div className={styles['text']}>
                    {LivingroomData.feelsLike}°C
                  </div>
               </div>
               <div className={styles['weather-module']}>
                  <div className={styles['icons']}>
                     <FontAwesomeIcon icon={faDroplet} />
                  </div>
                  <div className={styles['text']}>
                    {LivingroomData.humidity}%
                  </div>
               </div>
            </div>
         ): (<div className={styles['scanner-text']}>Scanning... <span className={styles['scanner']}><FontAwesomeIcon icon={faWifi} spinPulse/></span></div>)}
      </div>
   );
};

export default Livingroom;
