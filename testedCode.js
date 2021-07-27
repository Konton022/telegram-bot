console.log('run....');

const input = document.querySelector('input');
const button = document.querySelector('button');
const out = document.querySelector('div');

const yaKey = 'f0515e08-19b6-4455-b525-94d21c567eda'
const owmKey = 'ae47378a82743093b5efe8934910c74c'

button.addEventListener('click', async()=>{
	let city = input.value;
	console.log(city);	
	try {
		let [lon, lat, name, description] = await getLonLanCoord(city);
		out.innerHTML = `координаты ${lat} ${lon} description:${description} / name:${name}`;
		console.log('coords lat lon: ', lat, lon, name, description);
		const weatherObj = await getWeather(lat, lon);
	const {current, hourly, alarms} = weatherObj;
	let ul = createElement('ul', 'forecast')
	out.appendChild(ul)
	hourly.forEach(emem => {
		let li = createElement('li')
		li.innerHTML = `<code>${emem}</code>`;
		ul.appendChild(li)
	})
	
	
	} catch(err)  {
		console.log(err)
		out.innerHTML = 'не действительный адрес' 
		}
	input.value = '';
	
	
})

function createElement(elem, classElem, ...param){
	let newElem = document.createElement(elem);
	newElem.classList.add(classElem);
	return newElem
}


async function getLonLanCoord(city){			// function return [lon, lan, name, description]
	
	let url = `https://geocode-maps.yandex.ru/1.x?geocode=${city}&apikey=${yaKey}&format=json`;
	let coordObj = await fetch(url);
	let json = await coordObj.text();
	json = JSON.parse(json)
	//console.log(json);
	let geoObject = json.response.GeoObjectCollection.featureMember[0].GeoObject;
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
	console.log(data);
	return data
	
}