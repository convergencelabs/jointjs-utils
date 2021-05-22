const fs = require('fs-extra');

fs.copySync('src/img', 'dist/img');
fs.copySync('src/css', 'dist/css');

