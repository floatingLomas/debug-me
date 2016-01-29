# debug-me

> Let the location decide what the `debug` label should be!

## Installation

```
npm install debug-me
```

## Usage

For the projected called `hello-there` in its `package.json`, doing the following in a file called `lib/foo/bar/baz.js`:
```
var debug = require('debug-me');

debug("I'm a little teapot", {
  short: true,
  stout: true
});
```
Produces this output:

> hello-there:foo:bar:baz I'm a little teapot +0ms { short: true, stout: true }

Basically, it will take the calling file's path and name (minus `lib` or `src` if present) and turn that into the `debug` label.

If you need to add a path to exclude from the pattern, do so with `DebugMe.addSegmentToSkip('test')`.  Remove it with `DebugMe.removeSegmentToSkip('lib')`.  See what's there at `DebugMe.segmentsToSkip`.
