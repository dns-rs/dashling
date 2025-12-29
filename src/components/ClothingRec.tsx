import React from "react";

interface WeatherData {
  temperature_2m: number;      
  relative_humidity_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;     
  weather_code: number;     
  is_day: number;
}

interface Props {
  weather: WeatherData;
}

const ClothingRecommendation: React.FC<Props> = ({ weather }) => {
   const getClothingRecommendation = (weather: WeatherData): string[] => {
      const temp = weather.apparent_temperature;
      const humidity = weather.relative_humidity_2m;
      const wind = weather.wind_speed_10m;
      const isRain = weather.weather_code >= 200 && weather.weather_code <= 531;
      const isDay = weather.is_day === 1;
      let recommendations: string[] = [];

      if (isRain) {
         recommendations.push("Umbrella");               
         recommendations.push("Water-resistant shoes"); 
      }
      
      if (temp > 28) {
         
         if (isDay) recommendations.push("Sunglasses");          
         recommendations.push("T-shirt");                          
         if (humidity > 60) recommendations.push("Moisture-wicking clothes"); 
            recommendations.push("Shorts");           

      } else if (temp > 20) {
         recommendations.push("T-shirt");                          
         recommendations.push("Light pants or shorts");           
      } else if (temp > 15) {
         recommendations.push("Long-sleeve shirt");                
         recommendations.push("Light jacket");                     
         recommendations.push("Jeans");                           
      } else if (temp > 10) {
         recommendations.push("Sweater");                           
         recommendations.push("Medium jacket");                     
      } else {
         recommendations.push("Scarf");                            
         recommendations.push("Gloves");                            
         recommendations.push("Thermal layers");                    
         recommendations.push("Coat");
      }
      
      if (wind > 20) {
         recommendations.push("Windbreaker");                      
      }
   
      if (!isDay) {
         recommendations.push("Add an extra layer for nighttime");
      }
      
      return Array.from(new Set(recommendations));
       
   };

   const recommendations = getClothingRecommendation(weather);

   return (
      <ul>
         {recommendations.map((item, index) => (
            <li key={index}>{item}</li>
         ))}
      </ul>
   );
};

export default ClothingRecommendation;
