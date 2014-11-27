'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Image = require('../image/image.model');
var fs = require('fs');
var gm = require('gm');
var User = require('../user/user.model');
var async = require('async');

describe('API/IMAGES', function() {
	var fadmin, fGuest;
	var PATH_IMAGES = 'server/uploads/images';
	var PATH_TEST_IMAGES = 'server/uploads/images/test_images_src';

	beforeEach(function(done) {
		fadmin = new User({
			provider : 'local',
			name : 'Fake Admin',
			role : 'admin',
			email : 'fadmin@fadmin.com',
			password : 'fadmin'
		});

		fGuest = new User({
			provider : 'local',
			name : 'Fake Guest',
			role : 'guest',
			email : 'fguest@fguest.com',
			password : 'fguest'
		});

		fadmin.save(function(err, data) {
			if (err)
				done(err);
			fGuest.save(function(err, data) {
				if (err)
					done(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		User.remove({}, function(err) {
			if (err)
				done(err);
		});
		done();
	});

	describe('GET', function() {

		it('should respond with JSON array', function(done) {
			request(app).get('/api/images').expect(200).expect('Content-Type', /json/).end(function(err, res) {
				if (err)
					return done(err);
				res.body.should.be.instanceof(Array);
				done();
			});
		});

		it('should be possible to receive all images stored in DB ', function(done) {

			var countImages;

			Image.count({}, function(err, data) {
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

	describe('POST', function() {

		describe('Unauthenticated', function() {
			it('should forbid upload for unauthenticated user', function(done) {

				var fsImageCount = getFSImageCount();
				request(app).post('/api/images').attach('file', PATH_TEST_IMAGES + '/img1.png').expect(401, function(err, res) {
					fsImageCount.should.be.exactly(getFSImageCount());

					done();
				});
			});
		});

		describe('Unauthorized', function() {
			var token = {
				key : null
			};

			beforeEach(function(done) {
				login(fGuest.email, fGuest.password, token, done);
			});

			afterEach(function(done) {
				logout(done);
			});

			it('should forbid upload for unauthorized user', function(done) {
				var fsImageCount = getFSImageCount();
				request(app).post('/api/images').set({
					Authorization : 'Bearer ' + token.key
				}).attach('file', PATH_TEST_IMAGES + '/img1.png').expect(403, function(err, res) {
					fsImageCount.should.be.exactly(getFSImageCount());

					done();
				});
			});
		});

		describe('Authorized', function() {
			var token = {
				key : null
			};

			beforeEach(function(done) {
				login(fadmin.email, fadmin.password, token, done);
			});

			afterEach(function(done) {
				logout(done);
			});

			it('should upload an image', function(done) {
				var fsImageCount = getFSImageCount();

				request(app).post('/api/images').set({
					Authorization : 'Bearer ' + token.key
				}).attach('file', PATH_TEST_IMAGES + '/img1.png').end(function(err, res) {
					res.should.have.status(201);

					fsImageCount.should.be.exactly(getFSImageCount() - 1);
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
	});

	describe('DELETE', function() {
		describe('Unauthenticated', function(done) {
			it('should not be allowed for unauthenticated users to delete an image', function(done) {
				request(app).delete('/api/images/' + 'img1.png').end(function(err, res) {
					res.should.have.status(401);
					done();
				});
			});

		});

		describe('Unauthorized', function(done) {
			var token = {
				key : null
			};

			beforeEach(function(done) {
				login(fGuest.email, fGuest.password, token, done);
			});

			afterEach(function(done) {
				logout(done);
			});

			it('should not be allowed for unauthorised users to delete an image', function(done) {
				request(app).delete('/api/images/' + 'img1.png').set({
					Authorization : 'Bearer ' + token.key
				}).end(function(err, res) {
					res.should.have.status(403);
					done();
				});
			});
		});

		describe('Authorized', function() {

			var token = {
				key : null
			};

			beforeEach(function(done) {
				login(fadmin.email, fadmin.password, token, done);
			});

			afterEach(function(done) {
				logout(done);
			});

			it('should delete an image from DB and FS', function(done) {
				request(app).post('/api/images').set({
					Authorization : 'Bearer ' + token.key
				}).attach('file', PATH_TEST_IMAGES + '/img1.png').end(function(err, res) {
					if (err)
						done(err);
					res.should.have.status(201);
					request(app).delete('/api/images/' + res.body.name).set({
						Authorization : 'Bearer ' + token.key
					}).end(function(err, res) {
						res.should.have.status(200);
						done();
					});
				});
			});

			it('should handle error on non-existing image', function(done) {
				request(app).delete('/api/images/' + "nonExistingFile.jpg").set({
					Authorization : 'Bearer ' + token.key
				}).end(function(err, res) {
					res.should.have.status(404);
					done();
				});
			});

			it('should delete image from DB, when not existing on FS', function(done) {

				var imagePath, imageName;

				async.series([

				function(cb) {
					request(app).post('/api/images').set({
						Authorization : 'Bearer ' + token.key
					}).attach('file', PATH_TEST_IMAGES + '/img1.png').expect(201, function(err, res) {
						(err === null).should.be.true;
						imagePath = res.body.path;
						imageName = res.body.name;

						cb(err, res);
					});
				},
				function(cb) {
					fs.exists(imagePath, function(exists) {
						exists.should.be.true;
						fs.unlinkSync(imagePath);
						fs.exists(imagePath, function(exists) {
							exists.should.be.false;
						});
					});
					cb();
				},
				function(cb) {
					var imageCountBeforeDeletion;
					Image.count({}, function(err, data) {
						imageCountBeforeDeletion = data;
					});
					request(app).delete('/api/images/' + imageName).set({
						Authorization : 'Bearer ' + token.key
					}).expect(200, function(err, res) {
						Image.count({}, function(err, data) {
							(imageCountBeforeDeletion - data).should.be.exactly(1);
						});
						cb(err, res);
					});
				}], function(err, results) {
					if (err)
						done(err);
					done();
				});

			});

			it('should delete image from FS, when not existing in DB', function(done) {
				request(app).post('/api/images').set({
					Authorization : 'Bearer ' + token.key
				}).attach('file', PATH_TEST_IMAGES + '/img1.png').end(function(err, res) {
					res.should.have.status(201);
					var imagePath = res.body.path;
					Image.remove({
						path : imagePath
					}, function(err, data) {
						(err === null).should.be.true;
					});

					fs.exists(imagePath, function(exists) {
						exists.should.be.true;
					});

					request(app).delete('/api/images/' + res.body.name).set({
						Authorization : 'Bearer ' + token.key
					}).end(function(err, res) {
						res.should.have.status(200);
						fs.exists(imagePath, function(exists) {
							exists.should.be.false;
						});
						done();
					});
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
	};

	function login(email, password, tokenRefObj, done) {
		var credentials = {
			email : email,
			password : password
		};
		request(app).post('/auth/local').send(credentials).expect(200).end(onResponse);

		function onResponse(err, res) {
			if (err) {
				done(err);
			}
			tokenRefObj.key = res.body.token;
			done();
		}

	};

	function logout(done) {
		request(app).get('/auth/local/logout').expect(302).end(function(err, res) {
			done();
		});
	};
	/***
	 * returns quantity of images in upload folder.
	 */
	function getFSImageCount() {
		var countImages = fs.readdirSync(PATH_IMAGES).length;
		return countImages;
	}
});
