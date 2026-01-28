import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faDroplet, faComment, faCross, faWifi } from '@fortawesome/free-solid-svg-icons';
import styles from './Livingroom.module.scss';

interface LivingroomDataType {
   temperature: number;
   feelsLike: number;
   humidity: number;
}

const sensor: string | undefined = process.env.NEXT_PUBLIC_SENSOR_LIVINGROOM;

const Livingroom = () => {
   const [LivingroomData, setLivingroomData] = useState<LivingroomDataType | null>(null);

   const fetchLivingroomData = async (retryCount = 0) => {
      try {
         const response = await axios.get(sensor!, {
            timeout: 5000,
         });
         setLivingroomData(response.data);
         console.log("Livingroom data:", response.data);
      } catch (error) {
         if (axios.isAxiosError(error)) {
            if (!error.response) {
               if (retryCount < 3) {
                  setTimeout(() => fetchLivingroomData(retryCount + 1), 1000);
               } else {
                  console.error('Network error:', error);
               }
            } else {
               console.error('Error response:', error.response);
            }
         } else {
            console.error('Unknown error:', error);
         }
      }
   };

   useEffect(() => {
      fetchLivingroomData();
      const intervalId = setInterval(fetchLivingroomData, 120000);
      return () => clearInterval(intervalId);
   }, []);

   return (
      <div className={styles['container']}>
         <div className={styles['header']}>
            <h1><FontAwesomeIcon icon={faCross} /></h1>
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
         ):(<>Initializing... <span className={styles['scanner']}><FontAwesomeIcon icon={faWifi} spinPulse/></span></>)}
      </div>
   );
};

export default Livingroom;
