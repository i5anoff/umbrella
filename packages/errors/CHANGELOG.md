# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.2.1...@thi.ng/errors@1.2.2) (2019-11-30)

**Note:** Version bump only for package @thi.ng/errors





## [1.2.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.2.0...@thi.ng/errors@1.2.1) (2019-11-09)

**Note:** Version bump only for package @thi.ng/errors





# [1.2.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.1.2...@thi.ng/errors@1.2.0) (2019-08-21)


### Features

* **errors:** add defError(), refactor all existing, update readme ([ded89c2](https://github.com/thi-ng/umbrella/commit/ded89c2))





## [1.1.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.1.1...@thi.ng/errors@1.1.2) (2019-07-31)

**Note:** Version bump only for package @thi.ng/errors





## [1.1.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.1.0...@thi.ng/errors@1.1.1) (2019-07-12)

**Note:** Version bump only for package @thi.ng/errors





# [1.1.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.0.6...@thi.ng/errors@1.1.0) (2019-07-07)


### Features

* **errors:** enable TS strict compiler flags (refactor) ([8460aea](https://github.com/thi-ng/umbrella/commit/8460aea))





## [1.0.6](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.0.5...@thi.ng/errors@1.0.6) (2019-04-24)

**Note:** Version bump only for package @thi.ng/errors





## [1.0.5](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.0.4...@thi.ng/errors@1.0.5) (2019-04-02)

**Note:** Version bump only for package @thi.ng/errors





## [1.0.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@1.0.3...@thi.ng/errors@1.0.4) (2019-03-28)

**Note:** Version bump only for package @thi.ng/errors







# [1.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/errors@0.1.12...@thi.ng/errors@1.0.0) (2019-01-21)


### Build System

* update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))


### BREAKING CHANGES

* enabled multi-outputs (ES6 modules, CJS, UMD)

- build scripts now first build ES6 modules in package root, then call
  `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
- all imports MUST be updated to only refer to package level
  (not individual files anymore). tree shaking in user land will get rid of
  all unused imported symbols.


<a name="0.1.0"></a>
# 0.1.0 (2018-05-10)


### Features

* **errors:** add new package [@thi](https://github.com/thi).ng/errors ([1e97856](https://github.com/thi-ng/umbrella/commit/1e97856))
