/* directory_to_json.js
 *
 * Node script to convert a directory of folders and html files into json
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
         title : path.basename(filename).replace(".html", "")
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
    // should be html file 
    info.type = "content";

    // read contents of file into message variable
    info.message  = fs.readFileSync(filename, 'utf8');

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

// remove undefined (bad folders)
result = result.replace(/undefined,/g, "");

// replace non-escaped single quotes with double quotes
result = result.replace(/([^\\])'/g, "$1\"");

// replace escape characters
result = result.replace(/\\'/g, "'");

// replace all double escape characters
result = result.replace(/(\\\\)/g, "\\");

// strip null characters u0000
result = result.replace(/\\u0000/g, "");

// output result
console.log(result);
