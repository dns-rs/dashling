import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Define the structure of the current weather response
interface CurrentWeather {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
}

interface WeatherResponse {
    current_weather: CurrentWeather;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { latitude = 46.10, longitude = 19.67 } = req.query; // Default coordinates

    try {
        const response = await axios.get<WeatherResponse>('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                current_weather: true,
                timezone: 'Europe/Berlin',
            },
        });

        const currentWeather = response.data.current_weather;
        res.status(200).json(currentWeather);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
}