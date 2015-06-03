'use strict';

/**
 * @ngdoc show folders
 * @name Photo app
 * @description
 * # Photo app
 *
 * Main module of the application.
 */
 angular
.module('photoApp')
.controller('loginCtrl', ['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
		$scope.initUser = function(){
			var newUser = {};
			newUser.username = "";
			newUser.password = "";
			$scope.user = newUser;
		};
		$scope.login = function() {
			console.log("Send");
			console.log($scope.user);
			$http.post('/app/core/login/', $scope.user).success(function(data, status, headers, config){
				console.log(data);
				if(data != ""){
					$rootScope.user = data;
					$rootScope.loginText = 'Log Out';
					console.log("Move");
					window.location.href="/#/folders";
				}
			});
		};
	}
]);