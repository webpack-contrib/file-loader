var Utils = {
	randomRange: function(min, max) {
		return Math.random() * (max - min) + min;
	},
	distance: function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	},
};

function FileIcon(context, x, y, width, height) {
	this.context = context;
	this.image = new Image();
	this.image.src = require('../../../.github/assets/file_loader_icon.svg');
	this.canvasWidth = this.context.canvas.clientWidth;
	this.canvasHeight = this.context.canvas.clientHeight;
	this.scale = Math.floor(Utils.randomRange(0.05, 1) * 100) / 100;
	this.x = Math.random() * this.canvasWidth;
	this.y = Math.random() * this.canvasHeight;
	this.point = {
		x: Math.cos(Math.floor(Math.random() * 360)) * 1.1,
		y: Math.sin(Math.floor(Math.random() * 360)) * 1.1
	};
}

FileIcon.prototype = {
	constructor: FileIcon,

	update: function() {
		this.bounds();
		this.x += this.point.x;
		this.y += this.point.y;
	},

	bounds: function() {
		var boundsX = this.canvasWidth - this.image.width * this.scale / 2;
		var boundsY = this.canvasHeight - this.image.height * this.scale / 2;
		if (this.x >= boundsX || this.x <= 0) {
			this.point.x *= -1;
		}
		if (this.y >= boundsY || this.y <= 0) {
			this.point.y *= -1;
		}
		if (this.x > boundsX) {
			this.x = boundsX;
		}
		if (this.y > boundsY) {
			this.y = boundsY;
		}
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.y < 0) {
			this.y = 0;
		}
	},

	draw: function() {
		var imageX = this.image.width * this.scale;
		var imageY = this.image.height * this.scale;
		this.context.drawImage(this.image,
			this.x - imageX * 0.5,
			this.y - imageY * 0.5,
			imageX,
			imageY
		);
	},
};

function FilesMesh(selector, options) {
	this.options = Object.assign(FilesMesh.defaults, options);
	this.canvas = document.querySelector(selector);
	this.context = this.canvas.getContext('2d');
	this.rgb = this.options.lineColor.match(/\d+/g);
};

FilesMesh.defaults = {
	lineColor: 'rgb(234, 239, 240)',
	linkRadius: 300,
	numFiles: 25,
	minScale: 2,
	maxScale: 2,
};

FilesMesh.prototype = {
	constructor: FilesMesh,

	start: function() {
		this.arrange = this.arrange.bind(this);
		window.addEventListener('resize', this.arrange);
		this.arrange();

		this.files = [];
		this.draw = this.draw.bind(this);
		for (var id = 0; id < this.options.numFiles; id++){
			this.files.push(new FileIcon(this.context, 0, 0, 64, 64));
		}
		this.drawFrameID = window.requestAnimationFrame(this.draw);
	},

	stop: function(flush) {
		window.removeEventListener('resize', this.arrange);
		window.cancelAnimationFrame(this.drawFrameID);
		delete this.drawFrameID;
	},

	bindFiles: function(file, dependencies) {
		for (var id = 0; id < dependencies.length; id++) {
			var distance = Utils.distance(file.x, file.y, dependencies[id].x, dependencies[id].y);
			var alpha = 1 - distance / this.options.linkRadius;
			if (alpha) {
				var dependency = dependencies[id];
				this.context.lineWidth = 0.5;
				this.context.strokeStyle = 'rgba('+ this.rgb[0] +','+ this.rgb[1] +','+ this.rgb[2] +','+ alpha +')';
				this.context.beginPath();
				this.context.moveTo(file.x, file.y);
				this.context.lineTo(dependency.x, dependency.y);
				this.context.closePath();
				this.context.stroke();
			}
		}
	},

	draw: function() {
		var id;
		this.drawFrameID = window.requestAnimationFrame(this.draw);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (id = 0; id < this.files.length; id++) {
			this.bindFiles(this.files[id], this.files);
		}
		for (id = 0; id < this.files.length; id++) {
			this.files[id].update();
			this.files[id].draw();
		}
	},

	arrange: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	},
};

var mesh = new FilesMesh('#background');
mesh.start();