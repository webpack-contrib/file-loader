# file loader for webpack

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

``` javascript
var url = require("file!./file.png");
// => emits file.png as file in the output directory and returns the public url
// => returns i. e. "/public-path/0dcbbaa701328a3c262cfd45869e351f.png"
```

By default the filename is the md5 hash of the file and the extension of the required resource is appended.

You can configure a custom filename template for your file (query param `name`).

* `[ext]` the extension of the resource
* `[name]` the basename of the resource
* `[path]` the path of the resource relative to the `context` query parameter or option.
* `[hash]` the hash or the content
  * query param `hash` allows to choose a algorithm (default `md5`)
  * query param `digest` allows to choose the type of digest (default `hex`)
  * query param `size` allows to choose the length of the hash in chars

Examples

``` javascript
require("file?name=js/[hash].script.[ext]!./javascript.js");
// => js/0dcbbaa701328a3c262cfd45869e351f.script.js

require("file?name=html-[hash].html&size=6!./page.html");
// => html-109fa8.html

require("file?name=[hash]!./flash.txt");
// => c31e9820c001c9c4a86bce33ce43b679

require("file?hash=sha512&size=7&digest=base64!./image.png");
// => gdyb21L.png
// use sha512 hash instead of md5 and with only 7 chars of base64

require("file?name=picture.png!./myself.png");
// => picture.png

require("file?[path][name].[ext]?[hash]!./dir/file.png")
// => dir/file.png?e43b20c069c4a01867c31e98cbce33c9
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
