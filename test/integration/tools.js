var expect = require('chai').expect;
var PanaxJS = require('../..');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('tools', function() {

	var panaxdb = new PanaxJS.Connection(config);

  before('authenticate', function(done) {
		panaxdb.authenticate(config.ui.username, util.md5(config.ui.password), function (err, userId) {
			if(err) return done(err);
			panaxdb.setParam("userId", userId);
			done();
		});
  });

  describe('#filters', function() {

  	it('should return correct filters', function(done) {
			var filtersXML = 
				'<dataTable name="TestSchema.CONTROLS_Basic">' +
				'	<filterGroup operator="AND">' +
				'		<dataField name="ShortTextField">' +
				'			<filterGroup operator="=">' +
				'				<dataValue>\'\'Juan\'\'</dataValue>' +
				'			</filterGroup>' +
				'		</dataField>' +
				'		<dataField name="IntegerReq">' +
				'			<filterGroup operator="=">' +
				'				<dataValue>10</dataValue>' +
				'			</filterGroup>' +
				'		</dataField>' +
				'		<dataField name="Float">' +
				'			<filterGroup operator=">">' +
				'				<dataValue>40.0</dataValue>' +
				'			</filterGroup>' +
				'		</dataField>' +
				'	</filterGroup>' +
				'</dataTable>';

			panaxdb.filters(filtersXML, function (err, str) {
				if(err) return done(err);
				expect(str).to.be.ok;
				expect(str).to.equal('ShortTextField = \'Juan\' AND IntegerReq = 10 AND Float > 40.0');
				done();
			});
  	});

  });

});