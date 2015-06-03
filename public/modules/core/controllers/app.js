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
  
.controller('mainctrl',function($scope, $rootScope, $http){
	$http.get('/app/core/user/').success(function(data, status, headers, config) {
		$rootScope.user = data;	
		console.log("We got "+data);
		//console.log($rootScope.user);
		if ($rootScope.user != ""){
			console.log($rootScope.user);
			$rootScope.loginText = 'Log Out';
		} else {
			console.log($rootScope.user);
			$rootScope.loginText = 'Log In';
		}		
	});
	$scope.onLoginClick = function ()
	{
		if ($rootScope.user && $rootScope.user != ""){
			$http.get('/app/core/logout/').success(function(data, status, headers, config){
				$rootScope.loginText = 'Log In';
				$rootScope.user = "";
			});
		}
	}
	$scope.toLogin = function ()
	{
		if ($rootScope.user && $rootScope.user != ""){
			window.location.href="/#/folders";
		} else {
			window.location.href="/#/login";
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
	  .when('/photos/:tagName/:photoId', {
        templateUrl: 'modules/photos/views/photosIdent.html',
		controller: 'photosidCtrl'
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