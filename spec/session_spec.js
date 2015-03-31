/**
 * Session Methods Tests
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {userId: undefined});

describe("Session", function () {
	it("should PanaxJS.getVendorInfo", function (done) {
		oPanaxJS.getVendorInfo(function (err, result) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(result.version).toBeTruthy();
			}
			done();
		});
	});

	it("should PanaxJS.authenticate", function (done) {
		oPanaxJS.authenticate(panax_config.ui.username, util.md5(panax_config.ui.password), function (err, userId) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(userId).toBeTruthy();
				oPanaxJS.setParam("userId", userId);
			}
			done();
		});
	});

	it("should PanaxJS.getSitemap", function (done) {
		oPanaxJS.getSitemap(function (err, result) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(result).toBeTruthy();
			}
			done();
		});	
	});

});