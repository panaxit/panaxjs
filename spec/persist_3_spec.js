/**
 * Persist Test (3) (primaryKey & identityKey)
 * 	- insertRow
 * 	- updateRow
 * 	- deleteRow
 * 	
 * 2015\panax update\schema.sql (Uriel):
 * 	- dbo.Empleado
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {
	userId: undefined
});

var identityValue;

describe("Persist (primaryKey & identityKey)", function () {

	it("should insertRow", function (done) {
		var insertXML = 
			'<dataTable name="dbo.Empleado" identityKey="Id">' + 
				'<insertRow>' + 
					'<field name="RFC" isPK="true">\'\'GORU810929\'\'</field>' +
					'<field name="Nombre">\'\'Uriel\'\'</field>' +
					'<field name="ApellidoPaterno">\'\'Gómez\'\'</field>' +
					'<field name="ApellidoMaterno">\'\'Robles\'\'</field>' +
					'<field name="FechaNacimiento" out="true">NULL</field>' +
					'<field name="FechaCaptura" out="true">NULL</field>' +
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
			'<dataTable name="dbo.Empleado" identityKey="Id">' + 
				'<updateRow>' + 
					'<field name="RFC" isPK="true" currentValue="\'\'GORU810929\'\'">\'\'GORU8109293T0\'\'</field>' + 
					'<field name="Nombre">\'\'Uriel Mauricio\'\'</field>' + 
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
			'<dataTable name="dbo.Empleado" identityKey="Id">' + 
				'<deleteRow identityValue="' + identityValue + '">' + 
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