'use strict';

angular.module('weddingWebApp').controller('GalleryCtrl', function($scope, $http) {
	$scope.message = 'Hello';
	$scope.imageList = [];

	$http.get('/api/images').success(function(images) {
		$scope.imageList = images;
	});
});
