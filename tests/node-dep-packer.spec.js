var expect = require('chai').expect;
var packer = require('../node-dep-packer');

describe('node-dep-packer', () => {
  beforeEach(() => {
    // Set keepPackageData back to default value after each test, just to make sure we run clean every time.
    packer.keepPackageData = false;
  });
  it('the type of the exported variables is correct', () => {
    expect(packer.keepPackageData).to.be.a('boolean');
    expect(packer.merge).to.be.a('function');
  });
  it('returns an \'empty\' package.json is nothing is given', () => {
    expect(packer.merge('', false, 0b100, new Map())).to.deep.equal({
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
      dependencies: {},
      devDependencies: {}
    });
    expect(packer.merge()).to.deep.equal({
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
      dependencies: {},
      devDependencies: {}
    });
  });
  it('discards default package data by default', () => {
    expect(packer.merge('./tests/package.json')).to.deep.equal({
      name: "",
      version: "",
      description: "",
      main: "",
      scripts: {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      keywords: [],
      author: "",
      license: "",
      dependencies: {
        ramda: "^0.25.0.fake"
      },
      devDependencies: {
        chai: "^4.2.0.fake",
        mocha: "^5.2.0.fake"
      }
    });
  });
  it('keeps package data of the most right supplied package.json file', () => {
    packer.keepPackageData = true;
    expect(packer.merge('./tests/package.json')).to.deep.equal({
      name: "node-dep-packer-fake",
      version: "1.0.0",
      description: "A node module to combine several package.json into one. Fake one.",
      main: "node-dep-packer-fake.js",
      scripts: {
        test: "echo \"Error: fake\" && exit 1"
      },
      keywords: [
        "node",
        "package",
        "json",
        "combine",
        "fake"
      ],
      author: "Alex",
      license: "MIT",
      dependencies: {
        ramda: "^0.25.0.fake"
      },
      devDependencies: {
        chai: "^4.2.0.fake",
        mocha: "^5.2.0.fake"
      }
    });
  });
  it('ignores all other type of variables given as parameters for merge', () => {
    expect(packer.merge(new Map(), './tests/package.json', undefined, '123', './tests/nonpackage.txt', null, 0x0,
      false, './tests/package2.json', false, new Error('test'))).to.deep.equal({
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
      });
  });
  it('merges multiple package.json files succesfully using various settings', () => {
    expect(packer.merge('./tests/package2.json', './tests/package.json')).to.deep.equal({
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
    });

    packer.keepPackageData = true;

    expect(packer.merge('./tests/package2.json', './tests/package.json')).to.deep.equal({
      name: "node-dep-packer-fake",
      version: "1.0.0",
      description: "A node module to combine several package.json into one. Fake one.",
      main: "node-dep-packer-fake.js",
      scripts: {
        test: "echo \"Error: fake\" && exit 1"
      },
      keywords: [
        "node",
        "package",
        "json",
        "combine",
        "fake"
      ],
      author: "Alex",
      license: "MIT",
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
    });

    expect(packer.merge('./tests/package.json', './tests/package2.json')).to.deep.equal({
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
    });
  });
});
