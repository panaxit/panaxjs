var expect = require('chai').expect;
var PanaxJS = require('../..');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('Persist', function() {

	var panaxdb = new PanaxJS.Connection(config, {
		userId: undefined
	});

  before('authenticate', function(done) {
		panaxdb.authenticate(config.ui.username, util.md5(config.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  });

	// ToDo: DDL Isolation Stuff
  // before('isolation', function(done) {
	//  // [persist_prep.sql] CREATE Table(s)
  // });
  // after(function() {
  // 	// [persist_clean.sql] DROP Table(s)
  // });

  describe('simple (PK)', function() {

		it("should insertRow", function (done) {
			var insertXML = 
				'<dataTable name="CatalogosSistema.Pais">' + 
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
					expect(res[0].tableName).to.equal('[CatalogosSistema].[Pais]');
					expect(res[0].fields[0].value).to.equal('\'NJ\'');
					done();
				});
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

			panaxdb.persist(updateXML, function (err, xml) {
				if(err) done(err);
				expect(xml).to.be.ok;
				PanaxJS.Util.parseResults(xml, function (err, res) {
					if(err) done(err);
					expect(res).to.be.ok;
					expect(res[0]).to.be.ok;
					expect(res[0].status).to.equal('success');
					expect(res[0].tableName).to.equal('[CatalogosSistema].[Pais]');
					done();
				});
			});
		});

		it("should deleteRow", function (done) {
			var deleteXML = 
				'<dataTable name="CatalogosSistema.Pais">' + 
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
					expect(res[0].tableName).to.equal('[CatalogosSistema].[Pais]');
					done();
				});
			});
		});
  	
  });

});