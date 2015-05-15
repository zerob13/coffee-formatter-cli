(function() {
  var Lazy, ONE_SPACE_OPERATORS, TWO_SPACE_OPERATORS, argv, file, filename, formatOneSpaceOperator, formatTwoSpaceOperator, fs, getExtension, inStringOrComment, lazy, notInStringOrComment, shortenSpaces, _i, _len, _ref,
    __indexOf = [].indexOf || function(item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
      }
      return -1;
    };

  Lazy = require('lazy');

  fs = require('fs');

  argv = (require('optimist'))["default"]('tab-width', 2)["default"]('use-space', true).argv;

  TWO_SPACE_OPERATORS = ['?=', '=', '+=', '-=', '==', '<=', '>=', '!', '>', '<', '+', '-', '*', '/', '%'];

  ONE_SPACE_OPERATORS = [':', '?', ')', '}', ','];

  inStringOrComment = function(index, line) {
    var c, cc, i, ii, subLine, _i, _j, _k, _len, _len1, _len2;
    for (i = _i = 0, _len = line.length; _i < _len; i = ++_i) {
      c = line[i];
      if (c === '#' && i <= index) {
        return true;
      }
      if (c === "'" || c === '"') {
        subLine = line.substr(i + 1);
        for (ii = _j = 0, _len1 = subLine.length; _j < _len1; ii = ++_j) {
          cc = subLine[ii];
          if (cc === c) {
            if ((i <= index && index <= (ii + i + 1))) {
              return true;
            } else {
              return inStringOrComment(index - (ii + 1), line.substr(ii + 1));
            }
          }
        }
      }
      if (c === "/") {
        subLine = line.substr(i + 1);
        for (ii = _k = 0, _len2 = subLine.length; _k < _len2; ii = ++_k) {
          cc = subLine[ii];
          if (cc === " ") {
            continue;
          }
          if (cc === c) {
            if ((i <= index && index <= (ii + i + 1))) {
              return true;
            } else {
              return inStringOrComment(index - (ii + 1), line.substr(ii + 1));
            }
          }
        }
      }
    }
    return false;
  };

  notInStringOrComment = function(index, line) {
    return !inStringOrComment(index, line);
  };

  getExtension = function(filename) {
    var i;
    i = filename.lastIndexOf('.');
    if (i < 0) {
      return '';
    } else {
      return filename.substr(i + 1);
    }
  };

  formatTwoSpaceOperator = function(line) {
    var c, i, newLine, operator, skipNext, _i, _j, _len, _len1, _ref, _ref1;
    for (_i = 0, _len = TWO_SPACE_OPERATORS.length; _i < _len; _i++) {
      operator = TWO_SPACE_OPERATORS[_i];
      newLine = '';
      skipNext = false;
      for (i = _j = 0, _len1 = line.length; _j < _len1; i = ++_j) {
        c = line[i];
        if ((line.substr(i).indexOf(operator) === 0) && (notInStringOrComment(i, line)) && (!((operator.length === 1) && ((_ref = line[i + 1], __indexOf.call(TWO_SPACE_OPERATORS, _ref) >= 0) || (_ref1 = line[i - 1], __indexOf.call(TWO_SPACE_OPERATORS, _ref1) >= 0))))) {
          newLine += " " + operator + " ";
          if (operator.length === 2) {
            skipNext = true;
          }
        } else {
          if (!skipNext) {
            newLine += c;
          }
          skipNext = false;
        }
      }
      line = shortenSpaces(newLine);
    }
    return line;
  };

  formatOneSpaceOperator = function(line) {
    var c, i, newLine, operator, thisCharAndNextOne, _i, _j, _len, _len1;
    for (_i = 0, _len = ONE_SPACE_OPERATORS.length; _i < _len; _i++) {
      operator = ONE_SPACE_OPERATORS[_i];
      newLine = '';
      for (i = _j = 0, _len1 = line.length; _j < _len1; i = ++_j) {
        c = line[i];
        thisCharAndNextOne = line.substr(i, 2);
        if ((line.substr(i).indexOf(operator) === 0) && (notInStringOrComment(i, line)) && (line.substr(i).indexOf('::') !== 0) && (line.substr(i - 1).indexOf('::') !== 0) && (line.substr(i + 1).indexOf('?') !== 0) && (thisCharAndNextOne !== "),") && (thisCharAndNextOne !== ")(") && (thisCharAndNextOne !== ").") && (thisCharAndNextOne !== ")[") && (thisCharAndNextOne !== "))")) {
          newLine += "" + operator + " ";
        } else {
          newLine += c;
        }
      }
      line = shortenSpaces(newLine);
    }
    return line;
  };

  shortenSpaces = function(line) {
    var c, i, newLine, prevChar, trimTrailing, _i, _j, _len, _len1;
    trimTrailing = function(str) {
      return str.replace(/\s\s*$/, "");
    };
    prevChar = null;
    newLine = '';
    for (i = _i = 0, _len = line.length; _i < _len; i = ++_i) {
      c = line[i];
      if (c === ' ') {
        newLine += c;
      } else {
        line = line.substring(i);
        break;
      }
    }
    for (i = _j = 0, _len1 = line.length; _j < _len1; i = ++_j) {
      c = line[i];
      if (!(notInStringOrComment(i, line) && ((c === ' ' && ' ' === prevChar)))) {
        newLine = newLine + c;
      }
      prevChar = c;
    }
    return trimTrailing(newLine);
  };

  _ref = argv._;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    filename = _ref[_i];
    if ((getExtension(filename)) !== 'coffee') {
      console.log("" + filename + " doesn't appear to be a CoffeeScript file. Skipping...");
      console.log("Use --force to format it anyway.");
    } else {
      file = '';
      lazy = new Lazy(fs.createReadStream(filename, {
        encoding: 'utf8'
      }));
      // lazy.on('end', function() {
      //   return fs.writeFileSync(filename, file);
      // });
      lazy.lines.forEach(function(line) {
        var newLine;
        line = String(line);
        if (line !== '0') {
          newLine = line;
          newLine = formatTwoSpaceOperator(newLine);
          newLine = formatOneSpaceOperator(newLine);
          newLine = shortenSpaces(newLine);
          return file += newLine + '\n';
        } else {
          return file += '\n';
        }
      });
    }
  }

  exports.shortenSpaces = shortenSpaces;

  exports.formatTwoSpaceOperator = formatTwoSpaceOperator;

  exports.notInStringOrComment = notInStringOrComment;

  exports.formatOneSpaceOperator = formatOneSpaceOperator;

}).call(this);
