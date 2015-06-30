var expect = require('chai').expect;
var PanaxJS = require('../..');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('config', function() {

	var panaxdb = new PanaxJS.Connection(config);

	/*
	ToDo: DDL Isolation Stuff
	 */
  before('authenticate', function(done) {
		panaxdb.authenticate(config.ui.username, util.md5(config.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  // CREATE Table(s)
  // INSERT Data
  });
  after(function() {
  // DROP Table(s)
  });

  // ToDo: #query Tests 
  describe('#query', function() {

  	it('should run');

  });

  // ToDo: #rebuildMetadata Tests
  describe('#rebuildMetadata', function() {

  	it('should run');

  });

  // ToDo: #clearCache Tests
  describe('#clearCache', function() {

  	it('should run');

  });

  // ToDo: #config Tests
  describe('#config', function() {

  	it('should get empty config');

  	it('should set several configs');

  	it('should get one config');

  	it('should get all configs');

  	it('should clear one config');

  	it('should clear all configs');

  });

});