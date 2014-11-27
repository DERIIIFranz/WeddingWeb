'use strict';

angular.module('weddingWebApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    
    $scope.activeRole;	//placeholder
    
    Auth.getRoles(function(roles) {
    	$scope.roles = roles;
    });
    
    $scope.updateRole = function(user,role) {
    	User.update({ id: user._id}, {role: role}).$promise.then(function(data){
    		user.role = role;
    		console.dir(data);
    	});
    };

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
