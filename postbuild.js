const fs = require('fs');
const file = require('./build/asset-manifest.json')['main.js'];
const src = './build/';
const dest = './dist/';

if (!fs.existsSync(dest)){
  fs.mkdirSync(dest);
}

if (fs.existsSync(dest+'index.js')){
  fs.unlinkSync(dest+'index.js');
}

// remove source maps from production and move file to dist folder
fs.readFile(src+file, 'utf8', (err, data) => {
  if (err) {
    console.log('Unable to read file from manifest.');
    process.exit(1);
  }

  let version = `/*!\n* domain-search v${process.env.npm_package_version}\n* Licensed under MIT\n* https://github.com/godaddy/domain-search/blob/master/LICENSE\n*/\n`;

  let result = data.split('//# sourceMappingURL');

  if (result[result.length - 1] !== undefined && result.length > 1) {
    fs.writeFileSync(dest + 'index.js', version);
    fs.appendFileSync(dest + 'index.js', result.slice(0, result.length - 1));
  }
});
