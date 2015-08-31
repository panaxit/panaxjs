var expect = require('chai').expect;
var PanaxJS = require('../..');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('read', function() {

	var panaxdb = new PanaxJS.Connection(config, {
		tableName: 'TestSchema.Pais',
		output: 'json'
	});

  before('authenticate', function(done) {
		panaxdb.authenticate(config.ui.username, util.md5(config.ui.password), function (err, userId) {
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