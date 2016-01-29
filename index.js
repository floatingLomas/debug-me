const path = require('path');
const _debug = require('debug');
const callerId = require('caller-id');
const AppRootDir = require('app-root-dir');

const rootDir = AppRootDir.get();
const callerPackage = require(path.join(rootDir, 'package.json'));

const meta = _debug('debug-me');

const pathSegmentsToSkip = ['lib', 'src'];

const debuggers = {};

function DebugMe() {
  var label = buildLabelFromCallerFile(callerId.getData().filePath);

  meta('Getting Debug', {
    label: label,
    cached: !!debuggers[label]
  });

  // Make sure they're the same color if the same thing is requested twice
  if (!debuggers[label]) debuggers[label] = _debug(label);

  return debuggers[label];
}

function buildLabelFromCallerFile(callerFile) {
  var relativePath = path.relative(rootDir, callerFile);

  var parsedPath = path.parse(relativePath);

  var pieces = parsedPath.dir.split(path.sep).filter(function(e) {
    return pathSegmentsToSkip.indexOf(e) < 0;
  });

  pieces.unshift(callerPackage.name);
  pieces.push(parsedPath.name);

  return pieces.filter(notEmpty).join(':');
}

function notEmpty(e) {
  return !!e;
}

// From here: http://stackoverflow.com/a/29581862
function getCallerFile() {
  var originalFunc = Error.prepareStackTrace;

  var callerfile;
  try {
    var err = new Error();
    var currentfile;

    Error.prepareStackTrace = function(err, stack) {
      return stack;
    };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return callerfile;
}

module.exports = exports = DebugMe;
