const fs = require('fs');
const path = require('path');
const folderDirectory = path.join(__dirname, 'files');
const copyDirectory = path.join(__dirname, 'files-copy');

function cloneDirectory(currentDir, copyDir) {

  fs.rm(copyDir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    fs.mkdir(copyDir, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
        fs.readdir(currentDir, { withFileTypes: true }, (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
          files.forEach(file => {
            const current = path.join(currentDir, file.name);
            const copy = path.join(copyDir, file.name);
            if (file.isDirectory()) {
              cloneDirectory(current, copy);
            } else {
              fs.copyFile(current, copy, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            }
          });
        });
    });
  });
}

cloneDirectory(folderDirectory, copyDirectory);