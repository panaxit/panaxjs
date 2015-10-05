var expect = require('chai').expect;
var PanaxJS = require('../..');
var panax_config = require('../../config/panax');
var panax_instance = panax_config.instances[panax_config.default_instance];
var util = require('../../lib/util');

describe('table persistance', function() {

	var panaxdb = new PanaxJS.Connection(panax_instance);

  before('authenticate', function(done) {
		panaxdb.authenticate(panax_instance.ui.username, util.md5(panax_instance.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  });

  describe('case 1: #persist with primaryKey', function() {

		it("should insertRow", function (done) {
			var insertXML = 
				'<dataTable name="TestSchema.Pais">' + 
					'<insertRow>' + 
						'<field name="Id" isPK="true">\'\'NJ\'\'</field>' + 
						'<field name="Pais">\'\'Nunca Jamas\'\'</field>' + 
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
					expect(res[0].tableName).to.equal('[TestSchema].[Pais]');
					expect(res[0].fields[0].value).to.equal('\'NJ\'');
					done();
				});
			});
		});

		it("should updateRow", function (done) {
			var updateXML = 
				'<dataTable name="TestSchema.Pais">' + 
					'<updateRow>' + 
						'<field name="Id" isPK="true" currentValue="\'\'NJ\'\'">\'\'NE\'\'</field>' + 
						'<field name="Pais">\'\'Nueva Escocia\'\'</field>' + 
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
					expect(res[0].tableName).to.equal('[TestSchema].[Pais]');
					done();
				});
			});
		});

		it("should deleteRow", function (done) {
			var deleteXML = 
				'<dataTable name="TestSchema.Pais">' + 
					'<deleteRow>' + 
						'<field name="Id" isPK="true">\'\'NE\'\'</field>' + 
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
					expect(res[0].tableName).to.equal('[TestSchema].[Pais]');
					done();
				});
			});
		});
  	
  });

  describe('case 2: #persist with identityKey', function() {

		var identityValue;

		it("should insertRow", function (done) {
			var insertXML = 
				'<dataTable name="TestSchema.CONTROLS_Basic" identityKey="Id">' + 
					'<insertRow>' + 
						'<field name="ShortTextField">\'\'Juan\'\'</field>' + 
						'<field name="IntegerReq">10</field>' + 
						'<field name="Float">42.3</field>' + 
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
					expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_Basic]');
					expect(res[0].identity).to.be.above(0);
					identityValue = res[0].identity;
					done();
				});
			});
		});

		it("should updateRow", function (done) {
			var updateXML = 
				'<dataTable name="TestSchema.CONTROLS_Basic" identityKey="Id">' + 
					'<updateRow identityValue="' + identityValue + '">' + 
						'<field name="Float">32.4</field>' + 
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
					expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_Basic]');
					done();
				});
			});
		});

		it("should deleteRow", function (done) {
			var deleteXML = 
				'<dataTable name="TestSchema.CONTROLS_Basic" identityKey="Id">' + 
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
					expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_Basic]');
					done();
				});
			});
		});
  	
  });

  describe('case 3: #persist with (distinct) primaryKey & identityKey', function() {

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
						'<field name="FechaCaptura" out="true">NULL</field>' +
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
					//'<updateRow identityValue="' + identityValue + '">' + 
					'<updateRow>' + 
						'<field name="RFC" isPK="true" currentValue="\'\'GORU810929\'\'">\'\'GORU8109293T0\'\'</field>' + 
						'<field name="Nombre">\'\'Uriel Mauricio\'\'</field>' + 
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
					//'<deleteRow identityValue="' + identityValue + '">' + 
					'<deleteRow>' + 
						'<field name="RFC" isPK="true">\'\'GORU8109293T0\'\'</field>' + 
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
