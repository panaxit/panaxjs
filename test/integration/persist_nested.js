var expect = require('chai').expect;
var PanaxJS = require('../..');
var panax_config = require('../../config/panax');
var panax_instance = panax_config.instances[panax_config.default_instance];
var util = require('../../lib/util');

describe('nested table(s) persistance', function() {

	var panaxdb = new PanaxJS.Connection(panax_instance);

  before('authenticate', function(done) {
		panaxdb.authenticate(panax_instance.ui.username, util.md5(panax_instance.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  });

  describe('case 1: #persist nested (1:1, 1:N) with (distinct) primaryKey & identityKey', function() {

		var identityValue;

		it("should insertRow", function (done) {
			var insertXML = 
				'<dataTable name="TestSchema.Empleado" identityKey="Id">' + 
					'<insertRow>' + 
						'<field name="RFC" isPK="true">\'\'GORU810929\'\'</field>' +
						'<field name="Nombre">\'\'Uriel\'\'</field>' +
						'<field name="ApellidoPaterno">\'\'Gómez\'\'</field>' +
						'<field name="ApellidoMaterno">\'\'Robles\'\'</field>' +
						'<field name="FechaNacimiento" out="true">NULL</field>' +
						'<dataTable name="TestSchema.Domicilio">' +
							'<insertRow>' +
								'<fkey name="RFC" isPK="true" maps="RFC" />' +
								'<field name="Dirección" out="true">\'\'Primer domicilio\'\'</field>' +
							'</insertRow>' +
						'</dataTable>' +
						'<dataTable name="TestSchema.Telefonos">' +
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

			panaxdb.persist(insertXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].action).to.equal('insert');
					expect(res[0].tableName).to.equal('[TestSchema].[Empleado]');
					expect(res[0].identity).to.be.above(0);
					identityValue = res[0].identity;
					done();
				});
			});
		});

		it("should updateRow", function (done) {
			var updateXML = 
				'<dataTable name="TestSchema.Empleado" identityKey="Id">' + 
					'<updateRow>' + 
						'<field name="RFC" isPK="true">\'\'GORU810929\'\'</field>' +
						'<dataTable name="TestSchema.Domicilio" identityKey="Id">' +
							'<updateRow>' +
								'<fkey name="RFC" isPK="true" maps="RFC" />' +
								'<field name="Dirección">\'\'Domicilio actualizado\'\'</field>' +
							'</updateRow>' +
						'</dataTable>' +
					'</updateRow>' + 
				'</dataTable>';

			panaxdb.persist(updateXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].action).to.equal('update');
					expect(res[0].tableName).to.equal('[TestSchema].[Empleado]');
					done();
				});
			});
		});

		it("should deleteRow", function (done) {
			var deleteXML = 
				'<dataTable name="TestSchema.Empleado" identityKey="Id">' + 
					'<deleteRow identityValue="' + identityValue + '">' + 
					'</deleteRow>' + 
				'</dataTable>';

			panaxdb.persist(deleteXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].action).to.equal('delete');
					expect(res[0].tableName).to.equal('[TestSchema].[Empleado]');
					done();
				});
			});
		});
  	
  });

	describe.skip('case 2: #persist nested (1:1, 1:N) with (same) primaryKey & identityKey', function() {

		var identityValue;
		
		it("should insertRow", function (done) {
			var insertXML = 
				'<dataTable name="TestSchema.CONTROLS_NestedForm" identityKey="Id">' + 
					'<insertRow>' + 
						'<field name="TextLimit10Chars">\'\'Test PARENT\'\'</field>' +
						'<dataTable name="dbo.CONTROLS_NestedGrid" identityKey="Id">' +
							'<insertRow>' + 
								'<fkey name="Id" isPK="true" maps="Id"/>' +
								'<field name="TextLimit255">\'\'Test CHILD\'\'</field>' +
							'</insertRow>' + 
						'</dataTable>' + 
					'</insertRow>' + 
				'</dataTable>';

			panaxdb.persist(insertXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].action).to.equal('insert');
					expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_NestedForm]');
					expect(res[0].identity).to.be.above(0);
					identityValue = res[0].identity;
					done();
				});
			});
		});

		it("should updateRow", function (done) {
			var updateXML = 
				'<dataTable name="TestSchema.CONTROLS_NestedForm" identityKey="Id">' + 
					'<updateRow identityValue="' + identityValue + '">' + 
						'<dataTable name="TestSchema.CONTROLS_NestedGrid">' +
							'<updateRow>' +
								'<fkey name="Id" isPK="true" maps="Id" />' +
								'<field name="TextLimit255">\'\'Test CHILD updated\'\'</field>' +
							'</updateRow>' +
						'</dataTable>' +
					'</updateRow>' + 
				'</dataTable>';

			panaxdb.persist(updateXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].action).to.equal('update');
					expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_NestedForm]');
					done();
				});
			});
		});

		it("should deleteRow", function (done) {
			var deleteXML = 
				'<dataTable name="TestSchema.CONTROLS_NestedForm" identityKey="Id">' + 
					'<deleteRow identityValue="' + identityValue + '">' + 
					'</deleteRow>' + 
				'</dataTable>';

			panaxdb.persist(deleteXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].action).to.equal('delete');
					expect(res[0].tableName).to.equal('[TestSchema].[Empleado]');
					done();
				});
			});
		});

	});

});
