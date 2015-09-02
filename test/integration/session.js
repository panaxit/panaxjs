var expect = require('chai').expect;
var PanaxJS = require('../..');
var panax_config = require('../../config/panax');
var panax_instance = panax_config.instances[panax_config.default_instance];
var util = require('../../lib/util');

describe('session', function() {

	var panaxdb = new PanaxJS.Connection(panax_instance);

	it('should not #getSitemap when not authenticated', function(done) {
		panaxdb.getSitemap(function (err, res) {
			expect(err).to.exist;
			expect(res).to.not.exist;
			done();
		});
	});

	it('should #getInfo without being aunthenticated', function(done) {
		panaxdb.getInfo(function (err, res) {
			if(err) return done(err);
			expect(res).to.be.ok;
			done();
		});
	});

	it('should #authenticate with valid credentials', function(done) {
		panaxdb.authenticate(panax_instance.ui.username, util.md5(panax_instance.ui.password), function (err, userId) {
			if(err) return done(err);
			expect(userId).to.be.ok;
			panaxdb.setParam("userId", userId);
			done();
		});
	});

	it('should #getSitemap when authenticated', function(done) {
		panaxdb.getSitemap(function (err, res) {
			if(err) return done(err);
			expect(res).to.be.ok;
			done();
		});
	});

});