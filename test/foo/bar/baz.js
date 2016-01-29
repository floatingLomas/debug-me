'use strict';

const should = require('should');
const _debug = require('debug');
const stripAnsi = require('strip-ansi');

const DebugMe = require('../../../');

const message = 'Potato';
const meta = {
  radish: 443
};

describe('DebugMe', function() {
  it('should be a Function', function() {
    DebugMe.should.be.a.Function();
  });

  describe('When called with nothing', function() {
    it('should return a `debug` function', function(done) {
      let _log = _debug.log;

      _debug.enable('*');
      _debug.log = onDebug;

      var debug = DebugMe();

      debug(message, meta);

      _debug.log = _log;
      _debug.disable('*');

      function onDebug(logEntry, logMeta) {
        let bySpaces = stripAnsi(logEntry).trim().split(' ');

        let logLabel = bySpaces.shift();
        let logMessage = bySpaces.shift();

        logLabel.should.eql('debug-me:test:foo:bar:baz');
        logMessage.should.eql(message);
        logMeta.should.eql(meta);

        done();
      }
    });
  });

  describe('When called with stuff', function() {
    it('should use the `debug` function', function(done) {
      let _log = _debug.log;

      _debug.enable('*');
      _debug.log = onDebug;

      DebugMe(message, meta);

      _debug.log = _log;
      _debug.disable('*');

      function onDebug(logEntry, logMeta) {
        let bySpaces = stripAnsi(logEntry).trim().split(' ');

        let logLabel = bySpaces.shift();
        let logMessage = bySpaces.shift();

        logLabel.should.eql('debug-me:test:foo:bar:baz');
        logMessage.should.eql(message);
        logMeta.should.eql(meta);

        done();
      }
    });
  });

  describe('.segmentsToSkip', function() {
    it('should be an Array', function() {
      DebugMe.segmentsToSkip.should.be.an.instanceOf(Array);
    });
  });

  describe('.addSegmentToSkip()', function() {
    it('should be a Function', function() {
      DebugMe.addSegmentToSkip.should.be.an.instanceOf(Function);
    });

    it('should throw if not given a String', function() {
      DebugMe.addSegmentToSkip.bind(DebugMe, 4).should.throwError('segment must be a String');
    });

    it('should add the given segment', function() {
      DebugMe.removeSegmentToSkip('potato');
      DebugMe.segmentsToSkip.should.not.containEql('potato');

      DebugMe.addSegmentToSkip('potato');
      DebugMe.segmentsToSkip.should.containEql('potato');

      DebugMe.removeSegmentToSkip('potato');
      DebugMe.segmentsToSkip.should.not.containEql('potato');
    });
  });

  describe('.removeSegmentToSkip()', function() {
    it('should be a Function', function() {
      DebugMe.removeSegmentToSkip.should.be.an.instanceOf(Function);
    });

    it('should throw if not given a String', function() {
      DebugMe.addSegmentToSkip.bind(DebugMe, 4).should.throwError('segment must be a String');
    });

    it('should remove the given segment', function() {
      DebugMe.addSegmentToSkip('potato');
      DebugMe.segmentsToSkip.should.containEql('potato');

      DebugMe.removeSegmentToSkip('potato');
      DebugMe.segmentsToSkip.should.not.containEql('potato');
    });
  });
});
