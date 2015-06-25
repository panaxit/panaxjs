/**
 * Panax.js
 * 
 * PanaxDB Abstraction Class
 *
 * HowTo instantiate:
 *
 * var Panax = new require('Panax')(config, params);
 * 
 */
var sql = require('mssql');
var Promise = require('i-promise');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var util = require('./lib/util');

// ToDo
// @Parameters (Unknown)
// @FullPath (Unknown XPath)
// @ColumnList (Unknown XML parsing for Create, Update & Delete ?)
//
// ToDo from Panax.asp:
// Class_Initialize()
// - ln 26-84: Process Session Variables & Parameters
// - ln 91-100: Handle EncryptedID (eid). In different request? (ex. /to?eid=X)
// - ln 106-166: Filters: Manipulate filters
// - ln 167-169: Filters: Set identityKey filter
// - ln 172-175: Filters: Join filters
// - ln: 177-186: Sorters
// 
// ToDo from xmlCatalogOptions.asp:
// @extraOptions
// @sortDirection
// @orderBy
// @enableInsert

/**
 * Class Constructor
 */
var Class = function(config, params) {
	
	this.config = config;

	if(!params) {
		this.params = {};
	} else {
		this.params = {
			userId: params.userId,
			tableName: params.tableName,
			output: params.output,
			getData: params.getData || '1',
			getStructure: params.getStructure || '1',
			rebuild: params.rebuild || 'DEFAULT',
			controlType: params.controlType || 'DEFAULT',
			mode: params.mode || 'DEFAULT',
			pageIndex: params.pageIndex || 'DEFAULT',
			pageSize: params.pageSize || 'DEFAULT',
			maxRecords: params.maxRecords || 'DEFAULT',
			parameters: params.parameters || 'DEFAULT',
			filters: params.filters || 'DEFAULT',
			sorters: params.sorters || 'DEFAULT',
			fullPath: params.fullPath || 'DEFAULT',
			columnList: params.columnList || 'DEFAULT',
			lang: params.lang || 'DEFAULT'
		};
	}

	this.sql_conn = new Promise(function (resolve, reject) {
		var conn = new sql.Connection(config.db, function (err) {
			if(err) {
				return reject(err);
			}
			return resolve(conn);
		});
	});
};

/**
 * Property setter
 */
Class.prototype.setParam = function(prop, value) {
	if (this.params.hasOwnProperty(prop)) {
		this.params[prop] = value;
	}
};

/**********************
 * Config Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * [$Metadata].rebuild
 */
Class.prototype.rebuildMetadata = function(callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Metadata].rebuild';

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
}

/**
 * Wrapper for SQL Queries:
 * [$Table].exportConfig
 * [$Table].config
 */
Class.prototype.config = function(args, callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Table].exportConfig';

		if(args.length) {
			sql_str = '[$Table].config ';
			sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');
		}

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
}

/**
 * Wrapper for SQL Query:
 * [$Table].clearConfig
 */
Class.prototype.clearConfig = function(args, callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Table].clearConfig ';

		sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
}

/**
 * Wrapper for SQL Query:
 * [$Table].clearCache
 */
Class.prototype.clearCache = function(args, callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Ver:' + that.config.db.version + '].clearCache ';

		sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
}

/**********************
 * Session Methods
 **********************/

/**
 * Get Vendor Info
 */
Class.prototype.getVendorInfo = function(callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = 'SELECT @@version as version';

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			if(!recordset[0])
				return callback({message: "Error: Missing Vendor Info"});

			callback(null, recordset[0]);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
};

/**
 * Wrapper for SQL Procedure:
 * [$PanaxDB].Authenticate
 */
Class.prototype.authenticate = function(username, password, callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Security].Authenticate';

		sql_req.input('username', sql.VarChar, username);
		sql_req.input('password', sql.VarChar, password);

		sql_req.execute(sql_str).then(function (recordsets, returnValue) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			var userId = recordsets[0][0].userId;
			//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"

			callback(null, userId);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
};

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].UserSitemap
 */
Class.prototype.getSitemap = function(callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Security].UserSitemap @@userId=' + that.params.userId;

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0]['userSiteMap'];

			if(!xml)
				return callback({message: "Error: Missing Sitemap XML"});

			callback(null, xml);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
};

/**********************
 * Read Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].getXmlData
 */
Class.prototype.read = function(callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Ver:' + that.config.db.version + '].getXmlData ' + util.toParamsString(that.params);

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
};

/**
 * Wrapper for SQL Query:
 * [$Table].getCatalogOptions
 */
Class.prototype.options = function(args, callback) {
	var that = this;

	this.sql_conn.then(function(conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Table].getCatalogOptions @@userId=' + that.params.userId + ", @catalogName='" + args.catalogName + "', " +
									"@valueColumn='" + args.valueColumn + "', @textColumn='" + args.textColumn + "'";

		if(args.filters)
			sql_str = sql_str + ", @filters=" + args.filters + "";

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
};

/**********************
 * Persist Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * #panax.persist
 */
Class.prototype.persist = function(xml, callback) {
	var that = this;

	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = "#panax.persist @userId=" + that.params.userId + ", @updateXML='" + xml + "'";

		sql_req.query(sql_str).then(function (recordset) {
			//console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		}).catch(function (err) {
			callback(err);
		});
	}).catch(function (err) {
		callback(err);
	});
};

/**********************
 * Module Export
 **********************/

module.exports.Connection = Class;
module.exports.Util = util;
