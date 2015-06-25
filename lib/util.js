/**
 * Util functions
 */
var crypto = require('crypto');
var fs = require('fs');
var libxmljs = require('libxslt').libxmljs;

exports.md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

exports.sanitizeJSONString = function(json_str) {
	var tmp = json_str.split('\n');
	// HACK: Remove first "<?xml..." line manually for non-xml outputs
	if (json_str.indexOf('<?xml') == 0) {
		tmp.splice(0, 1);
	}
	//Remove newlines
	json_str = tmp.join(' ');
	return json_str;
};

exports.deleteFolderRecursive = function deleteFolderRecursive(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

/**********************
 * Utility Methods
 **********************/

/**
 * To String
 */
exports.toParamsString = function(params) {
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

	return result.join(', ');;
};

/**
 * Get Catalog object from XML (from getXMLData)
 */
exports.parseCatalog = function(xml, callback) {
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
exports.getFilename = function(config, params, catalog, callback) {
	var sLocation = path.join(
		config.ui.guis[params.output].cache,
		catalog.dbId,
		catalog.lang,
		catalog.Table_Schema,
		catalog.Table_Name,
		catalog.mode
	);

	var sFileName = path.join(sLocation, catalog.controlType + '.js');

	// ToDo: Use fs.Async functions?
	if(fs.existsSync(sFileName) && params.rebuild !== '1') {
		//console.info('# PanaxJS - Existing file: ' + sFileName);
		callback(null, true, sFileName);
	} else {
		if(fs.existsSync(sFileName)) {
			fs.unlinkSync(sFileName);
			//console.info('# PanaxJS - Deleted file: ' + sFileName);
		}
		if(!fs.existsSync(sLocation)) {
			mkdirp(sLocation);
			//console.info('# PanaxJS - Mkdirp folder: ' + sLocation);
		}

		//console.info('# PanaxJS - Missing file: ' + sFileName);
		callback(null, false, sFileName);
	}
};

/**
 * Get Results object from XML (from persist)
 */
exports.parseResults = function(xml, callback) {
	var xmlDoc = libxmljs.parseXml(xml); // Sync func

	if(!xmlDoc)
		return callback({message: "Error: Parsing XML"});

	var results = [];

	xmlDoc.root().childNodes().forEach(function (result) {
		var result_attrs = result.attrs();
		var res = {};
		for(var i=0;i<result_attrs.length;i++) {
			res[result_attrs[i].name()] = result_attrs[i].value();
		}
		res.fields = [];
		result.childNodes().forEach(function (field) {
			var field_attrs = field.attrs();
			var fld = {};
			for(var i=0;i<field_attrs.length;i++) {
				fld[field_attrs[i].name()] = field_attrs[i].value();
			}
			if(field.value()) {
				fld.value = field.value();
			}
			res.fields.push(fld);
		});
		results.push(res);
	});

	callback(null, results);
};