
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const token = '1878028335:AAHV6V0QsxF5iz4o5Eklgjw-WXO-WbLPEO0';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	const userName = msg.chat.first_name;
	const resp = `Hello ${userName} , I'm smart weather bot. Write "/weather" + your city and I will send to you current weather `
	bot.sendMessage(chatId, resp)
})

bot.onText(/\/echo (.+)/, (msg, match) => {
	const chatId = msg.chat.id
	const resp = match[1]
	bot.sendMessage(chatId, resp)
})


bot.onText(/\/weather (.+)/, async (msg, match) => {
    try{    
		const chatId = msg.chat.id
        const resp = `${match[1]}`
		console.log('###match:  ', match);
		const currentWeather = await getWeather(resp);
		//console.log(currentWeather)
		const response = `Temperature is ${Math.round(currentWeather.main.temp - 273)} in ${currentWeather.name}`
        bot.sendMessage(chatId, response)
	} catch(e) {
		console.log(e);
	}
})
async function getWeather(city) {
	
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ae47378a82743093b5efe8934910c74c`;
		let response = await fetch(url);
		let data = await response.json();
		//console.log(data);
		return data
}




function  currTemp(obj) {
	return obj.main
}
