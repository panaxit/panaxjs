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
var libxmljs = require('libxslt').libxmljs;
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

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
// @Filters
// @extraOptions
// @sortDirection
// @orderBy
// @enableInsert

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
};

/**********************
 * Utility Methods
 **********************/

/**
 * Property setter
 */
Class.prototype.setParam = function(prop, value) {
	if (this.params.hasOwnProperty(prop)) {
		this.params[prop] = value;
	}
};

/**
 * To Array
 */
Class.prototype.toParamsArray = function(params) {
	var result = [];
	var prefix = '@';
	var value = '';

	for (var prop in params) {
		prefix = (prop !== 'userId') ? '@' : '@@';
		value = params[prop];
	
		if(prop === 'tableName' || prop === 'mode')
			if(value !== 'DEFAULT')
				value = '\'' + params[prop] + '\'';

		result.push(prefix + prop + '=' + value);
	}

	return result;
};

/**
 * To String
 */
Class.prototype.toParamsString = function(params) {
	return this.toParamsArray(params).join(', ');
};

/**
 * Get Catalog object from XML (from getXMLData)
 */
Class.prototype.getCatalog = function(xml, callback) {
	var xmlDoc = libxmljs.parseXml(xml); // Sync func

	if(!xmlDoc)
		return callback({message: "Error: Parsing XML"});

	var catalog = {
		dbId: xmlDoc.root().attr("dbId").value(),
		lang: xmlDoc.root().attr("lang").value(),
		Table_Schema: xmlDoc.root().attr("Table_Schema").value(),
		Table_Name: xmlDoc.root().attr("Table_Name").value(),
		mode: xmlDoc.root().attr("mode").value(),
		controlType: xmlDoc.root().attr("controlType").value()
	};

	var fileTemplate = xmlDoc.root().attr("fileTemplate");
	if(fileTemplate)
		catalog.fileTemplate = fileTemplate.value();

	callback(null, catalog);
};

/**
 * Get Filename Location from Catalog
 */
Class.prototype.getFilename = function(catalog, callback) {
	var sLocation = path.join(
		this.config.ui.guis[this.params.output].cache,
		catalog.dbId,
		catalog.lang,
		catalog.Table_Schema,
		catalog.Table_Name,
		catalog.mode
	);

	var sFileName = path.join(sLocation, catalog.controlType + '.js');

	// ToDo: Use Async functions?
	if(fs.existsSync(sFileName) && this.params.rebuild !== '1') {
		console.info('# PanaxJS - Existing file: ' + sFileName);
		callback(null, true, sFileName);
	} else {
		if(fs.existsSync(sFileName)) {
			fs.unlinkSync(sFileName);
			console.info('# PanaxJS - Deleted file: ' + sFileName);
		}
		if(!fs.existsSync(sLocation)) {
			mkdirp(sLocation);
			console.info('# PanaxJS - Mkdirp folder: ' + sLocation);
		}

		console.info('# PanaxJS - Missing file: ' + sFileName);
		callback(null, false, sFileName);
	}
};

/**
 * Get Results object from XML (from updateDB)
 */
Class.prototype.getResults = function(xml, callback) {
	var xmlDoc = libxmljs.parseXml(xml); // Sync func

	if(!xmlDoc)
		return callback({message: "Error: Parsing XML"});

	var results = [];

	xmlDoc.root().childNodes().forEach(function (child) {
		var res = {};
		var attrs = child.attrs();
		for(var i=0;i<attrs.length;i++) {
			res[attrs[i].name()] = attrs[i].value();
		}
		results.push(res);
	});

	callback(null, results);
};

/**********************
 * Config Methods
 **********************/

/**
 * Wrapper for SQL Queries:
 * [$Table].exportConfig
 * [$Table].config
 */
Class.prototype.tableConfig = function(args, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Table].exportConfig';

		if(args.length) {
			sql_str = 'EXEC [$Table].config ';
			sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');
		}

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		});
	});
}

/**
 * Wrapper for SQL Query:
 * [$Table].clearConfig
 */
Class.prototype.clearConfig = function(args, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Table].clearConfig ';

		sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		});
	});
}

/**
 * Wrapper for SQL Query:
 * [$Table].clearCache
 */
Class.prototype.clearCache = function(args, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Ver:' + that.config.db.version + '].clearCache ';

		sql_str += args.map(function(arg) {return '\''+arg+'\'';}).join(', ');

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		});
	});
}

/**
 * Wrapper for SQL Query:
 * [$Metadata].rebuild
 */
Class.prototype.rebuildMetadata = function(callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Metadata].rebuild';

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			//console.info('# PanaxJS - sql_str: ' + sql_str);

			callback(null, recordset);
		});
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

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'SELECT @@version as version';

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			if(!recordset[0])
				return callback({message: "Error: Missing Vendor Info"});

			callback(null, recordset[0]);
		});
	});
};

/**
 * Wrapper for SQL Procedure:
 * [$PanaxDB].Authenticate
 */
Class.prototype.authenticate = function(username, password, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = '[$Security].Authenticate';

		sql_req.input('username', sql.VarChar, username);
		sql_req.input('password', sql.VarChar, password);

		sql_req.execute(sql_str, function (err, recordsets, returnValue) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var userId = recordsets[0][0].userId;
			//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"

			callback(null, userId);
		});
	});
};

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].UserSitemap
 */
Class.prototype.getSitemap = function(callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = '[$Security].UserSitemap @@userId=' + that.params.userId;

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0]['userSiteMap'];

			if(!xml)
				return callback({message: "Error: Missing Sitemap XML"});

			callback(null, xml);
		});
	});
};

/**********************
 * CRUD Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * [$Table].getCatalogOptions
 */
Class.prototype.getCatalogOptions = function(args, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Table].getCatalogOptions @@userId=' + that.params.userId + ", @catalogName='" + args.catalogName + "', " +
									"@valueColumn='" + args.valueColumn + "', @textColumn='" + args.textColumn + "'";

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		});
	});
};

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].getXmlData
 */
// ToDo: Rename to getXmlData?
Class.prototype.getXML = function(callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Ver:' + that.config.db.version + '].getXmlData ' + that.toParamsString(that.params);

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		});
	});
};

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].UpdateDB
 */
Class.prototype.updateDB = function(xml, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = "[$Tables].UpdateDB @userId=" + that.params.userId + ", @updateXML='" + xml + "'";

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		});
	});
};

/**********************
 * Module Export
 **********************/

module.exports = Class;
