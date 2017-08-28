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
  let result = data.split('//# sourceMappingURL')
  if (result[result.length-1] !== undefined && result.length > 1) {
    fs.writeFileSync(dest+'index.js', result.slice(0, result.length-1));
  }
})
