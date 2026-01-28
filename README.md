Dashling is a browser homepage, based on the Google NewTab page design.

It includes:
- Weather data
- Clothing recommendation based on the weather data
- Sensor data for 2 locations
- Shortcut grid

In order to make every component work, you'll need to create an .env file, with the following structure in the project's root directory:
- NEXT_PUBLIC_SENSOR_BEDROOM='http://x.x.x.y'
- NEXT_PUBLIC_SENSOR_LIVINGROOM='http://x.x.x.z'
- NEXT_PUBLIC_LATITUDE='xx.xxx'
- NEXT_PUBLIC_LONGITUDE='yy.yyy'
- NEXT_PUBLIC_LOCALHOST='http://x.x.x.x'

Change the x.x.x.y and x.x.x.z to the url of your sensors.
Change the latitude and longitude to the numbers corresponding to your location. 

By default I have included a dummy list that contains some of my own shortcuts, which can be used by clicking on the bottom left db button.
To create your own grid, click on the + button on the bottom right corner and fill out the form.

Sensor data is being fetched via get requests. Dashling expects the following structure from your sensors:
{
  temperature: 22.2,
  feelsLike: 21.8,
  humidity: 50.7
}
