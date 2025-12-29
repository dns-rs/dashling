import styles from './index.module.scss';

import Weather from '../components/Weather'
import Bedroom from '@/components/Bedroom';
import Livingroom from '@/components/Livingroom';

import Grid from '../components/Grid'
import Modal from '@/components/Modal';
import ModalGridCreate from '@/components/ModalGridCreate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpiral, faDatabase, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FALLBACK URLS START
  const adult = [     
    { title: 'Szamlak', url: 'https://docs.google.com/spreadsheets/d/1xIM8L0G-buGNm7-HxfxHFqTVuPZ9ZqRYyj3Ny2ycHRQ/edit?gid=0#gid=0' },
    { title: 'Hazpez', url: 'https://docs.google.com/spreadsheets/d/1L-Evhx_K1UmL2T-bU-roBA37RJvs3I3XRN3cr-Y5iik/edit?gid=0#gid=0' },
    { title: 'Mikő', url: 'https://docs.google.com/spreadsheets/d/1tYgTRZUzh63EzuxvB_PrL1ABydvcPs42EkuryKoZ6kA/edit?gid=0#gid=0'},
    { title: 'Autoiskola', url: 'https://docs.google.com/spreadsheets/d/1D5bfq2RC5gaxviJhiuT9MyzDdRHjrC2dbBZheiyPX-k/edit?gid=0#gid=0'}
  ];

  const favorites = [
    { title: 'News', url: 'https://feedly.com/i/collection/content/user/95612b87-9915-4992-b9ce-5757e298c534/category/global.all'},    
    { title: 'YouTube', url: 'https://www.youtube.com/' },    
    { title: 'Reddit', url: 'https://www.reddit.com/' },
    { title: 'Facebook', url: 'https://www.facebook.com/' },
    { title: 'Instagram', url: 'https://www.instagram.com/' },
    { title: 'Bandcamp', url: 'https://bandcamp.com/alg0rh1tm' },    
    { title: 'SoundCloud', url: 'https://soundcloud.com/feed/' },
    { title: 'Discogs', url: 'https://www.discogs.com/my' },
    { title: 'iMDb', url: 'https://www.imdb.com/user/ur36337716/?ref_=nv_usr_prof_2' },
    { title: 'Goodreads', url: 'https://www.goodreads.com/' },
    { title: 'Netflix', url: 'https://www.netflix.com/' },
  ]

  const lab = [
    { title: 'Next', icon: 'favicon.ico', url: 'http://192.168.1.40:3000'},
    { title: 'Dev', icon: '/images/earth.png', url: 'http://192.168.1.40/dev/'},
    { title: 'Cronos-4', icon: 'http://192.168.1.40/dev/2021/timetravel/img/favicon/favicon.ico', url: 'http://192.168.1.40/dev/2021/timetravel'},
    { title: 'LoanWolf', icon: 'http://192.168.1.40/dev/2022/LoanWolf/img/favicon/favicon.ico', url: 'http://192.168.1.40/dev/2022/LoanWolf'},
    { title: 'Guardian', icon: '/images/earth.png', url: 'http://guardian.test/'},
    { title: 'GDSprite Animator', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Godot_icon.svg', url: 'http://192.168.1.40:3002'}
  ]

  const defaultUrls = {
    'adult': adult,
    'favorites': favorites,
    'lab': lab
  }

  const [activeUrls, setActiveUrls] = useState<typeof defaultUrls>(defaultUrls);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('defaultUrls');
        if (stored) {
          setActiveUrls(JSON.parse(stored) as typeof defaultUrls);
        }
      } catch (error) {
        console.error('Failed to parse localStorage:', error);
      }
    }
  }, []);

  // FALLBACK URLS END
  interface Site {
    title: string;
    url: string;
  }
  
  // const handleAddGrid = (gridLabel: string, siteTitle: string, siteUrl: string) => {
  //   const newGrid = {
  //     [gridLabel]: [{ title: siteTitle, url: siteUrl }]
  //   };
    
  //   const updatedUrls = {
  //     ...activeUrls,
  //     ...newGrid
  //   };

  //   const stored = localStorage.getItem('defaultUrls');
  //   if (stored) {
  //     let grid = JSON.parse(stored);
  //     if (!(gridLabel in grid )) {
  //       grid[gridLabel] = newGrid[gridLabel];
  //       localStorage.setItem('defaultUrls', JSON.stringify(grid));
  //     } 
  //     else {
  //       grid[gridLabel].push(newGrid[gridLabel][0]); 
  //       localStorage.setItem('defaultUrls', JSON.stringify(grid));
  //     }      
  //   }
  //   else{ 
  //     let grid = [];
  //     grid[gridLabel].push(newGrid[gridLabel][0]); 
  //     localStorage.setItem('defaultUrls', JSON.stringify(grid));
  //   }
    
    
  //   window.location.reload();
  // };

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

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // event.currentTarget.src = '/images/earth.png'; 
  };

  function loadFromStorage() {
    console.log("sending to localstorage");

    if (typeof window !== 'undefined') {
      const storedUrls = localStorage.getItem('defaultUrls');
      const sitesDiv = document.getElementById('sites');
      const loaderDiv = document.getElementById('loader_buttons');
      
      if (storedUrls) {
        const parsedUrls = JSON.parse(storedUrls);
        console.log('Loaded from storage:', parsedUrls);
      }
      else {
        localStorage.setItem('defaultUrls', JSON.stringify(defaultUrls));
      }
      
      if (sitesDiv) sitesDiv.style.display = 'block';
      if (loaderDiv) loaderDiv.style.display = 'none';
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
         <button type='button' onClick={loadFromStorage}><FontAwesomeIcon icon={faDatabase}  /></button>
         <button type='button' onClick={() => handleAddNewClick('newGrid')}><FontAwesomeIcon icon={faSquarePlus} /></button>
        </div>
      </div>
      {isModalOpen && (
      <div className={styles['modal']}>
        <Modal 
          label="Add New Grid" 
          content={<ModalGridCreate onSave={handleAddGrid} />}
          onClose={handleCloseModal}
        />
      </div>
    )}
      
    </div>    
  );
}
