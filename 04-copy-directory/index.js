const fs = require('fs');
const path = require('path');
const folderDirectory = path.join(__dirname, 'files');
const copyDirectory = path.join(__dirname, 'files-copy');

fs.mkdir(copyDirectory, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.readdir(copyDirectory, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(file => {
      fs.unlink(path.join(copyDirectory, file), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });

    fs.readdir(folderDirectory, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        fs.copyFile(path.join(folderDirectory, file), path.join(copyDirectory, file), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  });
});






