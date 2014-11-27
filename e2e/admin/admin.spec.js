'use strict';

process.env.NODE_ENV = "test";
var request = require('supertest');
var path = require('path');

var page, pTor, loggedIn;

describe('Admin', function() {

	beforeEach(function() {
		page = require('./admin.po');
		pTor = protractor.getInstance();
		loggedIn = false;

		browser.get('/');
		login('admin@admin.com', 'admin');
		page.adminPanelLink.isDisplayed().then(function(isDisplayed) {
			expect(isDisplayed).toBe(true);
		});
		page.adminPanelLink.click();
	});

	afterEach(function() {
		logout();
	});

	it('should display user\'s role', function(done) {
		page.labelUserRole('test@test.com').getText().then(function(role) {
			expect(role).toMatch('user');
			done();
		});
	});

	it('should be able to switch user\'s role', function(done) {
		page.labelUserRole('test@test.com').getText().then(function(role) {
			expect(role).toMatch('user');
		});

		page.optionRole('test@test.com', 'paparazzo').click();
		page.labelUserRole('test@test.com').getText().then(function(role) {
			expect(role).toMatch('paparazzo');
		});
		// undo
		page.optionRole('test@test.com', 'user').click();
		page.labelUserRole('test@test.com').getText().then(function(role) {
			expect(role).toMatch('user');
			done();
		});
	});
});

function login(email, password) {
	if (loggedIn) return false;
	
	page.login.isDisplayed().then(function(isDisplayed) {
		if (!isDisplayed)
			page.navbarToggle.isDisplayed().then(function(isDisplayed) {
				expect(isDisplayed).toBe(true);
				page.navbarToggle.click();
			});
	});

	page.login.click();
	page.loginEmail.sendKeys(email);
	page.loginPassword.sendKeys(password);
	page.loginSubmit.click();

	page.logoutLink.isDisplayed().then(function(isDisplayed) {
		expect(isDisplayed).toBe(true);
		loggedIn = true;
	});
};

function logout() {
	if (loggedIn) {
		page.logoutLink.isDisplayed().then(function(isDisplayed) {
			if (!isDisplayed)
				page.navbarToggle.isDisplayed().then(function(isDisplayed) {
					expect(isDisplayed).toBe(true);
					page.navbarToggle.click();
				});
		});
		page.logoutLink.click();
		loggedIn = false;
	}
};