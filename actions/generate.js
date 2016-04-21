var fs = require('fs');
var join = require('path').join;


function generate(blueprint, options) {
  var path = join(process.cwd(), 'blueprints', blueprint);
  console.log(path);
  fs.access(path, fs.F_OK, function(err) {
    console.log(err);
  });
}


module.exports = generate;
