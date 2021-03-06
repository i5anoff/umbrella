<!-- This file is generated - DO NOT EDIT! -->

# @thi.ng/api

[![npm version](https://img.shields.io/npm/v/@thi.ng/api.svg)](https://www.npmjs.com/package/@thi.ng/api)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/api.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [API](#api)
  - [Environment variables](#environment-variables)
- [Authors](#authors)
- [License](#license)

## About

Common, generic types, interfaces & mixins.

This package is implicitly used by most other projects in this
repository. It defines:

- Dozens of generic, common interfaces & types
- Class & method decorators
- Mixins
- Logging
- Assert (can be disabled for production builds)
- Typedarray utilities

### Status

**STABLE** - used in production

## Installation

```bash
yarn add @thi.ng/api
```

## Dependencies

None

## API

[Generated API docs](https://docs.thi.ng/umbrella/api/)

### Environment variables

The following env variables are used to control the behavior of some functions in production builds:

- `UMBRELLA_ASSERTS` -  if set to `1` the
  [assert](https://github.com/thi-ng/umbrella/tree/master/packages/api/src/assert.ts)
  function will **always** be enabled. By default, `assert()` is
  disabled for production builds, i.e. if `process.env.NODE_ENV ===
  "production"`.
- `UMBRELLA_GLOBALS` -  if set to `1` the
  [exposeGlobal](https://github.com/thi-ng/umbrella/tree/master/packages/api/src/expose.ts)
  function will **always** be enabled. By default, `exposeGlobal()` is
  disabled for production builds, i.e. if `process.env.NODE_ENV ===
  "production"`.

## Authors

Karsten Schmidt

## License

&copy; 2016 - 2020 Karsten Schmidt // Apache Software License 2.0
