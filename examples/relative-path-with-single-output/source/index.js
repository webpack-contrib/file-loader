var Utils = {
	randomRange: function(min, max) {
		return Math.random() * (max - min) + min;
	},
	distance: function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	},
};

function FileIcon(context, scale) {
	this.context = context;
	this.canvas = this.context.canvas;
	this.image = new Image();
	this.image.src = require('../../../.github/assets/file_loader_icon.svg');
	this.scale = scale;
	this.x = Math.random() * this.canvas.clientWidth;
	this.y = Math.random() * this.canvas.clientHeight;
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
		var registrationPointX = this.image.width * this.scale * 0.5;
		var registrationPointY = this.image.height * this.scale * 0.5;
		var boundsX = this.canvas.clientWidth - registrationPointX;
		var boundsY = this.canvas.clientHeight - registrationPointY;
		if (this.x >= boundsX || this.x <= registrationPointX) {
			this.point.x *= -1;
		}
		if (this.y >= boundsY || this.y <= registrationPointY) {
			this.point.y *= -1;
		}
		if (this.x > boundsX) {
			this.x = boundsX;
		}
		if (this.y > boundsY) {
			this.y = boundsY;
		}
		if (this.x < registrationPointX) {
			this.x = registrationPointX;
		}
		if (this.y < registrationPointY) {
			this.y = registrationPointY;
		}
	},

	draw: function() {
		var imageX = this.image.width * this.scale;
		var imageY = this.image.height * this.scale;
		this.context.drawImage(this.image,
			0, 0, 128, 128, // source
			this.x - imageX * 0.5,
			this.y - imageY * 0.5,
			imageX,
			imageY,
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
	bondDistance: 300,
	numFiles: 25,
	minScale: 0.05,
	maxScale: 0.4,
};

FilesMesh.prototype = {
	constructor: FilesMesh,

	start: function() {
		this.arrange = this.arrange.bind(this);
		window.addEventListener('resize', this.arrange);
		this.arrange();

		this.files = [];
		this.draw = this.draw.bind(this);
		for (var id = 0, scale; id < this.options.numFiles; id++) {
			scale = Utils.randomRange(this.options.minScale, this.options.maxScale);
			this.files.push(new FileIcon(this.context, scale));
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
			var dependency = dependencies[id];
			var distance = Utils.distance(file.x, file.y, dependency.x, dependency.y);
			var alpha = 1 - distance / this.options.bondDistance;
			if (alpha) {
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
