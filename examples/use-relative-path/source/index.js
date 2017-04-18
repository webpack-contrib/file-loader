const fileLoaderIcon = require('../../../.github/assets/file_loader_icon.svg');

const image = new Image();
image.src = fileLoaderIcon;
image.width = 30;
image.height = 30;
image.onload = () => {
	console.log('"%s" has been loaded as %o', fileLoaderIcon, image);
	document.body.appendChild(image);
};
