'use strict';

var AdminPage = function() {
	this.login = $('.navbar-right a[href="/login"]');
	this.loginEmail = $('.ng-valid-email input[type="email"]');
	this.loginPassword = $('.ng-valid-email input[type="password"]');
	this.loginSubmit = $('.ng-valid-email button[type="submit"]');
	this.logoutLink = $('.navbar').element(by.linkText('Logout'));
	this.adminPanelLink = $('.navbar').element(by.linkText('Admin'));
	this.settingsLink = $('.navbar-right a[href="/settings"]');
	this.user = function(userMail) {
		 return element(by.cssContainingText('span.ng-binding', userMail)).element(by.xpath('ancestor::li'));
	};
	this.labelUserRole = function(userMail) {
		return this.user(userMail).element(by.id('assignedRole'));
	};
	this.optionRole = function(userMail, role) {
		return this.user(userMail).element(by.cssContainingText('option', role));
	};
};

module.exports = new AdminPage();