
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const token = '1878028335:AAHV6V0QsxF5iz4o5Eklgjw-WXO-WbLPEO0';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg, match) => {
	const chatId = msg.chat.id;
	const resp = `Hello ${chatId.firstName} , I'm smart weather bot. I can tell you current weather. Write "/weather" and your city and I send to you current weather `
	bot.sendMessage(chatId, resp)
	console.log(chatId)
})

bot.onText(/\/echo (.+)/, (msg, match) => {
	const chatId = msg.chat.id
	const resp = match[1]
	bot.sendMessage(chatId, resp)
})


bot.onText(/\/weather (.+)/, async (msg, match) => {
        const chatId = msg.chat.id
        const resp = match[1]
	const currentWeather = await getWeather(resp);
	console.log(currentWeather)
	let response = `Temperature is ${Math.round(currentWeather.main.temp - 273, -1)} in ${currentWeather.name}`
        bot.sendMessage(chatId, response)
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
