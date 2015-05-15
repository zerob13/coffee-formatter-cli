#!/usr/bin/env node

// var fs = require('fs'),
  // path = require('path');
// var pkg = require(path.join(__dirname, 'package.json'));
var CF = require('coffee-formatter');
// var program = require('commander');
// program
//   .version(pkg.version)
//   .arguments('[file]')
//   .action(function(file) {
//     var CF = require('coffee-formatter');
//     fs.readFile(file, 'utf8', function(err, data) {
//       if (err) {
//         return console.log(err);
//       }
//       var CF = require('coffee-formatter');
//       var lines = data.split('\n');
//       var resultArr = [];
//       for (var i = 0; i < lines.length; i++) {
//         var curr=lines[i];
//         var p = CF.formatTwoSpaceOperator(curr);
//         p = CF.formatOneSpaceOperator(p);
//         p = CF.shortenSpaces(p);
//         resultArr.push(p);
//       }
//       result = resultArr.join('\n');
//       console.log(result);
//     });
//   })

// program.parse(process.argv);
