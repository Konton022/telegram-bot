// import TOKEN from './token.js'
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const {TOKEN, YA_TOKEN, OWM_TOKEN} = require('./token');
const bot = new TelegramBot(TOKEN, { polling: true });
const inlineWeatherKeyboard = {reply_markup: 
								{inline_keyboard: [ 
									[{text:'Екатеринбург', callback_data:'lat=56.837859&lon=60.598705'}],
                                   					[{text:'Кашино', callback_data:'lat=56.551287&lon=60.850492'}],
									[{text:'Березовский', callback_data:'lat=56.909184&lon=60.822675'}],
									[{text:'...', callback_data: 'userInput'}]
								]}
							}



//bot.on('message', (response)=> {
//		console.log('### response: ', response)})


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
				const currentWeather = await getWeather(query.data)
				//console.log(currentWeather);
				const {description, icon} = currentWeather.current.weather[0]
				const response = `It's ${currentWeather.current.temp} degC and ${description}` 
				bot.sendPhoto(query.message.chat.id, getWeatherIcon(icon),{
				caption: response
				}).then(()=>{
					bot.removeAllListeners('callback_query')
				})
			} else
			{
				bot.sendMessage(chatId, 'Text me your city').then(()=>{
					bot.on('message', msg=>{
						console.log('###resp', msg.text)
						bot.sendMessage(chatId, `${msg.text}`).then( async ()=>{
							const coordObj = await getCoordinates(msg.text)
							bot.removeAllListeners('message')
							console.log('cO: ',coordObj);
						})
					})
				})
			}
			
		})
		
		console.log('##### DONE ######')
		
	})
})	


// bot.onText(/\/weather (.+)/, async (msg, match) => {
//     try{    
// 		const chatId = msg.chat.id
//         	const resp = `${match[1]}`
// 		const currentWeather = await getWeather(resp);
// 		const {description, icon} = currentWeather.current.weather[0];
// 		//const htmlResp = `<strong>in ${currentWeather.name}</strong><b>It's ${(currentWeather.main.temp - 273).toFixed(2)} degC and ${description}</b>`
// 		const response = `It's ${currentWeather.current.temp} degC and ${description} in ${currentWeather.name}`
//         bot.sendPhoto(chatId, getWeatherIcon(icon),{caption: response})
// 			// .then(function(data){console.log('###data: ',data)})
// 	//bot.sendMessage(chatId, htmlResp, {parse_mode: 'HTML'})
// 	} catch(e) {
// 		console.log(e);
// 	}
// })
async function getWeather(city) {
	
	let url = `https://api.openweathermap.org/data/2.5/onecall?${city}&exclude=minutely&units=metric&appid=${OWM_TOKEN}`;
	const encoded = encodeURI(url)
	let response = await fetch(encoded);
	let data = await response.json();
	//console.log(data);
	return data
}

function getWeatherIcon(icon){
	return `https://openweathermap.org/img/wn/${icon}@2x.png`
}


async function getCoordinates(adr){
	let url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${YA_TOKEN}&geocode=${adr}`
	const encoded = encodeURI(url);
	try {let response = await fetch(encoded, {
		method: 'GET',
		redirect: 'follow'
	  })
	let data = await response.json()
	console.log('###geoObj:  ', data)
	return data.response;
	}
	catch(err) {
		console.log('err', err);
	}

}

