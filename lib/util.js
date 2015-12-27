/**
 * Util functions
 */
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var libxmljs = require('libxmljs')

exports.md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

exports.sanitizeJSONString = function(jsonStr) {
  var tmp = jsonStr.split('\n')
  // HACK: Remove first "<?xml..." line manually for non-xml outputs
  if (jsonStr.indexOf('<?xml') === 0) {
    tmp.splice(0, 1)
  }
  //Remove newlines
  jsonStr = tmp.join(' ')
  return jsonStr
}

exports.deleteFolderRecursive = function deleteFolderRecursive(fPath) {
  if (fs.existsSync(fPath)) {
    fs.readdirSync(fPath).forEach(function(file) {
      var curPath = fPath + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(fPath)
  }
}

/**********************
 * Utility Methods
 **********************/

/**
 * Params To String
 * @param  {Object} params Params object
 * @return {String}        Concatenated params
 */
exports.toParamsString = function(params) {
  var result = []
  var prefix = '@'
  var value = ''
  var prop

  for (prop in params) {
    prefix = (prop !== 'userId') ? '@' : '@@'
    value = params[prop]

    if ((prop === 'tableName' || prop === 'mode') && value !== 'DEFAULT') {
      value = '\'' + params[prop] + '\''
    }

    result.push(prefix + prop + '=' + value)
  }

  return result.join(', ')
}

/**
 * Get Entity's Metadata object from XML (from getXMLData)
 * @param  {String}   xml      XML entity
 * @param  {Function} callback Callback fn returns Metadata
 * @return {Function}          callback
 */
exports.parseMetadata = function(xml, callback) {
  var xmlDoc = libxmljs.parseXml(xml) // Sync func
  var metadata, fileTemplate

  if (!xmlDoc) {
    return callback({
      message: 'Error: Parsing XML',
    })
  }

  metadata = {
    dbId: xmlDoc.root().attr('dbId').value(),
    lang: xmlDoc.root().attr('lang').value(),
    Table_Schema: xmlDoc.root().attr('Table_Schema').value(), // eslint-disable-line camelcase
    Table_Name: xmlDoc.root().attr('Table_Name').value(), // eslint-disable-line camelcase
    mode: xmlDoc.root().attr('mode').value(),
    controlType: xmlDoc.root().attr('controlType').value(),
  }

  fileTemplate = xmlDoc.root().attr('fileTemplate')
  if (fileTemplate) {
    metadata.fileTemplate = fileTemplate.value()
  }

  callback(null, metadata)
}

/**
 * Get Filename Location from Metadata
 * @param  {Object}   config   Panax config
 * @param  {Object}   params   Parameters
 * @param  {Object}   metadata Metadata
 * @param  {Function} callback Callback fn
 */
exports.getFilename = function(config, params, metadata, callback) {
  var sLocation = path.join(
    config.ui.guis[params.output].cache,
    metadata.dbId,
    metadata.lang,
    metadata.Table_Schema,
    metadata.Table_Name,
    metadata.mode
  )

  var sFileName = path.join(sLocation, metadata.controlType + '.js')

  // ToDo: Use fs.Async functions?
  if (fs.existsSync(sFileName) && params.rebuild !== '1') {
    //console.info('# PanaxJS - Existing file: ' + sFileName);
    callback(null, true, sFileName)
  } else {
    if (fs.existsSync(sFileName)) {
      fs.unlinkSync(sFileName)
      //console.info('# PanaxJS - Deleted file: ' + sFileName);
    }
    if (!fs.existsSync(sLocation)) {
      mkdirp(sLocation)
      //console.info('# PanaxJS - Mkdirp folder: ' + sLocation);
    }

    //console.info('# PanaxJS - Missing file: ' + sFileName);
    callback(null, false, sFileName)
  }
}

/**
 * Get Results object from XML (from persist)
 * @param  {String}   xml      XML Results
 * @param  {Function} callback Callback fn returns Results
 * @return {Function}          callback
 */
exports.parseResults = function(xml, callback) {
  var xmlDoc = libxmljs.parseXml(xml) // Sync func
  var results = []

  if (!xmlDoc) {
    return callback({
      message: 'Error: Parsing XML',
    })
  }

  xmlDoc.root().childNodes().forEach(function(resultNode) {
    var result = {}
    resultNode.attrs().forEach(function(attr) {
      result[attr.name()] = attr.value()
    })
    result.fields = []
    resultNode.childNodes().forEach(function(fieldNode) {
      var field = {}
      fieldNode.attrs().forEach(function(attr) {
        field[attr.name()] = attr.value()
      })
      if (fieldNode.text()) {
        field.value = fieldNode.text()
      }
      result.fields.push(field)
    })
    results.push(result)
  })

  callback(null, results)
}
