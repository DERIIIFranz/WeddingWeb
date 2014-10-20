'use strict';

angular.module('weddingWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('guestbook', {
        url: '/guestbook',
        templateUrl: 'app/guestbook/guestbook.html',
        controller: 'GuestbookCtrl'
      });
  });