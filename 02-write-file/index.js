const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const endExecution = () => {
  rl.write('Bye! See you soon)');
  rl.close();
};

rl.write('Enter smth...\n');

rl.on('line', (data) => {
  data.toLowerCase() === 'exit' ? endExecution() : output.write(`${data}\n`);
});

rl.on('SIGINT', () => {
  endExecution();
});

