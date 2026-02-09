'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from '../components/Grid.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';

interface siteItem {
  url: string;
  title: string;
  icon?: string;
}

interface GridProps {
  sites: siteItem[];
  label: string;
  onAddNewClick: (label: string) => void;
}

const Grid: React.FC<GridProps> = ({ sites, label, onAddNewClick  }) => {

  const [faviconUrls, setFaviconUrls] = useState<{[key: string]: string}>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableGrid, setEditableGrid] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllowDelete, setIsAllowDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');

  const getFaviconUrl = useCallback((siteUrl: string): string => {
    if (siteUrl.endsWith('.ico')) {
      return siteUrl;
    } 
    try {
      const hostname = new URL(siteUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch (error) {
      console.error('Invalid site URL:', siteUrl);
      return '/images/earth.png';
    }
  }, []);

  const computedFaviconUrls = useMemo(() => {
    const urls: {[key: string]: string} = {};
    
    sites.forEach(site => {
      if (!site.icon) {
        urls[site.url] = getFaviconUrl(site.url);
      }
    });
    return urls;
  }, [sites, getFaviconUrl]);

  useEffect(() => {
    const urls: {[key: string]: string} = {};
    sites.forEach(site => {
      if (!site.icon) {
        urls[site.url] = getFaviconUrl(site.url);
      }
    });
    setFaviconUrls(prev => {
      const newUrls = { ...prev, ...urls };
      if (JSON.stringify(prev) !== JSON.stringify(newUrls)) {
        return newUrls;
      }
      return prev;
    });
  }, [sites, getFaviconUrl]);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/images/earth.png'; 
  };

  const getImageSrc = (item: siteItem) => {
    return item.icon || computedFaviconUrls[item.url] || '/images/earth.png';
  };

  // Edit Mode

  useEffect(() => {
    if (isAllowDelete && itemToDelete) {
      
      const storageDataString = localStorage.getItem('defaultUrls');
      if (storageDataString) {
        const storageData = JSON.parse(storageDataString);        
        if (editableGrid in storageData && Array.isArray(storageData[editableGrid])) {
          
          const index = storageData[editableGrid].findIndex(item => item.title === itemToDelete);
          if (index !== -1) {
            storageData[editableGrid].splice(index, 1);
            localStorage.setItem('defaultUrls', JSON.stringify(storageData));
          }
        }
      }

      setIsAllowDelete(false);
      setIsModalOpen(false);
      setItemToDelete('');
      setIsEditMode(false);
      window.location.reload();
    }
  }, [isAllowDelete, itemToDelete, editableGrid]);

  const handleEditClick = (gridLabel: string) => {
    if (isEditMode == true) {
      setIsEditMode(false);
    }
    else {
      setIsEditMode(true);
    }

    if (!isEditMode) {
      setEditableGrid(gridLabel)
    };

  }

  const handleEditPosition = (label: string, item: object, index: number) => {
  console.log("label:", label, "index:", index);
  
  const storageDataString = localStorage.getItem('defaultUrls');
  if (storageDataString) {
    const storageData = JSON.parse(storageDataString);
    if (label in storageData && Array.isArray(storageData[label])) {
      if (index >= 0 && index < storageData[label].length) {
        setIsModalOpen(true);
        setItemToDelete(storageData[label][index].title);
      }
    }
  }
};

const handleConfirmDelete = () => {
  setIsAllowDelete(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setIsAllowDelete(false);
  setItemToDelete('');
};

  return (
    <div>
      <div className={classNames('content-center', styles.header)}>
        <h1
          onClick={() => {handleEditClick(label)}}
        >{label}</h1>
      </div>
      <div className={classNames('grid grid-cols-3 lg:grid-cols-6 gap-4', styles.container)}>
        {sites.map((item, index) => (
          <div key={`${label}-${index}`} className={styles.card}>
            {
              (!isEditMode)
              ?
                <Link href={item.url} target='_blank'>
                  <img 
                    src={getImageSrc(item)} 
                    alt={`Image for ${item.title}`} 
                    className={styles.image}
                    onError={handleImageError}
                  />
                  <h2 className={styles.title}>{item.title}</h2>
                </Link>  
              :
                <div className={styles['disabled']} onClick={() => handleEditPosition(label, item, index)}>
                  <img 
                    src={getImageSrc(item)} 
                    alt={`Image for ${item.title}`} 
                    className={styles.image}
                    onError={handleImageError}
                  />
                  <h2 className={styles.title}>{item.title}</h2>
                </div>  
            }
                      
          </div>
        ))}
        <div className={styles.card}>
          <button 
            onClick={() => onAddNewClick(label)}
            className={styles['add-new-button']}
          >
            <div className={styles.image}>
              <FontAwesomeIcon icon={faCirclePlus} />          
            </div>
            <h2 className={styles.title}>Add new</h2>
          </button>
        </div>
      </div>
     {isModalOpen && itemToDelete && (
        <div className={styles['modal']}>
          <Modal 
            label={`Delete ${itemToDelete}?`} 
            content={
              <div className={styles['modal-content']}>
                <h2>Are you sure you wish to delete this grid item: <span>{itemToDelete}</span>?</h2>
                <div className='flex flex-row justify-end gap-[10px]'>
                  <button className={styles['modal-button']} onClick={handleConfirmDelete}>Yes</button>
                  <button className={styles['modal-button']} onClick={handleCloseModal}>No</button>
                </div>
              </div>
            }
            onClose={handleCloseModal}
          />
        </div>
      )}

    </div>
  );
};

export default Grid;
