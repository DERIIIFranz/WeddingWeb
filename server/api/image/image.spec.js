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
		
		Image.count({}, function(err,data) {
			countImages = data;
		});
		
		request(app).get('/api/images').expect(200).expect('Content-Type', /json/).end(function(err, res) {
			if (err)
				return done(err);
			countImages.should.equal(Object.keys(res.body).length);
				done();
		});
	});
});  

describe('POST /api/images', function() {
	it('should upload an image', function(done) {
		
		request(app).post('/api/images')
		.field('extra_info', '{"description":"Image of Yeoman"}')
		.attach(
			'photo', 'client/assets/images/yeoman.png'
			).end(function(err, res) {
			res.should.have.status(201);
			fs.unlinkSync(res.body.path); 
			done();
		});
	});
});