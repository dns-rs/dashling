'use client';
import { useState, useEffect } from 'react';
import styles from './ModalGridCreate.module.scss';

interface ModalGridCreateProps {
  onSave: (gridLabel: string, siteTitle: string, siteUrl: string) => void;
}

const ModalGridCreate: React.FC<ModalGridCreateProps> = ({ onSave }) => {
  const [newGridLabel, setNewGridLabel] = useState('');
  const [newLabelInput, setNewLabelInput] = useState('');
  const [newSiteTitle, setNewSiteTitle] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [gridOptions, setGridOptions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const defaultUrls = JSON.parse(localStorage.getItem('defaultUrls') || '{}');
      const keys = Object.keys(defaultUrls);
      setGridOptions(keys);
    } catch (error) {
      console.error('Error parsing defaultUrls from localStorage:', error);
      setGridOptions([]);
    }
  }, []);

  const handleSave = () => {
    let finalGridLabel = newGridLabel;
    if (newGridLabel === 'new' && newLabelInput.trim()) {
      finalGridLabel = newLabelInput.trim();
    }

    if (finalGridLabel && newSiteTitle && newSiteUrl) {
      onSave(finalGridLabel, newSiteTitle, newSiteUrl);
      setNewGridLabel('');
      setNewLabelInput('');
      setNewSiteTitle('');
      setNewSiteUrl('');
    }
  };

  const handleInputBlur = () => {
    if (!newLabelInput.trim()) {
      setNewGridLabel('');
      setNewLabelInput('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newLabelInput.trim()) {
      setNewGridLabel(newLabelInput.trim());
      setNewLabelInput('');
    } else if (e.key === 'Escape') {
      setNewGridLabel('');
      setNewLabelInput('');
    }
  };

  return (
    <div className={styles['modal-content']}>
      <div className={styles['form-component']}>
        <label>Grid Label:</label>
        {newGridLabel === 'new' ? (
          <>
            <input 
              placeholder="Enter new grid label..." 
              value={newLabelInput}
              onChange={(e) => setNewLabelInput(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
            />
            <small style={{color: '#666', fontSize: '0.8em'}}>
              Press Enter to confirm, Escape to cancel
            </small>
          </>
        ) : (
          <select 
            value={newGridLabel} 
            onChange={(e) => setNewGridLabel(e.target.value)}
          >
            <option value="">Select a grid label...</option>
            {gridOptions.map((key) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
            <option value="new">+ New...</option>
          </select>
        )}
      </div>
      
      <div className={styles['form-component']}>
        <label>Site Title:</label>
        <input 
          placeholder="e.g. Steam" 
          value={newSiteTitle}
          onChange={(e) => setNewSiteTitle(e.target.value)}
        />
      </div>
      
      <div className={styles['form-component']}>
        <label>Site URL:</label>
        <input 
          placeholder="e.g. https://store.steampowered.com/" 
          value={newSiteUrl}
          onChange={(e) => setNewSiteUrl(e.target.value)}
        />
      </div>
      <div className={styles['modal-bottom']}>
        <button onClick={handleSave} className={styles['modal-button']}>
          Add Grid & Site
        </button>
      </div>
    </div>
  );
};

export default ModalGridCreate;
