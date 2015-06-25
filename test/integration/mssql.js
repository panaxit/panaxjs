var expect = require('chai').expect;
var sql = require('mssql');
var Promise = require('i-promise');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('MSSQL', function() {

	var db = new Promise(function (resolve, reject) {
		var conn = new sql.Connection(config.db, function (err) {
			if(err) {
				return reject(err);
			}
			return resolve(conn);
		});
	});

	it('should connect to database', function (done) {
		db.then(function (conn) {
			expect(conn).to.exist;
			done();
		})
	});

	it('should execute sql queries', function (done) {
		db.then(function (conn) {
			var sql_req = new sql.Request(conn);

			sql_req.query('select 1 as number', function (err, recordset) {
				if(err) return done(err);
				expect(recordset[0].number).to.equal(1);
				done();
			});
		});
	});

});