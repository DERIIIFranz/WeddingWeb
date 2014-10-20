'use strict';

describe('Controller: GuestbookCtrl', function () {

  // load the controller's module
  beforeEach(module('weddingWebApp'));

  var GuestbookCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GuestbookCtrl = $controller('GuestbookCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
