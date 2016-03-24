var loaderUtils = require('loader-utils')

module.exports = function (content) {
  this.cacheable && this.cacheable()
  if (!this.emitFile) {
    throw new Error('emitFile is required from module system')
  }
  var query = loaderUtils.parseQuery(this.query)

  var url = loaderUtils.interpolateName(this, query.name || '[path][name].[ext]', {
    context: query.context || this.options.context,
    content: content,
    regExp: query.regExp
  })

  if (query.dumpDirs) {
    query.dumpDirs.forEach((d) => {
      const re = new RegExp(`^${d}`)
      if (url.match(re)) { url = url.replace(d, '') }
    })
  }
  this.emitFile(url, content)
  return 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url) + ';'
}
module.exports.raw = true
