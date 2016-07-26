var fs = require('fs');
var join = require('path').join;
var mkdirp = require('mkdirp');
var through2 = require('through2');


function generate(blueprint, options) {
  if (blueprint === undefined) {
    return console.error('[Error] Please specify the blueprint you want to generate.');
  }
  var path = join(process.cwd(), 'blueprints', blueprint);
  fs.access(path, fs.F_OK, function(err) {
    if (err) {
      return console.error('Blueprint not found or blueprints folder is missing.');
    }

    if (!options.hasOwnProperty('name')) {
      return console.error('[Error] Please specify a name for the blueprint after its generation.');
    }

    var parts = options.name.split('/');

    var module = '';
    var name = '';
    if (parts.length === 1) {
      name = parts[0];
    } else if (parts.length === 2)  {
      module = parts[0];
      name = parts[1];
    } else {
      return console.error('[Error] Please specify the name for the blueprint in the following syntax: module/name.');
    }

    var destinationPath = join(process.cwd(), 'src', module, blueprint + 's', name);

    mkdirp(destinationPath, function (err) {
      if (err) {
        return console.error('[Error]', err);
      }
    });

    var files = fs.readdirSync(path);
    files.forEach(function(filename) {
      var sourceFilePath = join(path, filename);
      var fileDest = join(destinationPath, filename);

      var sourceStream = fs.createReadStream(sourceFilePath, {
        encoding: 'utf8',
      });
      var targetStream = fs.createWriteStream(fileDest);

      sourceStream
        .pipe(through2({
          decodeStrings: false,
          encoding: 'utf8',
        }, function (chunk, enc) {
          chunk = chunk.replace(/{{name}}/g, options.name);
          this.push(chunk);
        }))
        .pipe(targetStream);
    });
  });
}


module.exports = generate;
