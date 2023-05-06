const path = require('path');
const fs = require('fs');
const outputPath = path.join(__dirname, 'project-dist');
const inputPath = path.join(__dirname, 'styles');

fs.readdir(inputPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  const output = fs.createWriteStream(path.join(outputPath, 'bundle.css'));
  files = files.filter(file => path.extname(file.name).slice(1) === 'css' && file.isFile());
  files.forEach(file => {
    const input = fs.createReadStream(path.join(inputPath, file.name), 'utf8');
    input.on('data', (chunk) => {
      output.write(chunk + '\n');
    });
  });
});