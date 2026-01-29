import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faComment, faShield, faDroplet, faTornado } from '@fortawesome/free-solid-svg-icons';
import CurrentTime from './CurrentTime'
import ClothingRecommendation from './ClothingRec';
import styles from './Weather.module.scss'

interface WeatherData {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
}

interface WeatherCondition {
    description: string;
    image: string;
}

const { latitudeNum, longitudeNum } = {
    latitudeNum: Number(process.env.NEXT_PUBLIC_LATITUDE!),
    longitudeNum: Number(process.env.NEXT_PUBLIC_LONGITUDE!)
};

const getWeatherCondition = (code: number, isDay: number): WeatherCondition => {
    const daySuffix = isDay === 1 ? 'd' : 'n';
    
    const descriptions: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy', 
        3: 'Overcast',
        45: 'Foggy',
        48: 'Rime fog',
        51: 'Light drizzle',
        53: 'Drizzle',
        55: 'Heavy drizzle',
        56: 'Light freezing drizzle',
        57: 'Freezing drizzle',
        61: 'Light rain',
        63: 'Rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Freezing rain',
        71: 'Light snow',
        73: 'Snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light rain showers',
        81: 'Rain showers',
        82: 'Heavy rain showers',
        85: 'Light snow showers',
        86: 'Snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with light hail',
        99: 'Thunderstorm with heavy hail'
    };

    const iconMap: Record<number, string> = {
        0: `01${daySuffix}`,
        1: `02${daySuffix}`,
        2: `03${daySuffix}`,
        3: `04${daySuffix}`,
        45: `50${daySuffix}`,
        48: `50${daySuffix}`,
        51: `09${daySuffix}`,
        53: `09${daySuffix}`,
        55: `09${daySuffix}`,
        56: `09${daySuffix}`,
        57: `09${daySuffix}`,
        61: `10${daySuffix}`,
        63: `10${daySuffix}`,
        65: `10${daySuffix}`,
        66: `10${daySuffix}`,
        67: `13${daySuffix}`,
        71: `13${daySuffix}`,
        73: `13${daySuffix}`,
        75: `13${daySuffix}`,
        77: `13${daySuffix}`,
        80: `09${daySuffix}`,
        81: `09${daySuffix}`,
        82: `09${daySuffix}`,
        85: `13${daySuffix}`,
        86: `13${daySuffix}`,
        95: `11${daySuffix}`,
        96: `11${daySuffix}`,
        99: `11${daySuffix}`
    };

    const iconCode = iconMap[code] || '01';
    const description = descriptions[code] || 'Unknown weather';
    
    return {
        description,
        image: `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    };
};

const Weather = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [latitude, setLatitude] = useState<number>(latitudeNum);
    const [longitude, setLongitude] = useState<number>(longitudeNum);
    const [current, setCurrent] = useState<string[]>([
        "temperature_2m",
        "relative_humidity_2m", 
        "apparent_temperature",
        "wind_speed_10m",
        "weather_code",
        "is_day"
    ]);
    
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    current: current.join(','),
                    timezone: 'Europe/Berlin',
                },
            });

            setWeatherData(response.data.current);
            setError(null);
            console.log("Current weather data:", response.data.current);            
        } catch (err) {
            console.error('Error fetching weather data:', err);
            setError('Failed to fetch weather data');
        }
    };

    useEffect(() => {
        fetchWeatherData();
        const intervalId = setInterval(fetchWeatherData, 300000);
        return () => clearInterval(intervalId);
    }, []);

    const weatherCondition = weatherData ? getWeatherCondition(
        weatherData.weather_code, 
        weatherData.is_day
    ) : null;

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h1><CurrentTime /></h1>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {weatherData && weatherCondition && (
                <>
                <div className={styles['weather-container']}>               
                    <div className={styles['weather-module']}>
                        <div className={styles['icons']}>
                            <img src={weatherCondition.image} alt={weatherCondition.description} />
                        </div>
                        <div className={styles['text']}>
                            {weatherCondition.description}
                        </div>        
                    </div>   
                    <div className={styles['weather-module']}>
                        <div className={styles['icons']}>
                            <FontAwesomeIcon icon={faThermometerHalf} />                        
                        </div>
                        <div className={styles['text']}>
                        {weatherData.temperature_2m}°C
                        </div>                        
                    </div>
                    <div className={styles['weather-module']}>
                        <div className={styles['icons']}>
                            <span className={styles['icon-1']}><FontAwesomeIcon icon={faThermometerHalf} /> </span>
                            <span className={styles['icon-2']}><FontAwesomeIcon icon={faComment} /> </span>
                        </div>
                        <div className={styles['text']}>
                            {weatherData.apparent_temperature}°C  
                        </div>                        
                    </div>
                    <div className={styles['weather-module']}>
                        <div className={styles['icons']}>
                            <FontAwesomeIcon icon={faDroplet} />                        
                        </div>
                        <div className={styles['text']}>
                            {weatherData.relative_humidity_2m}%
                        </div>                        
                    </div>          
                    <div className={styles['weather-module']}>
                        <div className={styles['icons']}>
                            <FontAwesomeIcon icon={faTornado} />            
                        </div>
                        <div className={styles['text']}>
                            {weatherData.wind_speed_10m}km/h
                        </div>                        
                    </div>    
                    
                </div>
                <div className={styles['clothing-container']}>
                    <h3><span><FontAwesomeIcon icon={faShield}/></span> <span className={styles['clothing-text']}>ARMOR</span> </h3> 
                    <ClothingRecommendation weather={weatherData} />
                </div>
                </>
            )}
        </div>
    );
};

export default Weather;
