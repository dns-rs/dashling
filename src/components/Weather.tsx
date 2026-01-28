import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faComment, faShield } from '@fortawesome/free-solid-svg-icons'; // Changed to a valid Font Awesome icon
import CurrentTime from './CurrentTime'
import ClothingRecommendation from './ClothingRec';
import styles from './Weather.module.scss'
import { faDroplet, faTornado } from '../../node_modules/@fortawesome/free-solid-svg-icons/index';

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

    const [wcDay, setWcDay] = useState<WeatherCondition[]>([
        {
            description: "Sunny",
            image: "http://openweathermap.org/img/wn/01d@2x.png"
        },
        {
            description: "Mainly Sunny",
            image: "http://openweathermap.org/img/wn/02d@2x.png"
        },
        {
            description: "Partly Cloudy",
            image: "http://openweathermap.org/img/wn/03d@2x.png"
        },
        {
            description: "Cloudy",
            image: "http://openweathermap.org/img/wn/04d@2x.png"
        },
        {
            description: "Foggy",
            image: "http://openweathermap.org/img/wn/50d@2x.png"
        },
        {
            description: "Rime Fog",
            image: "http://openweathermap.org/img/wn/50d@2x.png"
        },
        {
            description: "Light Drizzle",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Drizzle",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Heavy Drizzle",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Light Freezing Drizzle",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Freezing Drizzle",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Light Rain",
            image: "http://openweathermap.org/img/wn/10d@2x.png"
        },
        {
            description: "Rain",
            image: "http://openweathermap.org/img/wn/10d@2x.png"
        },
        {
            description: "Heavy Rain",
            image: "http://openweathermap.org/img/wn/10d@2x.png"
        },
        {
            description: "Light Freezing Rain",
            image: "http://openweathermap.org/img/wn/10d@2x.png"
        },
        {
            description: "Freezing Rain",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Light Snow",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Snow",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Heavy Snow",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Snow Grains",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Light Showers",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Showers",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Heavy Showers",
            image: "http://openweathermap.org/img/wn/09d@2x.png"
        },
        {
            description: "Light Snow Showers",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Snow Showers",
            image: "http://openweathermap.org/img/wn/13d@2x.png"
        },
        {
            description: "Thunderstorm",
            image: "http://openweathermap.org/img/wn/11d@2x.png"
        },
        {
            description: "Light Thunderstorms With Hail",
            image: "http://openweathermap.org/img/wn/11d@2x.png"
        },
        {
            description: "Thunderstorm With Hail",
            image: "http://openweathermap.org/img/wn/11d@2x.png"
        }
    ]);

    const [wcNight, setWcNight] = useState<WeatherCondition[]>([
        {
            description: "Clear",
            image: "http://openweathermap.org/img/wn/01n@2x.png"
        },
        {
            description: "Mainly Clear",
            image: "http://openweathermap.org/img/wn/02n@2x.png"
        },
        {
            description: "Partly Cloudy",
            image: "http://openweathermap.org/img/wn/03n@2x.png"
        },
        {
            description: "Cloudy",
            image: "http://openweathermap.org/img/wn/04n@2x.png"
        },
        {
            description: "Foggy",
            image: "http://openweathermap.org/img/wn/50n@2x.png"
        },
        {
            description: "Rime Fog",
            image: "http://openweathermap.org/img/wn/50n@2x.png"
        },
        {
            description: "Light Drizzle",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Drizzle",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Heavy Drizzle",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Light Freezing Drizzle",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Freezing Drizzle",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Light Rain",
            image: "http://openweathermap.org/img/wn/10n@2x.png"
        },
        {
            description: "Rain",
            image: "http://openweathermap.org/img/wn/10n@2x.png"
        },
        {
            description: "Heavy Rain",
            image: "http://openweathermap.org/img/wn/10n@2x.png"
        },
        {
            description: "Light Freezing Rain",
            image: "http://openweathermap.org/img/wn/10n@2x.png"
        },
        {
            description: "Freezing Rain",
            image: "http://openweathermap.org/img/wn/10n@2x.png"
        },
        {
            description: "Light Snow",
            image: "http://openweathermap.org/img/wn/13n@2x.png"
        },
        {
            description: "Snow",
            image: "http://openweathermap.org/img/wn/13n@2x.png"
        },
        {
            description: "Heavy Snow",
            image: "http://openweathermap.org/img/wn/13n@2x.png"
        },
        {
            description: "Snow Grains",
            image: "http://openweathermap.org/img/wn/13n@2x.png"
        },
        {
            description: "Light Showers",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Showers",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Heavy Showers",
            image: "http://openweathermap.org/img/wn/09n@2x.png"
        },
        {
            description: "Light Snow Showers",
            image: "http://openweathermap.org/img/wn/13n@2x.png"
        },
        {
            description: "Snow Showers",
            image: "http://openweathermap.org/img/wn/13n@2x.png"
        },
        {
            description: "Thunderstorm",
            image: "http://openweathermap.org/img/wn/11n@2x.png"
        },
        {
            description: "Light Thunderstorms With Hail",
            image: "http://openweathermap.org/img/wn/11n@2x.png"
        },
        {
            description: "Thunderstorm With Hail",
            image: "http://openweathermap.org/img/wn/11n@2x.png"
        }
    ]);

    const wc = weatherData?.is_day === 1 ? wcDay : wcNight;
    
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
        fetchWeatherData(); // Fetch data immediately when the component mounts
        const intervalId = setInterval(fetchWeatherData, 300000); // Fetch data every 5 minutes
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h1><CurrentTime /></h1>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {weatherData && (
                <>
                <div className={styles['weather-container']}>               
                     <div className={styles['weather-module']}>
                        <div className={styles['icons']}>
                            <img src={wc[weatherData.weather_code].image} alt={wc[weatherData.weather_code].description} />
                        </div>
                        <div className={styles['text']}>
                            {wc[weatherData.weather_code].description}
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
                    <h3><span><FontAwesomeIcon icon={faShield}/></span> <span className={styles['clothing-text']}>ARMOR</span> </h3> <ClothingRecommendation weather={weatherData} />
                </div>
                </>
            )}
        </div>
    );
};

export default Weather;
