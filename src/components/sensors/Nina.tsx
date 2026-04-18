import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faDroplet, faComment, faBroom, faWifi } from '@fortawesome/free-solid-svg-icons';
import styles from './Nina.module.scss';

interface NinaDataType {
   temperature: number;
   feelsLike: number;
   humidity: number;
}

const sensor: string | undefined = process.env.NEXT_PUBLIC_SENSOR_Nina;

const Nina = () => {
   const [NinaData, setNinaData] = useState<NinaDataType | null>(null);
   const [responseError, setResponseError] = useState(false);

   const fetchNinaData = async (retryCount = 0) => {
      try {
         const response = await axios.get(sensor!, {
            timeout: 5000,
         });
         setNinaData(response.data);
         console.log("Nina data:", response.data);
         setResponseError(false);
      } catch (error) {
         if (axios.isAxiosError(error)) {
            if (!error.response) {
               if (retryCount < 3) {
                  console.log(`Retrying... (${retryCount + 1}/3)`);
                  setTimeout(() => fetchNinaData(retryCount + 1), 1000);
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
        
         setNinaData(null);
         setResponseError(true);
      }
   };

   useEffect(() => {
      if (responseError) {
         return;
      }

      const intervalId = setInterval(fetchNinaData, 120000);
      fetchNinaData();
      return () => clearInterval(intervalId);

   }, [responseError]);

  
   const handleManualRestart = () => {      
      setResponseError(false);
   };

   return (
      <div className={styles['container']}>
         <div className={styles['header']}>          
            <h1 style={{color: responseError ? 'rgb(158, 0, 0)' : 'white'}} onClick={handleManualRestart}>
               <FontAwesomeIcon icon={faBroom} />
            </h1>
         </div>
         {NinaData ? (
            <div className={styles['weather-container']}>
               <div className={styles['weather-module']}>
                  <div className={styles['icons']}>
                     <FontAwesomeIcon icon={faThermometerHalf} />
                  </div>
                  <div className={styles['text']}>
                     {Math.round(NinaData.temperature)}°C
                  </div>
               </div>
               <div className={styles['weather-module']}>
                  <div className={styles['icons']}>
                        <span className={styles['icon-1']}><FontAwesomeIcon icon={faThermometerHalf} /> </span>
                        <span className={styles['icon-2']}><FontAwesomeIcon icon={faComment} /> </span>
                  </div>
                  <div className={styles['text']}>
                    {Math.round(NinaData.feelsLike)}°C
                  </div>
               </div>
               <div className={styles['weather-module']}>
                  <div className={styles['icons']}>
                     <FontAwesomeIcon icon={faDroplet} />
                  </div>
                  <div className={styles['text']}>
                    {Math.round(NinaData.humidity)}°C
                  </div>
               </div>
            </div>
         ): (<div className={styles['scanner-text']}>Scanning... <span className={styles['scanner']}><FontAwesomeIcon icon={faWifi} spinPulse/></span></div>)}
      </div>
   );
};

export default Nina;