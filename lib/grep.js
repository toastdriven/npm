module.exports = exports = grep

var ls    = require('./ls'),
    registry = require("./utils/registry"),
    sys = require('sys')

function grep(args, cb) {
  if (args.length !== 1) {
    return cb(new Error("Usage: npm grep '<pattern>'"))
  }
  
  registry.get(function (er, remote) {
    if (er) remote = {}
    var stdout = process.stdout,
        pattern = args[0]
    stdout.write(print_list(search_list(remote, pattern)))
    if (stdout.flush()) cb()
    else stdout.on("drain", cb)
  })
}

function strcmp (a, b) { return a > b ? 1 : -1 }
function print_list(packages) {
  var packages = packages.sort(strcmp)
  return packages.join("\n")+"\n"
}

function search_list(registry, pattern) {
  matches = []
  regex = new RegExp(pattern, "gis")
  for(package_name in registry) {
    if(package_name.match(regex)) {
      matches.push(package_name);
    }
  }
  return matches
}
