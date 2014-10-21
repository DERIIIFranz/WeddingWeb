'use strict';

var express = require('express');
var controller = require('./image.controller');
var multer = require('multer');

var router = express.Router();

router.use(multer({
	dest : 'server/uploads/images',
	rename : function(fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + "-" + Date.now();
	},
	limits : {
		fieldSize : 100
	},
	onFileUploadStart : function(file) {
		console.log(file.originalname + ' is being uploaded ...');
	}
}));

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


module.exports = router;