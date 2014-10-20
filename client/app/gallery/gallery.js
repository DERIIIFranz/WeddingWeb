'use strict';

angular.module('weddingWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gallery', {
        url: '/gallery',
        templateUrl: 'app/gallery/gallery.html',
        controller: 'GalleryCtrl'
      });
  });