'use strict';

describe('Controller: GalleryCtrl', function() {

	// load the controller's module
	beforeEach(module('weddingWebApp'));

	var scope, httpBackend, createController, requestHandler;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope, $httpBackend) {
		scope = $rootScope.$new();
		httpBackend = $httpBackend;
		createController = function() {
			return $controller('GalleryCtrl', {
				$scope : scope
			});
		};
		requestHandler = httpBackend.when('GET', '/api/images').respond(200, [{
			"_id" : "5453888e17e1bd9c10e16a0d",
			"name" : "img1.jpg",
			"path" : "server\\uploads\\images\\img1.jpg",
			"alt" : "photo",
			"size" : 74335,
			"type" : "image/jpeg",
			"active" : false,
			"__v" : 0
		}, {
			"_id" : "54563ce4bcc4141812b68ae2",
			"name" : "img2.jpg",
			"path" : "server\\uploads\\images\\img2.jpg",
			"alt" : "photo",
			"size" : 52508,
			"type" : "image/jpeg",
			"active" : false,
			"__v" : 0
		}]);
	}));

	it('should mock the httpBackend correctly', function() {
		httpBackend.expectGET('/api/images');
		createController();
		httpBackend.flush();
		expect(scope.imageList.length).toEqual(2);
	});

});
