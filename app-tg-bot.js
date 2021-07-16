
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const token = '1878028335:AAHV6V0QsxF5iz4o5Eklgjw-WXO-WbLPEO0';
const bot = new TelegramBot(token, { polling: true });

//bot.on('message', msg=>{
//	bot.sendMessage( msg.chat.id, 'hello World!')

bot.on('callback_query', async (query)=>{
	console.log(query)
	const currentWeather = await getWeather(query.data)
	const {description, icon} = currentWeather.weather[0]
	const response = `It's ${(currentWeather.main.temp - 273).toFixed(2)} degC and ${description} in ${currentWeather.name}` 
	bot.sendMessage(query.message.chat.id, response)
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
	bot.sendMessage(chatId, resp,{
		reply_markup: {
			inline_keyboard: [[{text:'Екатеринбург', callback_data:'Ekaterinburg'}],
					[{text:'Москва', callback_data:'Moscow'}],[{text:'Sochi', callback_data:'Sochi'}]]
				}
			})
})

bot.onText(/\/weather (.+)/, async (msg, match) => {
    try{    
		const chatId = msg.chat.id
        	const resp = `${match[1]}`
		const currentWeather = await getWeather(resp);
		const {description, icon} = currentWeather.weather[0];
		//const htmlResp = `<strong>in ${currentWeather.name}</strong><b>It's ${(currentWeather.main.temp - 273).toFixed(2)} degC and ${description}</b>`
		const response = `It's ${(currentWeather.main.temp - 273).toFixed(2)} degC and ${description} in ${currentWeather.name}`
        bot.sendPhoto(chatId, getWeatherIcon(icon),{caption: response})
			.then(function(data){console.log('###data: ',data)})
	//bot.sendMessage(chatId, htmlResp, {parse_mode: 'HTML'})
	} catch(e) {
		console.log(e);
	}
})
async function getWeather(city) {
	
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ae47378a82743093b5efe8934910c74c`;
	const encoded = encodeURI(url)
	let response = await fetch(encoded);
	let data = await response.json();
	console.log(data);
	return data
}

function getWeatherIcon(icon){
	return `https://openweathermap.org/img/wn/${icon}@2x.png`
}


