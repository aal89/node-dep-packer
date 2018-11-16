# node-dep-packer

A module to easily and deeply merge package.json files into a singular one.

## Install

```sh
$ npm install --save node-dep-packer
```

## API

### `packer.merge(...packages)`

Merges multiple package.json files into one. Accepts a list of strings that should point to package.json files,
which it then tries to parse into JSON objects prior to deeply merging them from the right. Discards any unknown
given files/values without error. Returns a combined version of all the given package.json files with the attribtues
name, version, description, main, scripts, keywords, author and license set to empty (behaviour is overridable through
the keepPackageData variable). Returns a Javascript object containg the merger.

##### `packages`

`string` — Spread out list of string to paths to package.json files. Ignores everything but string variables.

### `packer.keepPackageData`

A settable flag to either keep or discard the default package.json data after the merger. Keeps the data from the most
right supplied package.json file. See **Usage** for examples. Expects a `boolean`. Defaults to `false`.

## Usage

Javascript and Typescript examples below. For expanded exmaples see the `tests` folder.

### Javascript

```javascript
const packer = require('node-dep-packer');

packer.keepPackageData = true; //-> default is false
packer.merge('./package.json', '/Users/demo/Documents/test/package.json'); //-> resolves and gives output
packer.merge(new Error(''), './package.json', false, new Map(), 0x0, '/Users/demo/Documents/test/package.json', undefined); //-> resolves and gives output (ignores non strings)
```

**Output**

```javascript
{
  name: "random-package",
  version: "0.9.0",
  description: "I do not have a description.",
  main: "also-no-main.js",
  scripts: {
    test: "mocha"
  },
  keywords: [],
  author: "Jane Doe",
  license: "UNLICENSED",
  dependencies: {
    "express": "~4.10.0",
    "has-deep-value": "1.1.0",
    "dts-gen": "^1.0.0",
    "ramda": "^0.25.0.fake"
  },
  devDependencies: {
    chai: "^4.2.0.fake",
    mocha: "^5.2.0.fake"
  }
}
```

### Javascript

```javascript
const packer = require('node-dep-packer');

packer.merge('./package.json', '/Users/demo/Documents/test/package.json'); //-> resolves and gives output
packer.merge(new Error(''), './package.json', false, new Map(), 0x0, '/Users/demo/Documents/test/package.json', undefined); //-> resolves and gives output (ignores non strings)
```

**Output**

```javascript
{
  name: "",
  version: "",
  description: "",
  main: "",
  scripts: {
    test: "echo \"Error: no test specified\" && exit 1"
  },
  keywords: [],
  author: "",
  license: "",
  dependencies: {
    "express": "~4.10.0",
    "has-deep-value": "1.1.0",
    "dts-gen": "^1.0.0",
    "ramda": "^0.25.0.fake"
  },
  devDependencies: {
    chai: "^4.2.0.fake",
    mocha: "^5.2.0.fake"
  }
}
```

*Note: the output is just exemplary. Depends on which package.json files you actually use.*

### Typescript

Included is an `index.d.ts` file, Typescript should automatically pick this file up and apply the typings across your codebase. The usage and output is then the same as for regular Javascript.

```typescript
import { keepPackageData, merge } from "node-dep-packer";
 
keepPackageData = true;
merge("", "", "");
```

## License
Copyright © 2018, Alex Burghardt. Made available under the MIT license.