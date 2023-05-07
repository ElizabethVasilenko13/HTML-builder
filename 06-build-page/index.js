const fs = require('fs');
const path = require('path');

function createDirectory() {
  const distDirectory = path.join(__dirname, 'project-dist');
  const assetsDirectory = path.join(__dirname, 'assets');

  fs.rm(distDirectory, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    //create dir
    createDistDirectory(distDirectory);
    //styles
    getStyles(distDirectory);
    //assets
    cloneDirectory(assetsDirectory, path.join(distDirectory, 'assets'));
    //html
    generateHTMLfile(distDirectory);
  })
}

function createDistDirectory(destinationDir) {
  fs.mkdir(destinationDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  })
}

function generateHTMLfile(destinationDir) {
  const componentsDirectory = path.join(__dirname, 'components');
  const outputPath = path.join(destinationDir, 'index.html');
  const templatePath = path.join(__dirname, 'template.html');
  const inputTemplate = fs.createReadStream(templatePath, 'utf8');
  let htmlLayoutToString = '';

  inputTemplate.on('data', data => {
    htmlLayoutToString += data.toString();
  });

  fs.stat(componentsDirectory, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(componentsDirectory, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files = files.filter(file => path.extname(file.name) === '.html' && file.isFile());

      files.forEach(file => {
        const pathComponentsEl = path.join(componentsDirectory, file.name);
        fs.stat(pathComponentsEl, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          const fileExtension = path.extname(file.name);
          const fileName = file.name.replace(fileExtension, '');
          const input = fs.createReadStream(pathComponentsEl, 'utf8');
          input.on('data', data => {
            const output = fs.createWriteStream(outputPath);

            htmlLayoutToString = htmlLayoutToString.replace(`{{${fileName}}}`, `${data.toString()}`);
            output.write(htmlLayoutToString);
          });
        });
      });
    });
  });
}

function getStyles(destinationDir) {
  const stylesDirectory = path.join(__dirname, 'styles');
  fs.readdir(stylesDirectory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    const output = fs.createWriteStream(path.join(destinationDir, 'style.css'));
    files = files.filter(file => path.extname(file.name).slice(1) === 'css' && file.isFile());
    files.forEach(file => {
      const input = fs.createReadStream(path.join(stylesDirectory, file.name), 'utf8');
      input.on('data', (chunk) => {
        output.write(chunk + '\n');
      });
    });
  });
}

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

createDirectory();