'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Image = require('../image/image.model');
var fs = require('fs');
var gm = require('gm');

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

/*
	it('should auto-orient images', function(done) {
		gm('server/uploads/images/img1_left_old.jpg').options({
			imageMagick : true
		}).identify(function(err, data) {
			if (err)
				console.log(err);
			else {
				console.log(data.Orientation);
				data.Orientation.should.not.equal(1);

				request(app).post('/api/images').field('extra_info', '{"description":"Image of Yeoman"}').attach('file', 'server/uploads/images/img1_left_old.jpg').end(function(err, res) {
					res.should.have.status(201);
					gm(res.body.path).options({
						imageMagick : true
					}).identify(function(err, data) {
						if (err)
							console.log(err);
						else {
							data.Orientation.should.equal(1);
							cleanupImage(res.body.path);
							done();
						}
					});
				});
			}
		});
	});
*/
});

describe('DELETE /api/images', function() {

	it('should delete an image from DB and FS', function(done) {
		request(app).post('/api/images').field('extra_info', '{"description":"Image of Yeoman"}').attach('file', 'client/assets/images/yeoman.png').end(function(err, res) {
			res.should.have.status(201);
			request(app).delete('/api/images/' + res.body.name).end(function(err, res) {
				res.should.have.status(200, "image " + res.body.name + " removed from DB and FS");
				done();
			});
		});
	});

	it('should handle error on non-existing image', function(done) {
		request(app).delete('/api/images/' + "nonExistingFile.jpg").end(function(err, res) {
			res.should.have.status(404);
			done();
		});
	});

	it('should delete image from DB, when not existing on FS', function(done) {
		request(app).post('/api/images').field('extra_info', '{"description":"Image of Yeoman"}').attach('file', 'client/assets/images/yeoman.png').end(function(err, res) {
			res.should.have.status(201);
			fs.unlink(res.body.path);
			request(app).delete('/api/images/' + res.body.name).end(function(err, res) {
				res.should.have.status(200, "image " + res.body.name + " only deleted from DB");
				done();
			});
		});
	});

	it('should delete image from FS, when not existing in DB', function(done) {
		request(app).post('/api/images').field('extra_info', '{"description":"Image of Yeoman"}').attach('file', 'client/assets/images/yeoman.png').end(function(err, res) {
			res.should.have.status(201);
			Image.remove({
				path : res.body.path
			});
			request(app).delete('/api/images/' + res.body.name).end(function(err, res) {
				res.should.have.status(200, "image " + res.body.name + " only deleted from FS");
				done();
			});
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
