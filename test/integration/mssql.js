var expect = require('chai').expect;
var sql = require('mssql');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('MSSQL', function() {

	var db = new sql.Connection(config.db);

	it('should connect to database', function (done) {
		db.connect(function (err) {
			expect(err).to.not.exist;
			done();
		})
	});

	it('should execute sql queries', function (done) {
		var sql_req = new sql.Request(db);

		sql_req.query('select 1 as number', function (err, recordset) {
			if(err) return done(err);
			expect(recordset[0].number).to.equal(1);
			done();
		});
	});

});