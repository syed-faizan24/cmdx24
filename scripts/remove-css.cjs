const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');
html = html.replace(/<link rel="stylesheet".*?>/, '');
fs.writeFileSync('dist/index.html', html);
