import styles from './index.module.scss';

import Weather from '../components/Weather'
import Bedroom from '@/components/Bedroom';
import Livingroom from '@/components/Livingroom';

import Grid from '../components/Grid'
import Modal from '@/components/Modal';
import ModalGridCreate from '@/components/ModalGridCreate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpiral, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('')

  const [activeUrls, setActiveUrls] = useState<{ [key: string]: Array<{ title: string; url: string }> }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('defaultUrls');
        if (stored) {
          setActiveUrls(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to parse localStorage:', error);
      }
    }
  }, []);

  interface Site {
    title: string;
    url: string;
  }
  
  const handleAddGrid = (gridLabel: string, siteTitle: string, siteUrl: string) => {
    const newItem = { title: siteTitle, url: siteUrl };  // Single item to add
    
    const stored = localStorage.getItem('defaultUrls');
    let grid: { [key: string]: any[] } = {};  // Object with label -> array
    
    if (stored) {
      grid = JSON.parse(stored);
    }
    
    // Initialize array if missing, then always push
    if (!grid[gridLabel]) {
      grid[gridLabel] = [];
    }
    grid[gridLabel].push(newItem);
    
    localStorage.setItem('defaultUrls', JSON.stringify(grid));
    window.location.reload();
  };

  const handleAddNewClick = (gridLabel: string) => {    
    setSelectedLabel(gridLabel);
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageUrlsExists = localStorage.getItem('defaultUrls') !== null;
      const sitesDiv = document.getElementById('sites');
      const defaultDiv = document.getElementById('loader_buttons');

      if (storageUrlsExists) {
        console.log('defaultUrls exists in local storage');
      } 

      if (sitesDiv) {
        sitesDiv.style.display = storageUrlsExists ? 'block' : 'none';       
      }

      if (defaultDiv) {
        defaultDiv.style.display = storageUrlsExists ? 'none' : 'flex';
      }
    }
  }, []);

  function getFaviconUrl(siteUrl: string): string | null {
    if (siteUrl.endsWith('.ico')) {
      return siteUrl;
    } else {
      try {
        const hostname = new URL(siteUrl).hostname;
        const url = `https://www.google.com/s2/favicons?domain=${hostname}`
        return url;
      } catch (error) {
        console.error('Invalid site URL:', siteUrl);
        return '/images/earth.png';
      }
    }
  }

  return (
    <div className={styles['wrapper']}>
      <div className={styles['loader']}><FontAwesomeIcon icon={faSpiral} spin /></div>
      <div className={styles['main-container']}>
        <div className={styles['left']}>
         <div className={`${styles['weather-component']}`}>      
              <Weather />                  
              <div className={styles['sensor-component']}>
                <Livingroom />
                <Bedroom />
              </div>             
          </div>
        </div>

        <div id="sites" className={styles['right']}>
          {Object.entries(activeUrls).map(([key, sites]) => (
            <Grid key={key} sites={sites} label={key} onAddNewClick={handleAddNewClick}/>
          ))}
        </div>
        
        <div id="loader_buttons" className={styles['default-button-holder']}>
         <button type='button' onClick={() => handleAddNewClick('newGrid')}><FontAwesomeIcon icon={faSquarePlus} /></button>
        </div>
      </div>
      {isModalOpen && (
      <div className={styles['modal']}>
        <Modal 
          label="Add New Grid" 
          content={<ModalGridCreate onSave={handleAddGrid} selected={selectedLabel} />}
          onClose={handleCloseModal}          
        />
      </div>
    )}
      
    </div>    
  );
}