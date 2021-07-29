'use strict'
console.log('run...');
// import TOKEN from './token.js'
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const {TOKEN, yaKey, owmKey} = require('./token');
const bot = new TelegramBot(TOKEN, { polling: true });
const inlineWeatherKeyboard = {reply_markup: 
								{inline_keyboard: [ 
									[{text:'Екатеринбург', callback_data:'Ekaterinburg'}],
                                    [{text:'Сочи', callback_data:'Sochi'}],
									[{text:'Кемер', callback_data:'Kemer'}],
									[{text:'...', callback_data: 'userInput'}]
								]}
							}



bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	const userName = msg.chat.first_name;
	const resp = `Hello ${userName} , I'm weather bot. Write "/weather" and choose your city and I will send to you current weather `
	bot.sendMessage(chatId, resp)
})

bot.onText(/\/weather/, (msg, match) => {
	const chatId = msg.chat.id
	const resp = `Choose your city!`
	bot.sendMessage(chatId, resp, inlineWeatherKeyboard).then(()=> {
		bot.on('callback_query', async(query)=>{
			console.log('### query: ',query.data)
			if (query.data !== 'userInput'){
				const [lon, lat, city] = await getLonLanCoord(query.data) 
				const currentWeather = await getWeather(lat, lon)
				const temp = currentWeather.current.temp;
				const {description, icon} = currentWeather.current.weather[0]
				const response = makeAnswer(city, temp, description)
				bot.sendPhoto(query.message.chat.id, getWeatherIcon(icon),{
				caption: response
				}).then(()=>{
					bot.removeAllListeners('callback_query')
				})
			} else if(query.data == 'userInput'){
				bot.sendMessage(chatId, 'Text me your city').then(()=>{
					bot.on('message', msg=>{
						console.log('###resp', msg.text)
						bot.sendMessage(chatId, `${msg.text}`).then( async ()=>{
							const [lon, lat, city] = await getLonLanCoord(msg.text)
							bot.removeAllListeners('message')
							const weatherData = await getWeather(lat, lon)
							// console.log(weatherData.current.weather);
							const temp = weatherData.current.temp;
							const {description, icon} = weatherData.current.weather[0]
							// console.log(description, icon);
							// const response = `It's ${weatherData.current.temp} degC and ${description}` 
							const response = makeAnswer(city, temp, description)
							bot.sendPhoto(query.message.chat.id, getWeatherIcon(icon),{
							caption: response
							}).then(()=>{
								bot.removeAllListeners('callback_query')
							})
						})
					})
				})
			}
			
		})
		

		
	})
})	

function getWeatherIcon(icon){
	return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

async function getLonLanCoord(city){			// function return [lon, lan, name, description]
	
	let url = `https://geocode-maps.yandex.ru/1.x?geocode=${city}&apikey=${yaKey}&format=json`;
	const encoded = encodeURI(url)
	let coordObj = await fetch(encoded);
	let json = await coordObj.text();
	json = JSON.parse(json)
	let geoObject = json.response.GeoObjectCollection.featureMember[0].GeoObject;
	console.log(geoObject);
	let {name, description} = geoObject;
	let points = geoObject.Point.pos;
	console.log (points, name, description);
	
	points = points.split(' ');
	
	return [...points, name, description]
	
};

async function getWeather(lat, lon){ 			// function return object of weather
	let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely&units=metric&appid=${owmKey}`
	let weatherObj = await fetch(url)
	let data = await weatherObj.json();
	//console.log(data);
	return data
	
}


function makeAnswer(city, temp, description){
	return ` ${city} -- ${temp} -- ${description}`

}

