var fs = require('fs');
var join = require('path').join;


function generate(blueprint, options) {
  var path = join(process.cwd(), 'blueprints', blueprint);
  fs.access(path, fs.F_OK, function(err) {
    if (err) {
      return console.log('Blueprint not found or blueprints folder is missing.');
    }
    console.log('ok', path);
  });
}


module.exports = generate;
