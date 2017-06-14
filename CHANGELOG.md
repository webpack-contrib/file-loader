# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0-beta.5"></a>
# [1.0.0-beta.5](https://github.com/nadiia/file-loader/compare/v1.0.0-beta.2...v1.0.0-beta.5) (2017-06-12)

### BREAKING CHANGES

* storeEmittedFile option renamed to storeFile
* storeEmittedFileTarget option renamed to storeFileTarget
* when storeFile option is set to true files will be storred instead of emmiting

<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/nadiia/file-loader/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2017-06-12)

### Features

* storeEmittedFile option is added to store emitted files list
* storeEmittedFileTarget option is added to store emmited files for a specific target
* storageSingleton: stores the emitted files
* assetsManifestPlugin: a webpack plugin to add assets stored in the storageSingleton to a compilation.assets array


<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/webpack/file-loader/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2017-06-09)

### Code Refactoring

* Upgrade to defaults 1.3.0 ([#170](https://github.com/webpack-contrib/file-loader/pull/170)) ([632ed72](https://github.com/webpack/file-loader/commit/acd6c2f))


<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/webpack/file-loader/compare/v0.11.2...v1.0.0-beta.0) (2017-06-07)


### Code Refactoring

* Apply webpack-defaults ([#167](https://github.com/webpack/file-loader/issues/167)) ([632ed72](https://github.com/webpack/file-loader/commit/632ed72))


### BREAKING CHANGES

* Enforces Webpack standard NodeJS engines range.
   at the time of merge `>= 4.3 < 5.0.0 || >= 5.10`.



<a name="0.11.2"></a>
## [0.11.2](https://github.com/webpack/file-loader/compare/v0.11.1...v0.11.2) (2017-06-05)


### Bug Fixes

* **index:** allow to override publicPath with an empty string ([#145](https://github.com/webpack/file-loader/issues/145)) ([26ab81a](https://github.com/webpack/file-loader/commit/26ab81a))
* init `publicPath` to undefined ([#159](https://github.com/webpack/file-loader/issues/159)) ([e4c0b2a](https://github.com/webpack/file-loader/commit/e4c0b2a))



<a name="0.11.1"></a>
## [0.11.1](https://github.com/webpack/file-loader/compare/v0.11.0...v0.11.1) (2017-04-01)


### Bug Fixes

* outputPath function overriden by useRelativePath ([#139](https://github.com/webpack/file-loader/issues/139)) ([80cdee2](https://github.com/webpack/file-loader/commit/80cdee2))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/webpack/file-loader/compare/v0.10.1...v0.11.0) (2017-03-31)


### Features

* Emit files with relative urls ([#135](https://github.com/webpack/file-loader/issues/135)) ([dbcd6cc](https://github.com/webpack/file-loader/commit/dbcd6cc))



<a name="0.10.1"></a>
## [0.10.1](https://github.com/webpack/file-loader/compare/v0.10.0...v0.10.1) (2017-02-25)


### Bug Fixes

* **getOptions:** deprecation warn in loaderUtils ([#129](https://github.com/webpack/file-loader/issues/129)) ([a8358a0](https://github.com/webpack/file-loader/commit/a8358a0))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/webpack/file-loader/compare/v0.9.0...v0.10.0) (2017-01-28)


### Features

* **resources:** specify custom public file name ([6833c70](https://github.com/webpack/file-loader/commit/6833c70))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
