describe('Integration tests: Without mocks', function() {

	require('./integration/mssql');
	require('./integration/config');
	require('./integration/session');

});

describe('Integration tests: Using mocks', function() {

	var fs = require('fs');
	var PanaxJS = require('..');
	var util = require('../lib/util');
	var panax_config = require('../config/panax');
	var panax_instance = panax_config.instances[panax_config.default_instance];
	var panaxdb = new PanaxJS.Connection(panax_instance);

  before('mock setup & authenticate', function(done) {
		// DDL Isolation
		panaxdb.query(fs.readFileSync('test/mocks.clean.sql', 'utf8'), function(err) {
			if(err) return done(err);
			panaxdb.query(fs.readFileSync('test/mocks.prep.sql', 'utf8'), function(err) {
				if(err) return done(err);
				panaxdb.rebuildMetadata(function (err) {
					if(err) return done(err);
					done();
				});
			});
		});
  });

	require('./integration/tools');
	require('./integration/read');
	require('./integration/persist_table');
	require('./integration/persist_nested');
	require('./integration/persist_junction');

});