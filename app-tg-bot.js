'use strict'
console.log('run...');


import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import fetch from "node-fetch";
import { TOKEN, yaKey, owmKey } from './token.js';

import getWeatherIcon from './components/getWeatherIcon.js';
import getLonLanCoord from './components/getLonLanCoord.js';
import getWeather from './components/getWeather.js';
// import { TOKEN } from './token.js'
import makeAnswer from './components/makeAnswer.js';
// import TelegramBot from 'node-telegram-bot-api';


const bot = new TelegramBot(TOKEN, { polling: true });

const inlineWeatherKeyboard = {reply_markup: 
								{inline_keyboard: [ 
									[{text: 'Екатеринбург', callback_data:'Ekaterinburg'},{text:'Сочи', callback_data:'Sochi'}, {text:'Кемер', callback_data:'Kemer'}],
                                    // [],
									// [],
									[{text:' \ud83c\udfe0 WRITE YOUR CITY! \ud83c\udfe0	', callback_data: 'userInput'}]
								]}
							}



fs.mkdir('./LOGS', (err)=>{
	if(err){
		console.log(err);
	} else {
		console.log('Folder was created');
	}
})

bot.on('message', (msg)=>{
	fs.appendFile('./LOGS/logs.txt', `${JSON.stringify(msg)}\n`, ()=>{
		console.log('write message');
	})
})

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
				const response = makeAnswer(city, temp, description, icon)
				bot.sendPhoto(query.message.chat.id, getWeatherIcon(icon),{
				caption: response
				}).then(()=>{
					bot.removeAllListeners('callback_query')
				})
			} else if(query.data == 'userInput'){
				bot.sendMessage(chatId, 'Text me your city').then(()=>{
					bot.on('message', msg=>{
						console.log('###resp', msg.text)
						bot.sendMessage(chatId, `wait please... I am updating the information... `).then( async ()=>{
							const [lon, lat, city, descrp, text] = await getLonLanCoord(msg.text)
							bot.removeAllListeners('message')
							const weatherData = await getWeather(lat, lon)
							console.log('weather is ', weatherData.hourly[0].weather[0]);
							
							const temp = weatherData.current.temp;
							const {description, icon} = weatherData.current.weather[0]

							const response = makeAnswer(text, temp, description, icon)
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

bot.onText(/\/forecast/, (msg) => {

})









