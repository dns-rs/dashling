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
  const [isSessionPrivate, setIsSessionPrivate] = useState(process.env.NEXT_PUBLIC_PRIVATE_MODE);
  
  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);
  const [activeUrls, setActiveUrls] = useState<{ [key: string]: Array<{ title: string; url: string }> }>({});

  const checkAndLoadPrivateJson = async () => {
    setIsLoadingPrivate(true);
    if (isSessionPrivate == 'true') {     
      try {
        const response = await fetch('/data/private_shortcuts.json');        
        if (response.ok) {          
          const privateJson = await response.json();
          console.log(privateJson)
          localStorage.setItem('defaultUrls', JSON.stringify(privateJson));
          setActiveUrls(privateJson);
          console.log('Loaded private shortcuts');
        } else {
          console.log('Private shortcuts not found - public mode');
        }
      } catch (error) {
        console.error('Error loading private shortcuts:', error);
      }
      finally {
        setIsLoadingPrivate(false);
      }
    }
    
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('defaultUrls');
        if (stored) {
          console.log("got localstorage")
          setActiveUrls(JSON.parse(stored));
        }
        else {
          checkAndLoadPrivateJson();
        }
      } catch (error) {
        console.error('Failed to parse localStorage:', error);
      }
    }
  }, []);
  
  const handleAddGrid = async (gridLabel: string, siteTitle: string, siteUrl: string) => {
    if (isLoadingPrivate) {
      console.log('Waiting for initial load to complete...');
      return;
    }

    const newItem = { title: siteTitle, url: siteUrl }; 
    
    const stored = localStorage.getItem('defaultUrls');
    let grid: { [key: string]: any[] } = {}; 

    if (stored) {
      grid = JSON.parse(stored);
    }

    if (!grid[gridLabel]) {
      grid[gridLabel] = [];
    }
    grid[gridLabel].push(newItem);
    
    localStorage.setItem('defaultUrls', JSON.stringify(grid));
    window.location.reload();
  };

  const handleAddNewClick = (gridLabel: string) => {    
    setIsLoadingPrivate(false);
    setSelectedLabel(gridLabel);
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasUrls = Object.keys(activeUrls).length > 0 || localStorage.getItem('defaultUrls') !== null;
    const sitesDiv = document.getElementById('sites');
    const defaultDiv = document.getElementById('loader_buttons');

    if (sitesDiv) {
      sitesDiv.style.display = hasUrls ? 'block' : 'none';       
    }

    if (defaultDiv) {
      defaultDiv.style.display = hasUrls ? 'none' : 'flex';
    }
  }, [activeUrls, isLoadingPrivate]);

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