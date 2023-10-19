window.addEventListener("load", () => {
	const syncButton = document.getElementById("syncButton");

	syncButton.addEventListener("click", syncAnimationToLocalTime);

	for (var i = 0; i < 25; i++) {
		createCloud()
	}

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

	updateClock();
	setInterval(updateClock, 500);
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

	const localTime = d.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })

	time.textContent = milliseconds > 500 ? `${localTime.split(":").join(' ')}` : `${localTime}`;
}

function createCloud() {
	const cloudSpeed = getRandomRange(1, 30);

	const cloudImg = document.createElement("img");

	const cloudAnimationDuration = 15 * (1 + cloudSpeed / 10)
	const cloudAnimationDelay = (getRandomRange(1, 100) / 100) * (15 * (1 + cloudSpeed / 10))

	cloudImg.style.animationDuration = `${cloudAnimationDuration}s`;
	cloudImg.style.animationDelay = `-${cloudAnimationDelay}s`;

	cloudImg.style.width = 30 * (cloudSpeed / 60) + "%";

	cloudImg.style.opacity = cloudSpeed / 20;
	cloudImg.className = "cloud";
	cloudImg.src = `media/clouds/cloud0${getRandomRange(1, 5)}.png`;
	cloudImg.style.top = `${getRandomRange(1, 70)}vh`;

	document.getElementById("clouds").appendChild(cloudImg);
}

function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
