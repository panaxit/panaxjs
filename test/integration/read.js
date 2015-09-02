var expect = require('chai').expect;
var PanaxJS = require('../..');
var panax_config = require('../../config/panax');
var panax_instance = panax_config.instances[panax_config.default_instance];
var util = require('../../lib/util');

describe('read', function() {

	var panaxdb = new PanaxJS.Connection(panax_instance, {
		tableName: 'TestSchema.Pais',
		output: 'json'
	});

  before('authenticate', function(done) {
		panaxdb.authenticate(panax_instance.ui.username, util.md5(panax_instance.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  });

  describe('#options', function() {

  	it('should return data', function(done) {
			var args = {
				catalogName: "TestSchema.Pais",
				valueColumn: "Id",
				textColumn: "Pais"
			};

			panaxdb.options(args, function (err, res) {
				if(err) return done(err);
				expect(res).to.be.ok;
				done();
			});
  	});

  });

  describe('#read', function() {

  	it('should return data', function(done) {
			panaxdb.read(function (err, res) {
				if(err) return done(err);
				expect(res).to.be.ok;
				done();
			});
  	});

  });

});