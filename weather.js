var weather = require('openweather-apis');
var geoip = require('geoip-lite');
var geo = geoip.lookup(ip);
console.log(geo.city);
require('dotenv').config();

weather.setLang('en');

// or set the coordinates (latitude,longitude)
weather.setCoordinate(geo.ll[0], geo.ll[1]);

// 'metric'  'internal'  'imperial'
weather.setUnits('metric');

weather.setAPPID(process.env.API_KEY);

weather.getTemperature(function(err, temp){
	if(err) console.log(err);
	console.log(temp);
});

weather.getDescription(function(err, desc){
	if(err) console.log(err);
	console.log(desc);
});


app.listen((process.env.PORT || 80), () =>
  console.log('api listening on port 80!'),
)
