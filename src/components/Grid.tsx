'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from '../components/Grid.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

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

  // Compute favicon URLs synchronously to avoid hydration mismatch
  const computedFaviconUrls = useMemo(() => {
    const urls: {[key: string]: string} = {};
    
    sites.forEach(site => {
      if (!site.icon) {
        urls[site.url] = getFaviconUrl(site.url);
      }
    });
    return urls;
  }, [sites, getFaviconUrl]);

  // Only update state if it differs (helps with hydration)
  useEffect(() => {
    const urls: {[key: string]: string} = {};
    sites.forEach(site => {
      if (!site.icon) {
        urls[site.url] = getFaviconUrl(site.url);
      }
    });
    setFaviconUrls(prev => {
      const newUrls = { ...prev, ...urls };
      // Only update if actually different
      if (JSON.stringify(prev) !== JSON.stringify(newUrls)) {
        return newUrls;
      }
      return prev;
    });
  }, [sites, getFaviconUrl]);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/images/earth.png'; 
  };

  // Use computed URLs first, then state (ensures consistent SSR)
  const getImageSrc = (item: siteItem) => {
    return item.icon || computedFaviconUrls[item.url] || '/images/earth.png';
  };

  return (
    <div>
      <div className={classNames('content-center', styles.header)}>
        <h1>{label}</h1>
      </div>
      <div className={classNames('grid grid-cols-3 lg:grid-cols-6 gap-4', styles.container)}>
        {sites.map((item, index) => (
          <div key={`${label}-${index}`} className={styles.card}>
            <Link href={item.url} target='_blank'>
              <img 
                src={getImageSrc(item)} 
                alt={`Image for ${item.title}`} 
                className={styles.image}
                onError={handleImageError}
              />
              <h2 className={styles.title}>{item.title}</h2>
            </Link>
          </div>
        ))}
        <div className={styles.card}>
          <button 
            onClick={() => onAddNewClick(label)}
            className={styles['add-new-button']} // Add this class for styling
          >
            <div className={styles.image}>
              <FontAwesomeIcon icon={faCirclePlus} />          
            </div>
            <h2 className={styles.title}>Add new</h2>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grid;
