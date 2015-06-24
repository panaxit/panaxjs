var expect = require('chai').expect;
var PanaxJS = require('../..');
var config = require('../../config/panax');
var util = require('../../lib/util');

describe('Session', function() {

	var panaxdb = new PanaxJS(config, {
		userId: undefined
	});

	it('should not #getSitemap when not authenticated', function(done) {
		panaxdb.getSitemap(function (err, res) {
			expect(err).to.exist;
			expect(res).to.not.exist;
			done();
		});
	});

	it('should #getVendorInfo without being aunthenticated', function(done) {
		panaxdb.getVendorInfo(function (err, res) {
			if(err) return done(err);
			expect(res).to.be.ok;
			done();
		});
	});

	it('should #authenticate with valid credentials', function(done) {
		panaxdb.authenticate(config.ui.username, util.md5(config.ui.password), function (err, userId) {
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