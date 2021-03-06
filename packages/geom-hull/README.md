<!-- This file is generated - DO NOT EDIT! -->

# @thi.ng/geom-hull

[![npm version](https://img.shields.io/npm/v/@thi.ng/geom-hull.svg)](https://www.npmjs.com/package/@thi.ng/geom-hull)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/geom-hull.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
- [Authors](#authors)
- [License](#license)

## About

Fast 2D convex hull (Graham Scan).

Current implementation is partially based on Clojure version of
[thi.ng/geom](http://thi.ng/geom).

### Status

**STABLE** - used in production

## Installation

```bash
yarn add @thi.ng/geom-hull
```

## Dependencies

- [@thi.ng/math](https://github.com/thi-ng/umbrella/tree/master/packages/math)
- [@thi.ng/vectors](https://github.com/thi-ng/umbrella/tree/master/packages/vectors)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/master/examples)
directory are using this package.

A selection:

### geom-convex-hull <!-- NOTOC -->

![screenshot](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/examples/geom-convex-hull.png)

[Live demo](https://demo.thi.ng/umbrella/geom-convex-hull/) | [Source](https://github.com/thi-ng/umbrella/tree/master/examples/geom-convex-hull)

## API

[Generated API docs](https://docs.thi.ng/umbrella/geom-hull/)

```ts
import { grahamScan2 } from "@thi.ng/geom-hull";

grahamScan2([[0, 0], [50, 10], [100, 0], [80, 50], [100, 100], [50, 90], [0, 100]]);
// [ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ], [ 0, 100 ] ]
```

## Authors

Karsten Schmidt

## License

&copy; 2013 - 2020 Karsten Schmidt // Apache Software License 2.0
