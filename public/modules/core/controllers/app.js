'use strict';


/**
 * @ngdoc overview
 * @name Photo App
 * @description
 * # Photo Group App
 *
 * Main module of the application.
 */
 
 angular
  .module('photoApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  
.controller('mainctrl',function($scope, $http){
	$scope.isLoggedIn = false;
	console.log("starting:")
	console.log($scope.isLoggedIn);
	 $scope.loginText = 'Log in';
	 $scope.onLoginClick = function ()
	 {
		if ($scope.isLoggedIn) {
			$scope.isLoggedIn = false;
			console.log("if");
			console.log($scope.isLoggedIn)
			$scope.loginText = "Log in";
		}
		else if (!$scope.isLoggedIn){
			$scope.isLoggedIn = true;
			$scope.loginText = 'Log out';
			console.log('else');
			console.log($scope.isLoggedIn);
		}
	}
  }
  )
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/core/views/welcome.html'
	  })
	  .when('/login', {
        templateUrl: 'modules/core/views/login.html',
		controller  : 'mainctrl'
      })
      .when('/photos/:tagName', {
        templateUrl: 'modules/photos/views/photosView.html',
        controller: 'photosCtrl'
      })
	  .when('/folders', {
		templateUrl: 'modules/folders/views/foldersView.html',
		controller: 'foldersCtrl'
	  })
	  .when('/addphotos',{
		  templateUrl: 'modules/photos/views/addPhotos.html',
		  controller: 'addphotosCtrl'
	  })
	  .when('/addtags', {
		  templateUrl: 'modules/photos/tags/views/addTags.html',
		  controller: 'addtagCtrl'
	  })
      .otherwise({
        redirectTo: '/'
      });
  });