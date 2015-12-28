/*eslint no-undef:0 no-shadow:0*/

describe('Integration tests: Without mocks', function() {

  require('./integration/mssql')
  require('./integration/config')
  require('./integration/session')

})

describe('Integration tests: Using mocks', function() {

  var fs = require('fs')
  var PanaxJS = require('..')
  var panaxConfig = require('../config/panax')
  var panaxInstance = panaxConfig.instances[panaxConfig.default_instance]
  var panaxdb = new PanaxJS.Connection(panaxInstance)

  before('mock setup & authenticate', function(done) {
    // DDL Isolation
    panaxdb.query(fs.readFileSync('test/mocks.clean.sql', 'utf8'), function(err) {
      if (err) {
        return done(err)
      }
      panaxdb.query(fs.readFileSync('test/mocks.prep.sql', 'utf8'), function(err) {
        if (err) {
          return done(err)
        }
        panaxdb.rebuildMetadata(function(err) {
          if (err) {
            return done(err)
          }
          done()
        })
      })
    })
  })

  require('./integration/tools')
  require('./integration/read')
  require('./integration/persist_table')
  require('./integration/persist_nested')
  require('./integration/persist_junction')

})