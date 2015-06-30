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

var chalk = require('chalk');
var noop = function () {};
var debug = ( process.env.NODE_ENV === 'development' ) ? {
	info: function(str) { console.log(chalk.bold.blue(str)); }
} : {
	info: noop
};

/**********************
 * Class
 **********************/

/**
 * Constructor
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
 * Run raw SQL query
 */
Class.prototype.query = function(sql_str, callback) {
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		sql_str = sql_str.replace(/^GO.*$/mg, '/**GO**/'); // Remove GO statements
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #panax.rebuildMetadata
 */
Class.prototype.rebuildMetadata = function(callback) {
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '#panax.rebuildMetadata';
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #entity.config
 * #entity.exportConfig
 */
Class.prototype.config = function(args, callback) {
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '#entity.exportConfig';
		if(args.length) {
			sql_str = '#entity.config ';
			sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');
		}
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #entity.clearConfig
 */
Class.prototype.clearConfig = function(args, callback) {
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '#entity.clearConfig ' + args.map(function(arg) {return '\''+arg+'\'';}).join(', ');
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #entity.clearCache
 */
Class.prototype.clearCache = function(args, callback) {
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '#entity.clearCache ' + args.map(function(arg) {return '\''+arg+'\'';}).join(', ');
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = 'SELECT @@version as version';
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #panax.authenticate
 */
Class.prototype.authenticate = function(username, password, callback) {
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Security].Authenticate';
		sql_req.input('username', sql.VarChar, username);
		sql_req.input('password', sql.VarChar, password);
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.execute(sql_str).then(function (recordsets, returnValue) {
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
 * #panax.getSitemap
 */
Class.prototype.getSitemap = function(callback) {
	var _self = this;
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Security].UserSitemap @@userId=' + _self.params.userId;
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #entity.read
 */
Class.prototype.read = function(callback) {
	var _self = this;
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		//var sql_str = '#entity.read ' + util.toParamsString(_self.params);
		var sql_str = '[$Ver:' + _self.config.db.version + '].getXmlData ' + util.toParamsString(_self.params);
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
 * #entity.options
 */
Class.prototype.options = function(args, callback) {
	var _self = this;
	this.sql_conn.then(function(conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = '[$Table].getCatalogOptions @@userId=' + _self.params.userId + ", @catalogName='" + args.catalogName + "', " +
									"@valueColumn='" + args.valueColumn + "', @textColumn='" + args.textColumn + "'";
		if(args.filters)
			sql_str = sql_str + ", @filters=" + args.filters + "";
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
	var _self = this;
	this.sql_conn.then(function (conn) {
		var sql_req = new sql.Request(conn);
		var sql_str = "#panax.persist @userId=" + _self.params.userId + ", @updateXML='" + xml + "'";
		debug.info('# PanaxJS - sql_str: ' + sql_str);
		sql_req.query(sql_str).then(function (recordset) {
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
