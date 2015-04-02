/**
 * CRUD Methods Tests
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {
	userId: undefined,
	tableName: 'CatalogosSistema.Pais',
	output: 'json'
});

describe("CRUD", function () {

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

	it("should PanaxJS.getCatalogOptions", function (done) {
		var args = {
			catalogName: "CatalogosSistema.Pais",
			valueColumn: "Clave",
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

	it("should PanaxJS.getXML", function (done) {
		oPanaxJS.getXML(function (err, result) {
			expect(err).toBeFalsy();
			if(!err) {
				expect(result).toBeTruthy();
			}
			done();
		});
	});

	it("should PanaxJS.updateDB INSERT", function (done) {
		var insertXML = 
			'<dataTable name="CatalogosSistema.Pais" primaryKey="Clave">' + 
				'<dataRow identityValue="NULL" primaryValue="NULL">' + 
					'<dataField name="Clave">\'\'NJ\'\'</dataField>' + 
					'<dataField name="Pais">\'\'Nunca Jamas\'\'</dataField>' + 
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
							expect(results[0].dataTable).toBe('CatalogosSistema.Pais');
							expect(results[0].primaryValue).toBe('NJ');
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
			'<dataTable name="CatalogosSistema.Pais" primaryKey="Clave">' + 
				'<dataRow identityValue="NULL" primaryValue="\'\'NJ\'\'">' + 
					'<dataField name="Clave" isPK="true" previousValue="\'\'NJ\'\'">\'\'NJ\'\'</dataField>' + 
					'<dataField name="Pais">\'\'Nueva Jamaica\'\'</dataField>' + 
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
							expect(results[0].dataTable).toBe('CatalogosSistema.Pais');
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
			'<dataTable name="CatalogosSistema.Pais" primaryKey="Clave">' + 
				'<deleteRow identityValue="NULL" primaryValue="\'\'NJ\'\'">' + 
					'<dataField name="Clave" isPK="true">\'\'NJ\'\'</dataField>' + 
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
							expect(results[0].dataTable).toBe('CatalogosSistema.Pais');
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