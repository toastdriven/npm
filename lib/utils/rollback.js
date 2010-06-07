
module.exports = rollback
rollback.register = register

var stack = []
  , log = require("./log")
  , inRollback = false

function rollback (cb) {
  inRollback = true
  if (stack.length === 0) return log("completed", "rollback", cb)
  var r = stack.pop()
    , fn = r.shift()
  r.push(function (er) {
    if (er) return log.er(cb, "error during rollback")(er)
    rollback(cb)
  })
  fn.rollback.apply(null, r)
}

function register () {
  if (inRollback) return undefined
  var caller = arguments.callee.caller
    , args = Array.prototype.slice.call(caller.arguments)
    , cb = args.pop()
  if (!caller.rollback) return undefined
  if (typeof cb !== "function") return log(
    "Trying to register a rollback from a non-cb function."
    , "warning")
  log(caller.name || "(anonymous) ", "rollback register")
  stack.push([caller].concat(args))
}

if (module !== process.mainModule) return undefined

function foo (a, b, c, cb) { rollback.register() }
foo.rollback = function () {
  log([].slice.call(arguments), "rolling back foo")
  var cb = Array.prototype.pop.call(arguments)
  cb()
}

foo(1,2,3,function () { log("foo") })
rollback(function (er) {
  if (er) throw er
  log("rolled back")
})
