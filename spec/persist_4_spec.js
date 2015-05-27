/**
 * Persist Test (4) (nested)
 * 	- insertRow
 * 	- updateRow
 * 	- deleteRow
 * 	
 * 2015\panax update\schema.sql (Uriel):
 * 	- dbo.Empleado
 * 	- dbo.Domicilio
 * 	- dbo.Telefonos
 */

var PanaxJS = require('..');
var panax_config = require('../config/panax');
var util = require('../lib/util');

var oPanaxJS = new PanaxJS(panax_config, {
	userId: undefined
});

var identityValue;

describe("Persist (nested)", function () {

	it("should insertRow", function (done) {
		var insertXML = 
			'<dataTable name="dbo.Empleado" identityKey="Id">' + 
				'<insertRow>' + 
					'<field name="RFC" isPK="true">NULL</field>' +
					'<field name="Nombre">\'\'Uriel\'\'</field>' +
					'<field name="ApellidoPaterno">\'\'Gómez\'\'</field>' +
					'<field name="ApellidoMaterno">\'\'Robles\'\'</field>' +
					'<field name="FechaNacimiento" out="true">NULL</field>' +
					'<dataTable name="dbo.Domicilio">' +
						'<insertRow>' +
							'<fkey name="RFC" isPK="true" maps="RFC" />' +
							'<field name="Dirección" out="true">\'\'Primer domicilio\'\'</field>' +
						'</insertRow>' +
					'</dataTable>' +
					'<dataTable name="dbo.Telefonos">' +
						'<insertRow>' +
							'<fkey name="Sede" maps="Sede" />' +
							'<fkey name="Empleado" maps="RFC" />' +
							'<field name="Telefono" out="true">\'\'4448177771\'\'</field>' +
						'</insertRow>' +
						'<insertRow>' +
							'<fkey name="Sede" maps="Sede" />' +
							'<fkey name="Empleado" maps="RFC" />' +
							'<field name="Telefono" out="true">\'\'4441234567\'\'</field>' +
						'</insertRow>' +
					'</dataTable>' +
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
			'<dataTable name="dbo.Empleado" identityKey="Id">' + 
				'<updateRow>' + 
					'<field name="RFC" isPK="true">\'\'GORU8109293T0\'\'</field>' +
					'<dataTable name="dbo.Domicilio" identityKey="Id">' +
						'<updateRow>' +
							'<fkey name="RFC" isPK="true" maps="RFC" />' +
							'<field name="Dirección">\'\'Domicilio actualizado\'\'</field>' +
						'</updateRow>' +
					'</dataTable>' +
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
			'<dataTable name="dbo.Empleado" identityKey="Id">' + 
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