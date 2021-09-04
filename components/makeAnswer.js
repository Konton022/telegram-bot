const smiles = {
	'01d' :'\u2600\ufe0f',
	'02d':'\ud83c\udf24',
	'03d':'\u26c5\ufe0f',
	'04d':'\u2601\ufe0f',
	'09d':'\ud83c\udf26',
	'10d':'\ud83c\udf27',
	'13d':'\u26c8',
	'50d':'\u2744\ufe0f',
	'01n' :'\u2600\ufe0f',
	'02n':'\ud83c\udf24',
	'03n':'\u26c5\ufe0f',
	'04n':'\u2601\ufe0f',
	'09n':'\ud83c\udf26',
	'10n':'\ud83c\udf27',
	'13n':'\u26c8',
	'50n':'\u2744\ufe0f',
}
export default function makeAnswer(city, temp, description, icon){
	return ` ${city} -- ${temp} -- ${description} -- ${smiles[icon]}`

}