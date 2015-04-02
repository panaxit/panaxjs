/**
 * CRUD Methods Tests (2)
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {
	userId: undefined
});

var primaryValue;

describe("CRUD 2", function () {

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

	it("should PanaxJS.updateDB INSERT", function (done) {
		var insertXML = 
			'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id" primaryKey="Id">' + 
				'<dataRow identityValue="NULL" primaryValue="NULL">' + 
					'<dataField name="ShortTextField">\'\'Juan\'\'</dataField>' + 
					'<dataField name="IntegerReq">10</dataField>' + 
					'<dataField name="Float">42.3</dataField>' + 
				'</dataRow>' + 
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
							expect(results[0].primaryValue).toBeGreaterThan(0);
							primaryValue = results[0].primaryValue;
							console.dir(results)
						}
						done();
					});
				}
			}
			done();
		});
	});

	it("should PanaxJS.updateDB UPDATE", function (done) {
		var updateXML = 
			'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id" primaryKey="Id">' + 
				'<dataRow identityValue="' + primaryValue + '" primaryValue="' + primaryValue + '">' + 
					'<dataField name="Float">32.4</dataField>' + 
				'</dataRow>' + 
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
							//expect(results[0].primaryValue).toBe('NJ');
							console.dir(results)
						}
						done();
					});
				}
			}
			done();
		});
	});

	it("should PanaxJS.updateDB DELETE", function (done) {
		var deleteXML = 
			'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id" primaryKey="Id">' + 
				'<deleteRow identityValue="' + primaryValue + '" primaryValue="' + primaryValue + '">' + 
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
							//expect(results[0].primaryValue).toBe('NJ');
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