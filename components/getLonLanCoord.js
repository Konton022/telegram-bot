import { yaKey }  from '../token.js';
// const fetch = require("node-fetch");
import fetch from 'node-fetch';
async function getLonLanCoord(city){			// function return [lon, lan, name, description]
	
	let url = `https://geocode-maps.yandex.ru/1.x?geocode=${city}&apikey=${yaKey}&format=json`;
	const encoded = encodeURI(url)
	let coordObj = await fetch(encoded).catch(err => {return ''});
	let json = await coordObj.text();
	json = JSON.parse(json)
	let geoObject = json.response.GeoObjectCollection.featureMember[0].GeoObject;
	console.log(geoObject);
	let {name, description} = geoObject;
	const {text} = geoObject.metaDataProperty.GeocoderMetaData;
	let points = geoObject.Point.pos;
	console.log (points, name, description);
	
	points = points.split(' ');
	
	return [...points, name, description, text]
	
};

export default getLonLanCoord