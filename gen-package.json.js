import fs from 'fs';

const rootPackageJson = JSON.parse(fs.readFileSync('./package.json').toString());

// Create the new package.json
const newPackageJson = {
  name: rootPackageJson.name,
  version: rootPackageJson.version,
  description: rootPackageJson.description,
  author: rootPackageJson.author,
  license: rootPackageJson.license,
  keywords: rootPackageJson.keywords,
  bin: {
    "c3-cli": "./index.js",
    "c3": "./index.js"
  },
  name: rootPackageJson.name,
  name: rootPackageJson.name,
  preferGlobal: true,
  dependencies: rootPackageJson.dependencies,
  repository: {
    type: "git",
    url: "git+https://github.com/diptox-c3/c3-cli.git"
  },
  bugs: {
    url: "https://github.com/diptox-c3/c3-cli/issues"
  },
  homepage: "https://github.com/diptox-c3/c3-cli#readme"
}

// Write the new package.json
fs.writeFileSync('./src/package.json',JSON.stringify(newPackageJson,null,2));

// Copy Readme
fs.copyFileSync('./README.md', './src/README.md');

process.exit(0);