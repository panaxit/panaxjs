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
var sql = require('mssql')
var Promise = require('i-promise')
var util = require('./lib/util')

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

var chalk = require('chalk')
var noop = function() {} // eslint-disable-line func-style
var debug = (process.env.NODE_ENV === 'development') ? {
  info: function(str) {
    console.log(chalk.bold.blue(str)) // eslint-disable-line no-console
  },
} : {
  info: noop,
}

/**********************
 * Class
 **********************/

/**
 * Constructor
 * @param {Object} config Panax config
 * @param {Object} params Default panax parameters
 */
/* eslint-disable complexity*/
function Class(config, params) {

  this.config = config

  if (!params) {
    this.params = {
      userId: undefined,
    }
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
      lang: params.lang || 'DEFAULT',
    }
  }

  this.sqlConn = new Promise(function(resolve, reject) {
    var conn = new sql.Connection(config.db, function(err) {
      if (err) {
        return reject(err)
      }
      return resolve(conn)
    })
  })
}
/* eslint-enable complexity*/

/**
 * Property setter
 * @param {String} name  Property name
 * @param {*}      value Property value
 */
Class.prototype.setParam = function(name, value) {
  if (this.params.hasOwnProperty(name)) {
    this.params[name] = value
  }
}

/**********************
 * Config Methods
 **********************/

/**
 * Run raw SQL query
 * @param  {String}   sqlStr  SQL String
 * @param  {Function} callback Callback fn returns Recordset
 */
Class.prototype.query = function(sqlStr, callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    sqlStr = sqlStr.replace(/^GO.*$/mg, '/**GO**/') // Remove GO statements
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      callback(null, recordset)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Query:
 * #panax.rebuildMetadata
 * @param  {Function} callback Callback fn returns Recordset
 */
Class.prototype.rebuildMetadata = function(callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '#panax.rebuildMetadata'
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      callback(null, recordset)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Queries:
 * #entity.config
 * #entity.exportConfig
 * @param  {Array}    args     Arguments
 * @param  {Function} callback Callback fn returns Recordset
 */
Class.prototype.config = function(args, callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '#entity.exportConfig'
    if (args.length) {
      sqlStr = '#entity.config '
      sqlStr += args.map(function(arg) {
        return '\'' + arg + '\''
      }).join(', ')
    }
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      callback(null, recordset)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Query:
 * #entity.clearConfig
 * @param  {Array}    args     Arguments
 * @param  {Function} callback Callback fn returns Recordset
 */
Class.prototype.clearConfig = function(args, callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '#entity.clearConfig ' + args.map(function(arg) {
      return '\'' + arg + '\''
    }).join(', ')
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      callback(null, recordset)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Query:
 * #entity.clearCache
 * @param  {Array}    args     Arguments
 * @param  {Function} callback Callback fn returns Recordset
 */
Class.prototype.clearCache = function(args, callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '#entity.clearCache ' + args.map(function(arg) {
      return '\'' + arg + '\''
    }).join(', ')
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      callback(null, recordset)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**********************
 * Session Methods
 **********************/

/**
 * Get db Info
 * @param  {Function} callback Callback fn returns Record
 */
Class.prototype.getInfo = function(callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = 'SELECT @@version as vendor_ver, #database.getConfig(\'px:version\') AS panaxdb_ver'
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      if (!recordset[0]) {
        return callback({
          message: 'Error: Missing Vendor Info',
        })
      }
      callback(null, recordset[0])
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Procedure:
 * #panax.authenticate
 * @param  {String}   username Username
 * @param  {String}   password Password (hash)
 * @param  {Function} callback Callback fn returns User ID
 */
Class.prototype.authenticate = function(username, password, callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '[$Security].Authenticate'
    sqlReq.input('username', sql.VarChar, username)
    sqlReq.input('password', sql.VarChar, password)
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.execute(sqlStr).then(function(recordsets) {
      var userId = recordsets[0][0].userId
      callback(null, userId)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Query:
 * #panax.getSitemap
 * @param  {Function} callback Callback fn returns XML Sitemap
 */
Class.prototype.getSitemap = function(callback) {
  var _self = this
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '[$Security].UserSitemap @@userId=' + _self.params.userId
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      var xml = recordset[0].userSiteMap
      if (!xml) {
        return callback({
          message: 'Error: Missing Sitemap XML',
        })
      }
      callback(null, xml)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**********************
 * Read Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * #entity.read
 * @param  {Function} callback Callback fn returns XML Entity
 */
Class.prototype.read = function(callback) {
  var _self = this
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    //var sqlStr = '#entity.read ' + util.toParamsString(_self.params);
    var sqlStr = '[$Ver:' + _self.config.db.version + '].getXmlData ' + util.toParamsString(_self.params)
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      var xml = recordset[0]['']
      if (!xml) {
        return callback({
          message: 'Error: Missing XML Data',
        })
      }
      callback(null, xml)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**
 * Wrapper for SQL Query:
 * #entity.options
 * @param  {Array}    args     Arguments
 * @param  {Function} callback Callback fn returns XML Catalog Options
 */
Class.prototype.options = function(args, callback) {
  var _self = this
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '[$Table].getCatalogOptions @@userId=' + _self.params.userId + ", @catalogName='" + args.catalogName +
                  "', " + "@valueColumn='" + args.valueColumn + "', @textColumn='" + args.textColumn + "'"
    if (args.filters) {
      sqlStr = sqlStr + ', @filters=' + args.filters + ''
    }
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      var xml = recordset[0]['']
      if (!xml) {
        return callback({
          message: 'Error: Missing XML Data',
        })
      }
      callback(null, xml)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**********************
 * Persist Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * #panax.persist
 * @param  {String}   xml      XML Payload
 * @param  {Function} callback Callback fn returns XML Results
 */
Class.prototype.persist = function(xml, callback) {
  var _self = this
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = '#Entity.[save] @userId=' + _self.params.userId + ", @updateXML='" + xml + "'"
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      var xmlResult = recordset[0]['']
      if (!xmlResult) {
        return callback({
          message: 'Error: Missing XML Data',
        })
      }
      callback(null, xmlResult)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**********************
 * Tools Methods
 **********************/

/**
 * Wrapper for SQL Query:
 * #panax.filters
 * @param  {String}   xml      XML Payload
 * @param  {Function} callback Callback fn returns XML Results
 */
Class.prototype.filters = function(xml, callback) {
  this.sqlConn.then(function(conn) {
    var sqlReq = new sql.Request(conn)
    var sqlStr = "SELECT filters=[$Tools].getFilterString('" + xml + "')"
    debug.info('# PanaxJS - sqlStr: ' + sqlStr)
    sqlReq.query(sqlStr).then(function(recordset) {
      var filters = recordset[0].filters
      if (!filters) {
        return callback({
          message: 'Error: Missing Filters Data',
        })
      }
      callback(null, filters)
    }).catch(function(err) {
      callback(err)
    })
  }).catch(function(err) {
    callback(err)
  })
}

/**********************
 * Module Export
 **********************/

module.exports.Connection = Class
module.exports.Util = util
