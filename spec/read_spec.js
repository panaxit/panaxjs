/**
 * Read Test
 * 	- getCatalogOptions
 * 	- getXML
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {
	userId: undefined,
	tableName: 'CatalogosSistema.Pais',
	output: 'json'
});

describe("Read", function () {

	// it("should PanaxJS.authenticate", function (done) {
	// 	oPanaxJS.authenticate(panax_config.ui.username, util.md5(panax_config.ui.password), function (err, userId) {
	// 		expect(err).toBeFalsy();
	// 		if(!err) {
	// 			expect(userId).toBeTruthy();
	// 			oPanaxJS.setParam("userId", userId);
	// 		}
	// 		done();
	// 	});
	// });

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