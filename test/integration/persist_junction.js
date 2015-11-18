var expect = require('chai').expect;
var PanaxJS = require('../..');
var panax_config = require('../../config/panax');
var panax_instance = panax_config.instances[panax_config.default_instance];
var util = require('../../lib/util');

describe('junction table(s) persistance', function() {

	var panaxdb = new PanaxJS.Connection(panax_instance);

  before('authenticate', function(done) {
		panaxdb.authenticate(panax_instance.ui.username, util.md5(panax_instance.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  });

  describe('case 1: #persist nested junction table to table', function() {

		var identityValue;

		it("should insertRow", function (done) {
			var insertXML = 
				'<dataTable name="TestSchema.CONTROLS_Advanced" identityKey="Id">' + 
					'<insertRow>' + 
						'<field name="Id" isPK="true" out="true"/>' +
						'<field name="EMail">\'\'uriel_online@hotmail.com\'\'</field>' +
						'<dataTable name="TestSchema.CONTROLS_Profiles">' +
							'<insertRow>' +
								'<fkey name="IdControl" isPK="true" maps="Id" />' +
								'<field name="IdProfile" isPK="true">\'\'3\'\'</field>' +
							'</insertRow>' +
							'<insertRow>' +
								'<fkey name="IdControl" isPK="true" maps="Id" />' +
								'<field name="IdProfile" isPK="true">\'\'4\'\'</field>' +
							'</insertRow>' +
							'<insertRow>' +
								'<fkey name="IdControl" isPK="true" maps="Id" />' +
								'<field name="IdProfile" isPK="true">\'\'5\'\'</field>' +
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
					expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_Advanced]');
					expect(res[0].identity).to.be.above(0);
					identityValue = res[0].identity;
					done();
				});
			});
		});

    it("should fail deleteRow (parent row)", function (done) {
      var deleteXML = 
        '<dataTable name="TestSchema.CONTROLS_Advanced" identityKey="Id">' + 
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
          expect(res[0].status).to.equal('error');
          done();
        });
      });
    });

    it("should deleteRow (BATCH: junction rows, then parent row)", function (done) {
      var deleteXML = 
        '<batch>' +
          '<dataTable name="TestSchema.CONTROLS_Profiles">' +
            '<deleteRow identityValue="\'\'' + identityValue + ' 3\'\'">' + 
            '</deleteRow>' + 
            '<deleteRow identityValue="\'\'' + identityValue + ' 4\'\'">' + 
            '</deleteRow>' + 
            '<deleteRow identityValue="\'\'' + identityValue + ' 5\'\'">' + 
            '</deleteRow>' + 
          '</dataTable>' +
          '<dataTable name="TestSchema.CONTROLS_Advanced" identityKey="Id">' + 
            '<deleteRow identityValue="' + identityValue + '">' + 
            '</deleteRow>' + 
          '</dataTable>' +
        '</batch>';

      panaxdb.persist(deleteXML, function (err, xml) {
        if(err) done(err);
        expect(xml).to.be.ok;
        PanaxJS.Util.parseResults(xml, function (err, res) {
          if(err) done(err);
          expect(res).to.be.ok;
          expect(res[0]).to.be.ok;
          expect(res[0].status).to.equal('success');
          expect(res[0].action).to.equal('delete');
          expect(res[0].tableName).to.equal('[TestSchema].[CONTROLS_Profiles]');
          expect(res[1]).to.be.ok;
          expect(res[1].status).to.equal('success');
          expect(res[1].action).to.equal('delete');
          expect(res[1].tableName).to.equal('[TestSchema].[CONTROLS_Profiles]');
          expect(res[2]).to.be.ok;
          expect(res[2].status).to.equal('success');
          expect(res[2].action).to.equal('delete');
          expect(res[2].tableName).to.equal('[TestSchema].[CONTROLS_Profiles]');
          expect(res[3]).to.be.ok;
          expect(res[3].status).to.equal('success');
          expect(res[3].action).to.equal('delete');
          expect(res[3].tableName).to.equal('[TestSchema].[CONTROLS_Advanced]');
          done();
        });
      });
    });
  	
  });

	describe('case 2: #persist nested junction table to self-referencing table', function(){
	
		it('PENDING');

	});

});
