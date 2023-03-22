// Set the date of your friend's birthday (replace with your own date)
const birthday = new Date(Date.UTC(2023, 2, 30, 0, 0, 0));


// Get references to the elements on the page
const countdownEl = document.getElementById("countdown");
const birth = document.getElementById('birth')
// Update the countdown every second
const intervalId = setInterval(updateCountdown, 1000);
let canvas, ctx, w, h;
let fireworks = [],
		particles = [],
		circles = [];
let fireworksMax = 50;
let fireworksChance = 0.2;
let hue = 0;
canvas = document.querySelector("#canvas");
ctx = canvas.getContext("2d");

function updateCountdown() {
	// Calculate the time remaining until the birthday
	const now = new Date();
	const diff = birthday.getTime() - now.getTime();

	// Check if the birthday has already passed
	if (diff < 0) {
		countdownEl.textContent = "Happy Birthday مموشة!";
        birth.style.zIndex = 0

		init();
        clearInterval(intervalId)
	} else {
		// Calculate the days, hours, minutes, and seconds remaining
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((diff / 1000 / 60) % 60);
		const seconds = Math.floor((diff / 1000) % 60);

		// Update the countdown element with the remaining time
		countdownEl.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
	}
}




function init() {
	
	
	resizeReset();
	animationLoop();
}

function resizeReset() {
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
	ctx.fillStyle = "#222";
	ctx.fillRect(0, 0, w, h);
}

function animationLoop() {
	if (fireworks.length < fireworksMax && Math.random() < fireworksChance) {
		fireworks.push(new Firework());
		hue += 10;
	}
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "rgba(0, 0, 0, .1)";
	ctx.fillRect(0, 0, w, h);
	ctx.globalCompositeOperation = "lighter";

	drawScene();
	arrayCleanup();
	requestAnimationFrame(animationLoop);
}

function drawScene() {
	fireworks.map((firework) => {
		firework.update();
		firework.draw();
	});
	particles.map((particle) => {
		particle.update();
		particle.draw();
	});
	circles.map((circle) => {
		circle.update();
		circle.draw();
	});
}

function arrayCleanup() {
	let dump1 = [], dump2 = [], dump3 = [];

	fireworks.map((firework) => {
		if (firework.alpha > 0) {
			dump1.push(firework);
		} else {
			createFireworks(firework.x, firework.y, firework.hue);
		}
	});
	fireworks = dump1;

	particles.map((particle) => {
		if (particle.size > 0) dump2.push(particle);
	});
	particles = dump2;

	circles.map((circle) => {
		if (circle.size < circle.endSize) dump3.push(circle);
	});
	circles = dump3;
}

function createFireworks(x, y, hue) {
	for (let i = 0; i < 10; i++) {
		particles.push(new Particle(x, y, hue, i));
	}
	circles.push(new Circle(x, y, hue));
}

function getRandomInt(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

function easeOutQuart(x) {
	return 1 - Math.pow(1 - x, 4);
}

class Firework {
	constructor() {
		this.x = getRandomInt(w * 0.3, w * 0.7);
		this.y = h;
		this.targetY = getRandomInt(h * 0.2, h * 0.4);
		this.hue = hue;
		this.alpha = 1;
		this.tick = 0;
		this.ttl = getRandomInt(120, 180);
	}
	draw() {
		if (this.tick <= this.ttl) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
			ctx.fill();
			ctx.closePath();
		}
	}
	update() {
		let progress = 1 - (this.ttl - this.tick) / this.ttl;

		this.y = h - (h - this.targetY) * easeOutQuart(progress);
		this.alpha = 1 - easeOutQuart(progress);

		this.tick++;
	}
}

class Particle {
	constructor(x, y, hue, i) {
		this.x = x;
		this.y = y;
		this.hue = hue;
		this.size = getRandomInt(2, 3);
		this.speed = getRandomInt(30, 40) / 10;
		this.angle = getRandomInt(0, 36) + 36 * i;
	}
	draw() {
		if (this.size > 0) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
			ctx.fill();
			ctx.closePath();
		}
	}
	update() {
		this.radian = (Math.PI / 180) * this.angle;
		this.x += this.speed * Math.sin(this.radian);
		this.y += this.speed * Math.cos(this.radian);
		this.size -= 0.05;
	}
}

class Circle {
	constructor(x, y, hue) {
		this.x = x;
		this.y = y;
		this.hue = hue;
		this.size = 0;
		this.endSize = getRandomInt(100, 130);
	}
	draw() {
		if (this.size < this.endSize) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, .2)`;
			ctx.fill();
			ctx.closePath();
		}
	}
	update() {
		this.size += 15;
	}
}

// window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeReset);