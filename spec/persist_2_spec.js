/**
 * Persist Test (2) (identityKey)
 * 	- insertRow
 * 	- updateRow
 * 	- deleteRow
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {
	userId: undefined
});

var identityValue;

describe("Persist (identityKey)", function () {

	it("should insertRow", function (done) {
		var insertXML = 
			'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id">' + 
				'<insertRow>' + 
					'<field name="ShortTextField">\'\'Juan\'\'</field>' + 
					'<field name="IntegerReq">10</field>' + 
					'<field name="Float">42.3</field>' + 
				'</insertRow>' + 
			'</dataTable>';

		oPanaxJS.updateDB(insertXML, function (err, xml) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(xml).toBeTruthy();
				if(xml) {
					oPanaxJS.getResults(xml, function (err, results) {
						expect(err).toBeFalsy();
						if(!err) {
							expect(results).toBeTruthy();
							expect(results[0]).toBeTruthy();
							expect(results[0].status).toBe('success');
							expect(results[0].dataTable).toBe('dbo.CONTROLS_Basic');
							expect(results[0].identityValue).toBeGreaterThan(0);
							identityValue = results[0].identityValue;
							console.dir(results)
						}
						done();
					});
				}
			}
			done();
		});
	});

	it("should updateRow", function (done) {
		var updateXML = 
			'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id">' + 
				'<updateRow identityValue="' + identityValue + '">' + 
					'<field name="Float">32.4</field>' + 
				'</updateRow>' + 
			'</dataTable>';

		oPanaxJS.updateDB(updateXML, function (err, xml) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(xml).toBeTruthy();
				if(xml) {
					oPanaxJS.getResults(xml, function (err, results) {
						expect(err).toBeFalsy();
						if(!err) {
							expect(results).toBeTruthy();
							expect(results[0]).toBeTruthy();
							expect(results[0].status).toBe('success');
							expect(results[0].dataTable).toBe('dbo.CONTROLS_Basic');
							console.dir(results)
						}
						done();
					});
				}
			}
			done();
		});
	});

	it("should deleteRow", function (done) {
		var deleteXML = 
			'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id">' + 
				'<deleteRow identityValue="' + identityValue + '">' + 
				'</deleteRow>' + 
			'</dataTable>';

		oPanaxJS.updateDB(deleteXML, function (err, xml) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(xml).toBeTruthy();
				if(xml) {
					oPanaxJS.getResults(xml, function (err, results) {
						expect(err).toBeFalsy();
						if(!err) {
							expect(results).toBeTruthy();
							expect(results[0]).toBeTruthy();
							expect(results[0].status).toBe('success');
							expect(results[0].dataTable).toBe('dbo.CONTROLS_Basic');
							console.dir(results)
						}
						done();
					});
				}
			}
			done();
		});
	});

});