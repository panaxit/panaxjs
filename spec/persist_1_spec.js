/**
 * Persist Test (1) (primaryKey)
 * 	- insertRow
 * 	- updateRow
 * 	- deleteRow
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

describe("Persist (primaryKey)", function () {

	/*
	ToDo: DDL Isolation Stuff
	 */
  // beforeAll(function() {
  // // CREATE Table(s)
  // });
  // afterAll(function() {
  // // DROP Table(s)
  // });

	var oPanaxJS = new PanaxJS(panax_config, {
		userId: undefined
	});

	it("should insertRow", function (done) {
		var insertXML = 
			'<dataTable name="CatalogosSistema.Pais">' + 
				'<insertRow>' + 
					'<field name="Id" isPK="true">\'\'NJ\'\'</field>' + 
					'<field name="Pais">\'\'Nunca Jamas\'\'</field>' + 
				'</insertRow>' + 
			'</dataTable>';

		oPanaxJS.persist(insertXML, function (err, xml) {
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

	it("should updateRow", function (done) {
		var updateXML = 
			'<dataTable name="CatalogosSistema.Pais">' + 
				'<updateRow>' + 
					'<field name="Id" isPK="true" currentValue="\'\'NJ\'\'">\'\'NE\'\'</field>' + 
					'<field name="Pais">\'\'Nueva Escocia\'\'</field>' + 
				'</updateRow>' + 
			'</dataTable>';

		oPanaxJS.persist(updateXML, function (err, xml) {
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

	it("should deleteRow", function (done) {
		var deleteXML = 
			'<dataTable name="CatalogosSistema.Pais">' + 
				'<deleteRow>' + 
					'<field name="Id" isPK="true">\'\'NE\'\'</field>' + 
				'</deleteRow>' + 
			'</dataTable>';

		oPanaxJS.persist(deleteXML, function (err, xml) {
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