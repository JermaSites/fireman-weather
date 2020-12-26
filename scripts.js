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
	}
});