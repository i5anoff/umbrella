# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.5](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.1.4...@thi.ng/rle-pack@2.1.5) (2019-11-30)

**Note:** Version bump only for package @thi.ng/rle-pack





## [2.1.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.1.3...@thi.ng/rle-pack@2.1.4) (2019-11-09)

**Note:** Version bump only for package @thi.ng/rle-pack





## [2.1.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.1.2...@thi.ng/rle-pack@2.1.3) (2019-08-21)

**Note:** Version bump only for package @thi.ng/rle-pack





## [2.1.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.1.1...@thi.ng/rle-pack@2.1.2) (2019-07-31)

**Note:** Version bump only for package @thi.ng/rle-pack





## [2.1.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.1.0...@thi.ng/rle-pack@2.1.1) (2019-07-12)

**Note:** Version bump only for package @thi.ng/rle-pack





# [2.1.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.0.6...@thi.ng/rle-pack@2.1.0) (2019-07-07)


### Features

* **rle-pack:** enable TS strict compiler flags (refactor) ([17c426b](https://github.com/thi-ng/umbrella/commit/17c426b))





## [2.0.6](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.0.5...@thi.ng/rle-pack@2.0.6) (2019-04-24)

**Note:** Version bump only for package @thi.ng/rle-pack





## [2.0.5](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.0.4...@thi.ng/rle-pack@2.0.5) (2019-04-02)

**Note:** Version bump only for package @thi.ng/rle-pack





## [2.0.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@2.0.3...@thi.ng/rle-pack@2.0.4) (2019-03-28)

**Note:** Version bump only for package @thi.ng/rle-pack







# [2.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@1.0.8...@thi.ng/rle-pack@2.0.0) (2019-01-21)


### Build System

* update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))


### BREAKING CHANGES

* enabled multi-outputs (ES6 modules, CJS, UMD)

- build scripts now first build ES6 modules in package root, then call
  `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
- all imports MUST be updated to only refer to package level
  (not individual files anymore). tree shaking in user land will get rid of
  all unused imported symbols.


<a name="1.0.0"></a>
# [1.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/rle-pack@0.2.24...@thi.ng/rle-pack@1.0.0) (2018-08-24)


### Bug Fixes

* **rle-pack:** fix initial repeat counts in encodeBytes(), update readme ([8565edb](https://github.com/thi-ng/umbrella/commit/8565edb))


### Features

* **rle-pack:** add support for custom input word sizes ([fd8e761](https://github.com/thi-ng/umbrella/commit/fd8e761))
* **rle-pack:** further update data format (non-repeats) ([4041521](https://github.com/thi-ng/umbrella/commit/4041521))
* **rle-pack:** update data format, custom repeat sizes, rename fns ([694a253](https://github.com/thi-ng/umbrella/commit/694a253))


### BREAKING CHANGES

* **rle-pack:** new API and encoding format, see readme
for details
