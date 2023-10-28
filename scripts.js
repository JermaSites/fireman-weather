window.addEventListener("load", async () => {
	updateClock();
	setInterval(updateClock, 500);

	const syncTimeButton = document.getElementById("syncTimeButton");
	syncTimeButton.addEventListener("click", syncAnimationToLocalTime);

	const syncWeatherButton = document.getElementById("syncWeatherButton");
	syncWeatherButton.addEventListener("click", syncAnimationToLocalWeather);

	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const video = document.getElementById("video");

	function drawVideo() {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		requestAnimationFrame(drawVideo);
	}

	video.addEventListener("playing", () => {
		console.log("Video playing");
		drawVideo();
	})

	video.addEventListener("play", () => {
		console.log("Video play");
		drawVideo();
	})

	cloudFactory();
});

function syncAnimationToLocalTime() {
	const d = new Date();

	const secondsPerDay = 24 * 60 * 60;

	const totalSeconds =
		d.getSeconds() +
		d.getHours() * 60 * 60 +
		d.getMinutes() * 60 +
		d.getMilliseconds() / 1000;

	const skyGradient = document.getElementById("skyGradient");

	skyGradient.children[0].children[0].setAttribute("begin", `-${totalSeconds}s`);
	skyGradient.children[0].children[1].setAttribute("begin", `-${totalSeconds}s`);
	skyGradient.children[1].children[0].setAttribute("begin", `-${totalSeconds}s`);

	skyGradient.children[0].children[0].setAttribute("dur", `${secondsPerDay}s`);
	skyGradient.children[0].children[1].setAttribute("dur", `${secondsPerDay}s`);
	skyGradient.children[1].children[0].setAttribute("dur", `${secondsPerDay}s`);

	skyGradient.innerHTML += ""; // reload the svgs

	const sun = document.getElementById("sun");
	const moon = document.getElementById("moon");

	sun.style.animationDelay = `-${totalSeconds}s`;
	sun.style.animationDuration = `${secondsPerDay}s`;

	moon.style.animationDelay = `-${totalSeconds}s`;
	moon.style.animationDuration = `${secondsPerDay}s`;
}

async function syncAnimationToLocalWeather() {
	const weatherData = await getWeather();
	console.log(weatherData?.current)
	cloudFactory(weatherData);
}

function updateClock() {
	const time = document.getElementById("time");
	const d = new Date();
	const milliseconds = d.getMilliseconds();

	const localTime = d.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });

	time.textContent = milliseconds > 500 ? `${localTime.split(":").join(' ')}` : `${localTime}`;
}

class Cloud {
	constructor(src, speed, width, opacity, top, duration, delay) {
		this.imgEl = document.createElement("img");
		this.src = src;
		this.speed = speed;
		this.width = width;
		this.opacity = opacity;
		this.top = top;
		this.duration = duration;
		this.delay = delay;

		this.imgEl.src = this.src;
		this.imgEl.className = "cloud";
		this.imgEl.style.animationDuration = this.duration;
		this.imgEl.style.animationDelay = this.delay;
		this.imgEl.style.width = this.width;
		this.imgEl.style.opacity = this.opacity;
		this.imgEl.style.top = this.top;
	}
}

function cloudFactory(weatherData) {
	const cloudsEl = document.getElementById("clouds");

	// remove all child elements
	while (cloudsEl.firstChild) {
		cloudsEl.removeChild(cloudsEl.firstChild)
	}

	if (weatherData) {
		for (let i = 0; i < weatherData.current.cloudcover; i++) {
			const windSpeed = weatherData.current.windspeed_10m;
			const cloudCover = weatherData.current.cloudclover;

			const cloudImgSrc = `media/images/clouds/cloud0${getRandomRange(1, 5)}.png`;
			const cloudSpeed = getRandomRange((windSpeed / 2) + 1, windSpeed);
			const cloudWidth = 30 * (cloudCover / 60) + "%";
			const cloudOpacity = cloudCover / 20;
			const cloudTopOffset = `${getRandomRange(1, 70)}vh`;
			const cloudAnimationDuration = `${200 / cloudSpeed}s`;
			const cloudAnimationDelay = `-${(getRandomRange(1, 100) / 100) * (15 * (1 + windSpeed * 10))}s`;

			const cloud = new Cloud(cloudImgSrc, cloudSpeed, cloudWidth, cloudOpacity, cloudTopOffset, cloudAnimationDuration, cloudAnimationDelay);
			cloudsEl.appendChild(cloud.imgEl);
		}
	} else {
		console.log("Default clouds")
		for (let i = 0; i < 25; i++) {
			const cloudImgSrc = `media/images/clouds/cloud0${getRandomRange(1, 5)}.png`;
			const cloudSpeed = getRandomRange(1, 30);
			const cloudWidth = 30 * (cloudSpeed / 60) + "%";
			const cloudOpacity = cloudSpeed / 20;
			const cloudTopOffset = `${getRandomRange(1, 70)}vh`;
			const cloudAnimationDuration = `${15 * (1 + cloudSpeed / 10)}s`;
			const cloudAnimationDelay = `-${(getRandomRange(1, 100) / 100) * (15 * (1 + cloudSpeed / 10))}s`;

			const cloud = new Cloud(cloudImgSrc, cloudSpeed, cloudWidth, cloudOpacity, cloudTopOffset, cloudAnimationDuration, cloudAnimationDelay);
			cloudsEl.appendChild(cloud.imgEl);
		}
	}
}

function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getCoords() {
	try {
		console.log("Loading coords")
		const position = await new Promise((resolve, reject) => {
			const options = {
				maximumAge: 24 * 60 * 60,
				timeout: 5000,
				enableHighAccuracy: true
			}
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});

		const { latitude, longitude } = position.coords;

		return { latitude, longitude };
	} catch (error) {
		console.log("Error: Geolocation permission blocked");
		console.log(error)
		return null;
	} finally {
		console.log("Finished loading coords or error")
	}

}

async function getWeather() {
	try {
		console.log("Loading weather")
		const { latitude, longitude } = await getCoords();

		const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,rain,showers,snowfall,cloudcover,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log("Error getting weather");
		console.log(error);
		return null;
	} finally {
		console.log("Finished loading weather or error");
	}
}
