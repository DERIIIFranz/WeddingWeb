'use strict';

var express = require('express');
var controller = require('./image.controller');
var multer = require('multer');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.use(multer({
	dest : 'server/uploads/images',
	rename : function(fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + "-" + Date.now();
	},
	limits : {
		fieldSize : 200
	},
	onFileUploadStart : function(file) {
		console.log(file.originalname + ' is being uploaded ...');
	},
	onFileUploadData : function(file, data) {
	//	console.log(file.size + ' of ' + file.name); <-- PROGRESS
	}
}));

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('paparazzo'), controller.create);
router.put('/:id', auth.hasRole('paparazzo'), controller.update);
router.patch('/:id', auth.hasRole('paparazzo'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router; 