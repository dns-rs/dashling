# Dashling
Dashling is a browser homepage, based on the Google's NewTab page design made with Next.js.

## It includes:
- Weather data (based on your location)
- Clothing recommendation based on the weather data
- Sensor data for 2 locations (currently bedroom and living room)
- Website shortcut grid 

## Setup
### In order to make every component work, you'll need to create an .env file, with the following structure in the project's root directory:
- NEXT_PUBLIC_PRIVATE_MODE='true' (optional)
- NEXT_PUBLIC_SENSOR_BEDROOM='http://x.x.x.y'
- NEXT_PUBLIC_SENSOR_LIVINGROOM='http://x.x.x.z'
- NEXT_PUBLIC_LATITUDE='xx.xxx'
- NEXT_PUBLIC_LONGITUDE='yy.yyy'
- NEXT_PUBLIC_LOCALHOST='http://x.x.x.x'

Change the x.x.x.y and x.x.x.z to the url of your sensors.
Change the latitude and longitude to the numbers corresponding to your location. 

### Sensor data is being fetched via get requests. Dashling expects the following structure from your sensors:
```
{
  temperature: 22.2,
  feelsLike: 21.8,
  humidity: 50.7
}
```

### PRIVATE MODE (optional)
You can add a "private_shortcuts.json" file to your /public/data directory where you can store fallback shortcuts in case your local storage gets wiped.
Expected format:
```json
{
  "social": [
      {
         "title": "Reddit",
         "url": "https://www.reddit.com/"
      },
      {
         "title": "Facebook",
         "url": "https://www.facebook.com/"
      },
      {
         "title": "Instagram",
         "url": "https://www.instagram.com/"
      },
      {
         "title": "Letterboxd",
         "url": "https://letterboxd.com/"
      },
      {
         "title": "SoundCloud",
         "url": "https://www.soundcloud.com"
      }
   ],
  "favorites": [
      {
         "title": "Discogs",
         "url": "https://www.discogs.com"
      },
      {
         "title": "Goodreads",
         "url": "https://www.goodreads.com"
      },
      {
         "title": "iMDb",
         "url": "https://www.imdb.com"
      },
      {
         "title": "Steam",
         "url": "https://store.steampowered.com/"
      },
      {
         "title": "Bandcamp",
         "url": "https://www.bandcamp.com/"
      },
      {
         "title": "YouTube",
         "url": "https://www.youtube.com"
      },
      {
         "title": "Netflix",
         "url": "https://www.netflix.com"
      }
   ]
}
```

## Here's how you can deploy it:
Run the development server:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 with your browser and enjoy!

## Preview
<img width="1920" height="919" alt="Dashling" src="https://github.com/user-attachments/assets/d376a61a-a4ef-4767-949f-e8fd3e8ab460" />



