'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
  name: String,
  path: String,
  alt: String,
  size: Number,
  type: String,
  active: Boolean
});

module.exports = mongoose.model('Image', ImageSchema);