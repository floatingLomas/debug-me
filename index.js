'use strict';

var path = require('path');
var _debug = require('debug');

var meta = _debug('debug-me');

var rootDir = require('app-root-dir').get();
var callerPackage = require(path.join(rootDir, 'package.json'));

meta('rootDir', rootDir);
meta('callerPackage', callerPackage);

var pathSegmentsToSkip = ['lib', 'src'];

function DebugMe() {
  var callerPath = getCallerFile();
  meta('callerPath', callerPath);

  var debuggerInstance = getOrBuildDebugger(callerPath);

  if (arguments.length) debuggerInstance.apply(this, arguments);

  return debuggerInstance;
}

var debuggers = {};

function getOrBuildDebugger(callerPath) {
  var label = buildLabelFromCallerFile(callerPath);

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

DebugMe.addSegmentToSkip = function(segment) {
  if (typeof segment !== 'string') throw new Error('segment must be a String');

  segment = segment.trim();

  if (pathSegmentsToSkip.indexOf(segment) == -1) pathSegmentsToSkip.push(segment);
};

DebugMe.removeSegmentToSkip = function(segment) {
  if (typeof segment !== 'string') throw new Error('segment must be a String');

  var index = pathSegmentsToSkip.indexOf(segment.trim());

  if (index > -1) pathSegmentsToSkip.splice(index, 1);
};

Object.defineProperty(DebugMe, 'segmentsToSkip', {
  set: function() {},
  get: function() {
    return pathSegmentsToSkip;
  },
  configurable: false,
  enumerable: true
});

module.exports = exports = DebugMe;
