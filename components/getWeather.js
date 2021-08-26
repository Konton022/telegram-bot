import { owmKey } from "../token.js";
import fetch from "node-fetch";

async function getWeather(lat, lon){ 			// function return object of weather
	let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely&units=metric&appid=${owmKey}`
	let weatherObj = await fetch(url)
	let data = await weatherObj.json();
	//console.log(data);
	return data
	
}

export default getWeather

/*in data object we are interested in two components:
data.current - it's object within:
      dt: 1629992590, 
      sunrise: 1629944572, 
      sunset: 1629996013,
      temp: 18.32,
      feels_like: 18.43,
      pressure: 1015,
      humidity: 85,
      dew_point: 15.76,
      uvi: 0,
      clouds: 66,
      visibility: 10000,
      wind_speed: 4.58,
      wind_deg: 161,
      wind_gust: 9,
      weather: [ [Object] ]

hourly - its array of objects:
      {dt: 1629992590,
      sunrise: 1629944572,
      sunset: 1629996013,
      temp: 18.32,
      feels_like: 18.43,
      pressure: 1015,
      humidity: 85,
      dew_point: 15.76,
      uvi: 0,
      clouds: 66,
      visibility: 10000,
      wind_speed: 4.58,
      wind_deg: 161,
      wind_gust: 9,
      weather: [ [Object] ]}
*/