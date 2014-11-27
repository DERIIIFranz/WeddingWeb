/**
 * This file uses the Page Object pattern to define the gallery page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var GalleryPage = function() {
	this.galleryLink = $('.navbar').element(by.linkText('Gallery'));
	this.deleteButton = function(fileName) {
		return $('div[id^="controlls-' + fileName + '-"] button[id="delete"]');
	};
	this.deleteButtons = element(by.id('gallery')).all(by.id('delete'));
	this.galleryImages = element(by.id('gallery')).all(by.tagName('img'));
	this.uploadField = element(by.id('upload-file-field'));
	this.uploadForm = $('#upload-form');
	this.navbarToggle = $('.navbar-header button.navbar-toggle');
	this.login = $('.navbar-right a[href="/login"]');
	this.loginEmail = $('.ng-valid-email input[type="email"]');
	this.loginPassword = $('.ng-valid-email input[type="password"]');
	this.loginSubmit = $('.ng-valid-email button[type="submit"]');
	this.logoutLink = $('.navbar').element(by.linkText('Logout'));
};

module.exports = new GalleryPage();
