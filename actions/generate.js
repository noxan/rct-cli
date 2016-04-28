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

    var destinationPath = join(process.cwd(), 'src', blueprint + 's', options.name);

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
