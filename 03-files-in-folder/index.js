const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    if (file.isFile()) {
      const fileExtension = path.extname(file.name);
      const fileName = file.name.replace(fileExtension, '');

      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        const sizeInKB = (stats.size / 1024).toFixed(3);
        console.log(`${fileName} - ${fileExtension.slice(1)} - ${sizeInKB}kB`);
      })
    }
  })
});
