# file loader for webpack

## Usage

``` javascript
var url = require("file!./file.png");
// => emits file.png as file in the output directory and returns the public url
```

If you want to have a custom extension on your file, I have some prepared:

``` javascript
require("file/js!./javascript.js");
require("file/html!./page.html");
require("file/txt!./flash.txt");
require("file/png!./image.png");
require("file/jpg!./image.jpg");
require("file/jpeg!./image.jpeg");
require("file/swf!./flash.swf");
```

Look at the source to write your own. Pre- and postfix is possible.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)