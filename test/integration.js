describe('Without mocks', function() {

	require('./integration/mssql');
	require('./integration/config');
	require('./integration/session');

});

describe('Using mocks', function() {

	var fs = require('fs');
	var PanaxJS = require('..');
	var util = require('../lib/util');
	var config = require('../config/panax');
	var panaxdb = new PanaxJS.Connection(config);

  before('mock setup & authenticate', function(done) {
		// DDL Isolation
		panaxdb.query(fs.readFileSync('test/mocks.clean.sql', 'utf8'), function(err) {
			if(err) return done(err);
			panaxdb.query(fs.readFileSync('test/mocks.prep.sql', 'utf8'), function(err) {
				if(err) return done(err);
				panaxdb.rebuildMetadata(function (err) {
					if(err) return done(err);
					panaxdb.authenticate(config.ui.username, util.md5(config.ui.password), function (err, userId) {
						if(err) return done(err);
						panaxdb.setParam("userId", userId);
						done();
					});
				});
			});
		});
  });

	require('./integration/tools');
	require('./integration/persist');
	require('./integration/read');

});