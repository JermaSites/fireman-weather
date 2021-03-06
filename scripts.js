window.addEventListener('load', () => {
	var button = document.getElementById("start");
	button.onclick = function() {
		var d = new Date();
		console.log(d.getSeconds());
		console.log(d.getHours());
		console.log(d.getMinutes());
		console.log(d.getMilliseconds());
		totalSeconds = (d.getSeconds() + ((d.getHours() * 60) * 60) + (d.getMinutes() * 60) + (d.getMilliseconds() / 1000));
		console.log(totalSeconds);
		document.getElementById('skyGradient').children[0].children[0].setAttribute("begin", '-' + totalSeconds + 's');
		document.getElementById('skyGradient').children[0].children[1].setAttribute("begin", '-' + totalSeconds + 's');
		document.getElementById('skyGradient').children[1].children[0].setAttribute("begin", '-' + totalSeconds + 's');
		
		document.getElementById('skyGradient').children[0].children[0].setAttribute("dur", '86400s');
		document.getElementById('skyGradient').children[0].children[1].setAttribute("dur", '86400s');
		document.getElementById('skyGradient').children[1].children[0].setAttribute("dur", '86400s');
		
		document.getElementById("skyGradient").innerHTML += ""; //reload the svgs
		
		document.getElementById('sunMoonCycle').style.animationDuration = "86400s";
		document.getElementById('sunMoonCycle').style.animationDelay = '-' + (totalSeconds + 43200) + 's';
	};
	for(var i = 0; i < 25; i++) {
		var cloudSpeed = Math.floor(Math.random() * 30) + 1;
		console.log(cloudSpeed);
		var div = document.createElement("img");
		div.style.animationDuration = (15 * (1 + (cloudSpeed / 10))) + "s";
		div.style.animationDelay = "-" + (((Math.floor(Math.random() * 100) + 1) / 100) * (15 * (1 + (cloudSpeed / 10))))+ "s";
		div.style.width = (30 * (cloudSpeed / 60)) + "%";
		// div.style.height = "auto";
		// div.style.transform = "scale(" + (Math.floor(Math.random() * 100) + 0) + ")";
		div.style.opacity = (cloudSpeed / 20);
		div.className = "cloud";
		div.src = "media/clouds/cloud0" + (Math.floor(Math.random() * 5) + 1) + ".png";
		div.style.top = (Math.floor(Math.random() * 70) + 1) + "vh";
		document.getElementById("clouds").appendChild(div);
	}
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	const video = document.querySelector("video");

	video.addEventListener('play', () => {
		function step() {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	});
});

