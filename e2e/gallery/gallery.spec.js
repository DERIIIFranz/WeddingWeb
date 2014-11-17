'use strict';

process.env.NODE_ENV = "test";
var request = require('supertest');
var path = require('path');

describe('Gallery', function() {
	var page;
	var pTor;

	beforeEach(function() {
		browser.get('/gallery');
		page = require('./gallery.po');
		pTor = protractor.getInstance();
	});

	function login(email, password) {
		page.login.isDisplayed().then(function(isDisplayed) {
			if(!isDisplayed)
				page.navbarToggle.isDisplayed().then(function(isDisplayed) {
					expect(isDisplayed).toBe(true);
					page.navbarToggle.click();
				});
		});
		
		page.login.click();
		page.loginEmail.sendKeys(email);
		page.loginPassword.sendKeys(password);
		page.loginSubmit.click();
		page.galleryLink.click();
		
		page.logoutLink.isDisplayed().then(function(isDisplayed){
			expect(isDisplayed).toBe(true);
		});
	};
	
	function logout() {
		page.logoutLink.isDisplayed().then(function(isDisplayed) {
			if(!isDisplayed)
				page.navbarToggle.isDisplayed().then(function(isDisplayed) {
					expect(isDisplayed).toBe(true);
					page.navbarToggle.click();
				});
		});
		page.logoutLink.click();
	};

	it('should upload and delete an image when according button is clicked',
			function(done) {
				// UPLOAD
				var deleteButtonsCount;
				var fileName = "img2";
				var fileExt = ".png";

				page.deleteButtons.then(function(deleteButtons) {
					deleteButtonsCount = deleteButtons.length;
					// Image without dateTimeOriginal to be ordered last
					// in list
					page.uploadField.sendKeys(path.resolve(__dirname,
							'../../server/uploads/images/test_images_src/'
									+ fileName + fileExt));

					page.deleteButtons.then(function(deleteButtons) {
						expect(deleteButtons.length).toBe(
								deleteButtonsCount + 1);
					});
				});
				// DELETE
				$('div[id^="controlls-' + fileName + '-"] button[id="delete"')
						.then(
								function(deleteButton) {
									deleteButton.click();
									page.deleteButtons.then(function(
											deleteButtons) {
										expect(deleteButtons.length).toBe(
												deleteButtonsCount);
										done();
									});

								});

			});

	it('should order images by dateTimeOriginal by default', function(done) {
		var path_img1, path_img2;

		page.galleryImages.then(function(images) {
			images[0].getAttribute('src').then(function(src) {
				expect(src).toMatch(/img1_left_old.jpg$/);
			});
			images[1].getAttribute('src').then(function(src) {
				expect(src).toMatch(/img1_left_new.jpg$/);
			});
		});
		done();
	});

	it('should not display upload-form for unauthorised users',
			function(done) {
				page.uploadForm.isDisplayed().then(function(isDisplayed) {
					expect(isDisplayed).toBe(false);
				});

				login('test@test.com', 'test');
				page.uploadForm.isDisplayed().then(function(isDisplayed) {
					expect(isDisplayed).toBe(false);
					logout();
					done();
				});
			});

	it('should display upload-form for authorised users', function(done) {
		login('papa@razzo.com', 'papa');

		page.uploadForm.isDisplayed().then(function(isDisplayed) {
			expect(isDisplayed).toBe(true);
			logout();
			done();
		});
	});
});
