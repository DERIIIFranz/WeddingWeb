'use strict';

var _ = require('lodash');
var fs = require('fs');
var Image = require('./image.model');

// Get list of images
exports.index = function(req, res) {
	Image.find(function(err, images) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(200, images);
	});
};

// Get a single image
exports.show = function(req, res) {
	var full_path = "server\\uploads\\images\\" + req.params.id;
	Image.find({
		path : full_path
	}, function(err, img) {
		if (err) {
			return handleError(res, err);
		}
		if (!img) {
			return res.send(404);
		}

		fs.exists(full_path, function(exists) {
			if (!exists) {
				res.json(404, "image " + req.params.id + " not found");
			} else {
				fs.readFile(full_path, "binary", function(err, file) {
					res.writeHeader(200);
					res.write(file, "binary");
					res.end();
				});
			}
		});

	});
};

// Creates a new image in the DB.
exports.create = function(req, res) {
	var img = {
		name : req.files.file.name,
		path : req.files.file.path,
		alt : req.files.file.fieldname,
		size : req.files.file.size,
		type : req.files.file.mimetype,
		uploadedBy : 'admin',
		uploadTime : Date.now(),
		active : true
	};

	Image.create(img, function(err, file) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(201, file);
	});
};

// Updates an existing image in the DB.
exports.update = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Image.findById(req.params.id, function(err, image) {
		if (err) {
			return handleError(res, err);
		}
		if (!image) {
			return res.send(404);
		}
		var updated = _.merge(image, req.body);
		updated.save(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.json(200, image);
		});
	});
};

// Deletes an image from the DB.
exports.destroy = function(req, res) {
	Image.findById(req.params.id, function(err, image) {
		if (err) {
			return handleError(res, err);
		}
		if (!image) {
			return res.send(404);
		}
		image.remove(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.send(204);
		});
	});
};

function handleError(res, err) {
	return res.send(500, err);
}