var expect = require('chai').expect;
var PanaxJS = require('../..');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('Read', function() {

	var panaxdb = new PanaxJS(config, {
		userId: undefined,
		tableName: 'CatalogosSistema.Pais',
		output: 'json'
	});

	/*
	ToDo: DDL Isolation Stuff
	 */
  before(function(done) {
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

  describe('#getCatalogOptions()', function() {

  	it('should return data', function(done) {
			var args = {
				catalogName: "CatalogosSistema.Pais",
				valueColumn: "Id",
				textColumn: "Pais"
			};

			panaxdb.getCatalogOptions(args, function (err, res) {
				if(err) return done(err);
				expect(res).to.be.ok;
				done();
			});
  	});

  });

  describe('#getXML()', function() {

  	it('should return data', function(done) {
			panaxdb.getXML(function (err, res) {
				if(err) return done(err);
				expect(res).to.be.ok;
				done();
			});
  	});

  });

});