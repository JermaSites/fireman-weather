window.addEventListener("load", async () => {
	updateClock();
	setInterval(updateClock, 500);

	const syncTimeButton = document.getElementById("syncTimeButton");
	syncTimeButton.addEventListener("click", syncAnimationToLocalTime);

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	const video = document.querySelector("video");

	video.addEventListener("play", () => {
		function step() {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	});

	const weatherData = await getWeather();
	console.log(weatherData.current)
	cloudFactory(weatherData);
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
	if (weatherData !== null) {
		for (let i = 0; i < weatherData.current.cloudcover; i++) {
			const windSpeed = weatherData.current.windspeed_10m;
			const cloudCover = weatherData.current.cloudclover;

			const cloudImgSrc = `media/clouds/cloud0${getRandomRange(1, 5)}.png`;
			const cloudSpeed = getRandomRange((windSpeed / 2) + 1, windSpeed);
			const cloudWidth = 30 * (cloudCover / 60) + "%";
			const cloudOpacity = cloudCover / 20;
			const cloudTopOffset = `${getRandomRange(1, 70)}vh`;
			const cloudAnimationDuration = `${200 / cloudSpeed}s`;
			const cloudAnimationDelay = `-${(getRandomRange(1, 100) / 100) * (15 * (1 + windSpeed * 10))}s`;

			const cloud = new Cloud(cloudImgSrc, cloudSpeed, cloudWidth, cloudOpacity, cloudTopOffset, cloudAnimationDuration, cloudAnimationDelay);
			document.getElementById("clouds").appendChild(cloud.imgEl);
		}
	} else {
		console.log("Default clouds")
		for (let i = 0; i < 25; i++) {
			const cloudImgSrc = `media/clouds/cloud0${getRandomRange(1, 5)}.png`;
			const cloudSpeed = getRandomRange(1, 30);
			const cloudWidth = 30 * (cloudSpeed / 60) + "%";
			const cloudOpacity = cloudSpeed / 20;
			const cloudTopOffset = `${getRandomRange(1, 70)}vh`;
			const cloudAnimationDuration = `${15 * (1 + cloudSpeed / 10)}s`;
			const cloudAnimationDelay = `-${(getRandomRange(1, 100) / 100) * (15 * (1 + cloudSpeed / 10))}s`;

			const cloud = new Cloud(cloudImgSrc, cloudSpeed, cloudWidth, cloudOpacity, cloudTopOffset, cloudAnimationDuration, cloudAnimationDelay);
			document.getElementById("clouds").appendChild(cloud.imgEl);
		}
	}
}

function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

async function getCoords() {
	try {
		const position = await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		});

		const { latitude, longitude } = position.coords;

		return { latitude, longitude };
	} catch (error) {
		return null
	}

}

async function getWeather() {
	try {
		const { latitude, longitude } = await getCoords();

		const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,rain,showers,snowfall,cloudcover,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York`);
		return await response.json();
	} catch (error) {
		return null
	}
}
