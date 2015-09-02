var expect = require('chai').expect;
var sql = require('mssql');
var Promise = require('i-promise');
var panax_config = require('../../config/panax');
var panax_instance = panax_config.instances[panax_config.default_instance];
var util = require('../../lib/util');

describe('mssql driver', function() {

	var db = new Promise(function (resolve, reject) {
		var conn = new sql.Connection(panax_instance.db, function (err) {
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