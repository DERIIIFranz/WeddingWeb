'use strict';

describe('Main View', function() {
	var page;
	var pTor;

	beforeEach(function() {
		browser.get('/');
		page = require('./main.po');
		pTor = protractor.getInstance();
	});

	it('should include jumbotron with correct data', function() {
		expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
		expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
		expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
	});

	describe('Main Menu', function() {
		beforeEach(function() {
			browser.get('/');
		});

		it('should show gallery on gallery-button clicked', function() {
			page.navMain.element(by.linkText('Gallery')).click();
			expect(pTor.isElementPresent(element(by.id('gallery'))));
		});

		it('should show guestbook on guestbook-button clicked', function() {
			page.navMain.element(by.linkText('Guestbook')).click();
			expect(pTor.isElementPresent(element(by.id('guestbook'))));
		});
	});
});
