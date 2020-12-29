window.onload = function() {
  for(var i = 0; i < 50; i++) {
		var cloudSpeed = Math.floor(Math.random() * 8) + 5;
		var div = document.createElement("div");
		div.style.animationDuration = (15 * (1 + (cloudSpeed / 10))) + "s";
		div.style.animationDelay = "-" + (((Math.floor(Math.random() * 100) + 1) / 100) * cloudSpeed)+ "s";
		div.style.transform = "scale(" + (cloudSpeed / 10) + ")";
		div.style.opacity = (cloudSpeed / 10);
		div.className = "cloud";
		div.style.top = (Math.floor(Math.random() * 90) + 10) + "vh";
		document.getElementById("clouds").appendChild(div);
    }
}

// animation = 15 * 1+scale
// scale ranges between 0.5 and 1.2
