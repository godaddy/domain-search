const fs = require('fs');
const file = require('./build/asset-manifest.json')['main.js'];
const dest = './dist/';

if (!fs.existsSync(dest)){
  fs.mkdirSync(dest);
}

if (fs.existsSync(dest+'index.js')){
  fs.unlinkSync(dest+'index.js');
}

const mainFile = file.replace('/domain-search', './build');

// remove source maps from production and move file to dist folder
fs.readFile(mainFile, 'utf8', (err, data) => {
  if (err) {
    console.log('Unable to read file from manifest.');
    process.exit(1);
  }

  let version = `/*!\n* domain-search v${process.env.npm_package_version}\n* Licensed under MIT\n*/\n`;

  let result = data.split('//# sourceMappingURL');

  if (result[result.length - 1] !== undefined && result.length > 1) {
    fs.writeFileSync(dest + 'index.js', version);
    fs.appendFileSync(dest + 'index.js', result.slice(0, result.length - 1));
  }
});
