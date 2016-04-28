var fs = require('fs');
var join = require('path').join;


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

    var destinationPath = join(process.cwd(), blueprint + 's', options.name);

    var files = fs.readdirSync(path);
    files.forEach(function(filename) {
      var fileDest = join(destinationPath, filename);

      console.log(fileDest);
    });
  });
}


module.exports = generate;
