/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Image = require('../api/image/image.model');
var fs = require('fs');

Thing.find({}).remove(function() {
	Thing.create({
		name : 'Development Tools',
		info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
	}, {
		name : 'Server and Client integration',
		info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
	}, {
		name : 'Smart Build System',
		info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
	}, {
		name : 'Modular Structure',
		info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
	}, {
		name : 'Optimized Build',
		info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
	}, {
		name : 'Deployment Ready',
		info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
	});
});

User.find({}).remove(function() {
	User.create({
		provider : 'local',
		name : 'Test User',
		email : 'test@test.com',
		password : 'test'
	}, {
		provider : 'local',
		role : 'admin',
		name : 'Admin',
		email : 'admin@admin.com',
		password : 'admin'
	}, function() {
		console.log('finished populating users');
	});
});

if (process.env.NODE_ENV == "test") {

	Image.find({}).remove(function() {
		createImage({
			name : 'img1_left_new.jpg',
			path : 'server/uploads/images/img1_left_new.jpg',
			alt : 'yeoman rotated to the left, slightly newer dateTimeOriginal than old one',
			size : 1000,
			type : 'image/jpg',
			uploadTime : Date.now(),
			dateTimeOriginal : new Date(Date.UTC('2013', '11', '10')),
			active : true
		});
		createImage({
			name : 'img1_left_old.jpg',
			path : 'server/uploads/images/img1_left_old.jpg',
			alt : 'yeoman rotated to the left, older dateTimeOriginal than new one',
			size : 1000,
			type : 'image/jpg',
			uploadTime : Date.now(),
			dateTimeOriginal : new Date(Date.UTC('2013', '10', '08')),
			active : true
		});
		createImage({
			name : 'img1.png',
			path : 'server/uploads/images/img1.png',
			alt : 'yeoman rotated to the left, without a specific dateTimeOriginal',
			size : 1000,
			type : 'image/png',
			uploadTime : Date.now(),
			dateTimeOriginal : Date.now(),
			active : true
		});
		createImage({
			name : 'img2.png',
			path : 'server/uploads/images/img2.png',
			alt : 'yeoman rotated to the left, without a specific dateTimeOriginal - inactive',
			size : 1000,
			type : 'image/png',
			uploadTime : Date.now(),
			dateTimeOriginal : Date.now(),
			active : false
		});

	});
}

function createImage(image) {
	Image.create({
		name : image.name,
		path : image.path,
		alt : image.alt,
		size : image.size,
		type : image.type,
		uploadTime : image.uploadTime,
		dateTimeOriginal : image.dateTimeOriginal,
		active : image.active
	});

	fs.exists(image.path, function(exist) {
		if (!exist)
			fs.linkSync('server/uploads/images/test_images_src/' + image.name, image.path);
	});
}
