// prepend json crap
//var result = "{\"list\":[";
var result = "";

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
    info.message  = fs.readFileSync(filename, 'utf8');//, function(err, data) {

  }
  //return JSON.stringify(info);
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

console.log(result);

