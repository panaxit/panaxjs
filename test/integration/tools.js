var expect = require('chai').expect
var PanaxJS = require('../..')
var panax_config = require('../../config/panax')
var panax_instance = panax_config.instances[panax_config.default_instance]
var util = require('../../lib/util')

describe('tools', function() {

  var panaxdb = new PanaxJS.Connection(panax_instance)

  before('authenticate', function(done) {
    panaxdb.authenticate(panax_instance.ui.username, util.md5(panax_instance.ui.password), function(err, userId) {
      if (err) return done(err)
      panaxdb.setParam('userId', userId)
      done()
    })
  })

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
        '</dataTable>'

      panaxdb.filters(filtersXML, function(err, str) {
        if (err) return done(err)
        expect(str).to.be.ok
        expect(str).to.equal('ShortTextField = \'Juan\' AND IntegerReq = 10 AND Float > 40.0')
        done()
      })
    })

  })

})