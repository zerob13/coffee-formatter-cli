#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var pkg = require(path.join(__dirname, 'package.json'));

program
  .version(pkg.version)
  .arguments('<file>')
  .action(function(file) {
    file = file;

  });
program.parse(process.argv);
var data = '';
var CF = require('./formatter');

if (typeof file === 'undefined') {
  input = process.stdin;
  input.resume();
  input.setEncoding('utf8');
  input.on('data', function(chunk) {
    data += chunk;
  });
  input.on('end', function() {
    formatIt(data);
  });

} else {
  var text = fs.readFileSync(file, 'utf8');
  formatIt(text);
}

function formatIt(text) {
  var lines = text.split('\n');
  var resultArr = [];
  for (var i = 0; i < lines.length; i++) {
    var curr = lines[i];
    var p = CF.formatTwoSpaceOperator(curr);
    p = CF.formatOneSpaceOperator(p);
    p = CF.shortenSpaces(p);
    resultArr.push(p);
  }
  var result = resultArr.join('\n');
  process.stdout.write(result);
  process.exit(0);
}
