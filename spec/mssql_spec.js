/**
 * MSSQL Tests
 */

var sql = require('mssql');
var panax_config = require('../config/panax');
var util = require('../lib/util');

describe("MSSQL", function () {

	it("should connect", function (done) {
		sql.connect(panax_config.db, function (err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it("should execute SQL queries", function (done) {
		sql.connect(panax_config.db, function (err) {
			var sql_req = new sql.Request();

			sql_req.query('select 1 as number', function (err, recordset) {
				expect(err).toBeFalsy();
				if(!err) {
					expect(recordset[0].number).toBe(1);
				}
				done();
			});
		});
	});

});