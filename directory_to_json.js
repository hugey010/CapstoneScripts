/* directory_to_json.js
 *
 * Node (javascript) to convert a directory of folders and html files into json
 * as per (json documentation a.1 whatever).
 *
 * Common usage: pipe the output to a file or curl
 *
 * Author: Tyler Hugenberg
 * Date: 2/15/2014
 * Team: Clean And Sober Toolbox
 */


// the resulting json string
var result = "";

// id counter
var identifier = 0;

var fs = require('fs')
  path = require('path')

function dirTree(filename) {
  var stats = fs.lstatSync(filename),
      info = {
         title : path.basename(filename).replace(".txt", "") // .txt -> html (depends what converting)
      };


  if (info.title.charAt(0) == '.') {
    return;
  }

  if (stats.isDirectory()) {
    info.type = "category";
    info.list = fs.readdirSync(filename).map(function(child) {
      return dirTree(filename + '/' + child);
    });
  } else {
    info.type = "content";

    // read contents of file into message variable
    var fileContents = fs.readFileSync(filename, 'utf8');
    var separatedLines = fileContents.split(/\n/g);
    // put separated lines into json structure
    var message = "";
    var i = 0;
    for (i = 0; i < separatedLines.length; i++) {
      var currentLine = separatedLines[i];
      // check for todo at beginning of line
      if (currentLine.match(/to do/i) || currentLine.match(/todo/i)) {
          info.todo = currentLine;
      } else if (i == 0) {
        message += currentLine;
        message += "<br><br>";
      } else {
        message += currentLine;
      }
    }
    if (message.length <= 1) {
      message = "";
    }

    // strip tabs from messages and todos
    message = message.replace(/\t/g, "");
    //todo = todo.replace(/\t/g, "");
    info.message = message;
  }

  info.identifier = identifier++;
  return info;
}

if (module.parent == undefined) {
  var util = require('util');
  result += util.inspect(dirTree(process.argv[2]), false, null);
}


// fix poorly formatted keys (surround with quotes)
result = result.replace(/title:/g, "\"title\":");
result = result.replace(/type:/g, "\"type\":");
result = result.replace(/message:/g, "\"message\":");
result = result.replace(/list:/g, "\"list\":");
result = result.replace(/identifier:/g, "\"identifier\":");
result = result.replace(/todo:/g, "\"todo\":");

// remove undefined (bad folders)
result = result.replace(/undefined,/g, "");

// replace non-escaped single quotes with double quotes
result = result.replace(/([^\\])'/g, "$1\"");

// replace escape characters
result = result.replace(/\\'/g, "'");

// replace all double escape characters
result = result.replace(/(\\\\)/g, "\\");

// strip null characters u0000 (for html)
//result = result.replace(g\\u0000/g, "");

// output result
console.log(result);

