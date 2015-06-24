/**
 * Read Test
 * 	- getCatalogOptions
 * 	- getXML
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

describe("Read", function () {

	var oPanaxJS;

	/*
	ToDo: DDL Isolation Stuff
	 */
  before(function() {

		oPanaxJS = new PanaxJS(panax_config, {
			userId: undefined,
			tableName: 'CatalogosSistema.Pais',
			output: 'json'
		});

		oPanaxJS.authenticate(panax_config.ui.username, util.md5(panax_config.ui.password), function (err, userId) {
			if(!err) {
				oPanaxJS.setParam("userId", userId);
			}
		});
  // CREATE Table(s)
  // INSERT Data
  });
  afterAll(function() {
  // DROP Table(s)
  });

	it("should getCatalogOptions", function (done) {
		var args = {
			catalogName: "CatalogosSistema.Pais",
			valueColumn: "Id",
			textColumn: "Pais"
		};

		oPanaxJS.getCatalogOptions(args, function (err, result) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(result).toBeTruthy();
			}
			done();
		});
	});

	it("should getXML", function (done) {
		oPanaxJS.getXML(function (err, result) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(result).toBeTruthy();
			}
			done();
		});
	});

});