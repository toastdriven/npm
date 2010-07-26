
var log = require("./log")
  , path = require("path")
  , hasSSL = false
try {
  hasSSL = !!(process.binding("crypto") && require("crypto"))
} catch (ex) {}

module.exports =
  { "auto-activate" : "always"
  , "auto-deactivate" : true
  , tag : "latest"
  , root : path.join(process.execPath, "..", "..", "lib", "node")
  , globalconfig : path.join(process.execPath, "..", "..", "etc", "npmrc")
  , userconfig : path.join(process.env.HOME, ".npmrc")
  , binroot : path.dirname(process.execPath)
  , registry : hasSSL ? "https://registry.npmjs.org/"
             : "http://registry.npmjs.org/"
  }
