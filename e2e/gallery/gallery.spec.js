'use strict';

process.env.NODE_ENV = "test";
var request = require('supertest');

describe('Gallery', function() {
	var page;
	var pTor;

	beforeEach(function() {
		browser.get('/gallery');
		page = require('./gallery.po');
		pTor = protractor.getInstance();
	});

	it('should show all images stored in db', function(done) {

		var actualCount = 0;
		var expectedCount;
		element(by.id('gallery')).all(by.tagName('img')).then(
				function(li) {
					actualCount = Object.keys(li).length;
					request(pTor.baseUrl).get('/api/images').set('Accept',
							'application/json').expect('Content-Type', /json/)
							.expect(200).end(function(err, data) {
								if (err)
									return done(err);
								expectedCount = Object.keys(data.body).length;

								expect(expectedCount).toBe(actualCount);
								done();

							});
				});
	});

	it('should delete an image when according button is clicked',
			function(done) {
				element.all(by.buttonText('Löschen')).then(
						function(deleteButtons) {
							expect(deleteButtons.length).toBe(2);
							deleteButtons[0].click();
							element.all(by.buttonText('Löschen')).then(
									function(deleteButtons) {
										expect(deleteButtons.length).toBe(1);
										done();
									});
						});
			});
});
