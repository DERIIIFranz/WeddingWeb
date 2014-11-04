'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Image = require('../image/image.model');
var fs = require('fs');

describe('GET /api/images', function() {

	it('should respond with JSON array', function(done) {
		request(app).get('/api/images').expect(200).expect('Content-Type', /json/).end(function(err, res) {
			if (err)
				return done(err);
			res.body.should.be.instanceof(Array);
			done();
		});
	});

	it('should be possible to receive all stored images ', function(done) {

		var countImages;

		Image.count({}, function(err, data) {
			countImages = data;
		});

		request(app).get('/api/images').expect(200).expect('Content-Type', /json/).end(function(err, res) {
			if (err)
				return done(err);
			countImages.should.equal(Object.keys(res.body).length);
			countImages.should.be.exactly(2);
			done();
		});
	});
	 
	after(function(done) {
		Image.remove({}, done);
	});
});

describe('POST /api/images', function() {
	it('should upload an image', function(done) {

		request(app).post('/api/images').field('extra_info', '{"description":"Image of Yeoman"}').attach('file', 'client/assets/images/yeoman.png').end(function(err, res) {
			res.should.have.status(201);
			cleanupImage(res.body.path);
			done();
		});
	});
});

function cleanupImage(imgPath) {
	fs.unlinkSync(imgPath);
	Image.remove({
		path : imgPath
	}, function(err, data) {
		if (err)
			console.log(err);
	});
}
