'use client'
import React, { useState, useEffect } from 'react';
import styles from "../settings/Settings.module.scss";
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faGear } from '@fortawesome/free-solid-svg-icons';

interface ColorSettings {
    error: string;
    accent: string;
    background: string;
    text: string;
}

const DEFAULT_COLORS: ColorSettings = {
    error: '#9e0000',
    accent: '#2a2a2a',
    background: '#353535',
    text: '#ffffff'
};

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [colors, setColors] = useState<ColorSettings>(DEFAULT_COLORS);

    // Load colors from localStorage on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('siteColorConfig');
        if (savedConfig) {
            try {
                const parsed: ColorSettings = JSON.parse(savedConfig);
                setColors(parsed);
                applyColorsToDOM(parsed);
            } catch (e) {
                console.error("Failed to parse saved color config", e);
            }
        } else {
            applyColorsToDOM(DEFAULT_COLORS);
        }
    }, []);

    const applyColorsToDOM = (colorMap: ColorSettings) => {
        const root = document.documentElement;
        root.style.setProperty('--error', colorMap.error);
        root.style.setProperty('--accent', colorMap.accent);
        root.style.setProperty('--background', colorMap.background);
        root.style.setProperty('--text', colorMap.text);
    };

    const handleColorChange = (key: keyof ColorSettings, value: string) => {
        const updatedColors = { ...colors, [key]: value };
        setColors(updatedColors);
        applyColorsToDOM(updatedColors);

        // Save settings into JSON format in localStorage
        localStorage.setItem('siteColorConfig', JSON.stringify(updatedColors));
    };

    const toggleSettings = () => {
        setIsOpen(!isOpen);
    };

    const handleExport = () => {
        const downloadJson = (filename: string, dataString: string | null, fallbackData: object) => {
            const dataToExport = dataString ? dataString : JSON.stringify(fallbackData, null, 2);
            const blob = new Blob([dataToExport], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };

        // 1. Export defaultUrls from localStorage
        const defaultUrlsData = localStorage.getItem('defaultUrls');
        downloadJson('defaultUrls.json', defaultUrlsData, {});

        // 2. Export siteColorConfig from localStorage (with current state fallback)
        const colorConfigData = localStorage.getItem('siteColorConfig');
        downloadJson('siteColorConfig.json', colorConfigData, colors);
    };

    return (
        <div className={styles["settings-container"]}>            
            <div className={classNames(styles["settings-content"], {
                [styles["closed"]]: !isOpen
            })}>
                <button onClick={toggleSettings} className={styles["toggle-btn"]}>
                    {isOpen ? <FontAwesomeIcon icon={faGear} spinPulse /> : <FontAwesomeIcon icon={faGear} />}
                </button>
                <div className={styles["inner-content"]}>
                    <h3>Theme Color Customizer</h3>
                    <div className={styles["color-selector"]}>
                        
                        <div className={styles["color-picker-wrapper"]}>
                            <label htmlFor="bg-picker">Bg</label>
                            <input 
                                id="bg-picker"
                                type="color" 
                                value={colors.background} 
                                onChange={(e) => handleColorChange('background', e.target.value)}
                            />
                        </div>

                        <div className={styles["color-picker-wrapper"]}>
                            <label htmlFor="accent-picker">Accent</label>
                            <input 
                                id="accent-picker"
                                type="color" 
                                value={colors.accent} 
                                onChange={(e) => handleColorChange('accent', e.target.value)}
                            />
                        </div>

                        <div className={styles["color-picker-wrapper"]}>
                            <label htmlFor="text-picker">Text</label>
                            <input 
                                id="text-picker"
                                type="color" 
                                value={colors.text} 
                                onChange={(e) => handleColorCheckOrChange('text', e.target.value)}
                            />
                        </div>

                        <div className={styles["color-picker-wrapper"]}>
                            <label htmlFor="error-picker">Error</label>
                            <input 
                                id="error-picker"
                                type="color" 
                                value={colors.error} 
                                onChange={(e) => handleColorChange('error', e.target.value)}
                            />
                        </div>

                    </div>
                    <div className={styles["bottom"]}>
                        <button onClick={handleExport}>
                            <FontAwesomeIcon icon={faFloppyDisk} /> 
                            <span className={styles["label"]}>Export</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Helper helper for text change to match signature cleanly
    function handleColorCheckOrChange(key: keyof ColorSettings, value: string) {
        handleColorChange(key, value);
    }
};

export default Settings;