# file loader for webpack

## Usage

``` javascript
var url = require("file!./file.png");
// => emits file.png as file in the output directory and returns the public url
```

The filename is the md5 hash of the file. The extension of the required resource is appended.

If you want to have custom pre- and postfix of your file:

``` javascript
require("file?prefix=js/&postfix=.script.js!./javascript.js");
// => js/0dcbbaa701328a3c262cfd45869e351f.script.js

require("file?prefix=html-&size=6!./page.html");
// => html-109fa8.html

require("file?postfix!./flash.txt");
// => c31e9820c001c9c4a86bce33ce43b679

require("file?hash=sha512!./image.png");
// => a720b9f140d13...781f1f78344.png
// use sha512 hash instead of md5

require("file?name=picture.png!./myself.png");
// => picture.png
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)